'use strict';

// import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {getPointer, warpPointer} from './diag_utils.js';
import {schemaId, SettingsKeys} from './preferences/keys.js';

export function print(msg) {
  log(msg);
  /*if (Main.lookingGlass && Main.lookingGlass.isOpen) {
    Main.lookingGlass.close();
    // Main.lookingGlass._pushResult('animo', msg);
  }*/
};

export function add_message(seqs, msg, delay) {
  seqs.push({
    func: () => print(msg),
    delay,
  });
}

export function add_move_pointer(seqs, x, y, delay) {
  seqs.push({
    x: x,
    y: y,
    func: (t) => {
      let p = getPointer();
      // print(`move ${t.x} ${t.y}`);
      warpPointer(p, t.x, t.y);
    },
    delay,
  });
}

export function add_slide_pointer(seqs, x, y, x2, y2, intervals, delay) {
  let dd = delay / intervals;
  let dx = (x2 - x) / intervals;
  let dy = (y2 - y) / intervals;

  for (let i = 0; i < intervals; i++) {
    // print(`${x} ${dx} ${dy} ${dd}`);
    seqs.push({
      x: x,
      y: y,
      func: (t) => {
        let p = getPointer();
        // print(`warp ${t.x} ${t.y}`);
        warpPointer(p, t.x, t.y);
      },
      delay: dd,
    });
    x += dx;
    y += dy;
  }
}

export function add_test_values(seqs, extension, settings, name, value, values) {
  let k = settings.getKey(name);
  if (k.test && k.test.values) {
    values = k.test.values;
  }
  values.forEach((c) => {
    seqs.push({
      func: () => {
        settings.setValue(name, c);
      },
      delay: 1000,
    });

    if (k.test) {
      let x = extension.dashContainer.position.x;
      let y = extension.dashContainer.position.y;
      let w = extension.dashContainer.width;
      let h = extension.dashContainer.height;
      switch (k.test.pointer) {
        case 'slide-through':
          add_slide_pointer(seqs, x, y + h / 2, x + w, y + h / 2, 20, 1.0);
          add_move_pointer(seqs, 0, 0, 0.5);
          break;
      }
    }
  });

  seqs.push({
    func: () => {
      settings.setValue(name, value);
    },
    delay: 500,
  });
}

function add_boolean_test(seqs, extension, settings, name, value) {
  add_test_values(seqs, extension, settings, name, value, [true, false, true]);
}

function add_scale_test(seqs, extension, settings, name, value) {
  add_test_values(
    seqs,
    extension,
    settings,
    name,
    value,
    [0, 0.125, 0.25, 0.5, 0.75, 1]
  );
}

function add_color_test(seqs, extension, settings, name, value) {
  let colors = [
    [0, 0, 0, 0],
    [0, 0, 0, 0.5],
    [0, 0, 0, 1],
    [1, 1, 1, 0.5],
    [1, 1, 1, 1],
    [1, 0, 1, 0.5],
    [1, 0, 1, 1],
  ];
  add_test_values(seqs, extension, settings, name, value, colors);
}

function add_dropdown_test(seqs, extension, settings, name, value) {
  let values = [0, 1, 2, 3];
  add_test_values(seqs, extension, settings, name, value, values);
}

function addMotionTests(_seqs, extension, settings) {
  // let _seqs = [];

  let anim = settings.getValue('animate-icons');
  let hide = settings.getValue('autohide-dash');

  add_message(_seqs, 'begin motion tests', 0);
  _seqs.push({
    func: () => {
      settings.setValue('animate-icons', true);
      settings.setValue('autohide-dash', false);
    },
    delay: 500,
  });

  add_move_pointer(_seqs, 0, 0, 0.5);

  // animation
  let x = extension.dashContainer.position.x;
  let y = extension.dashContainer.position.y;
  let w = extension.dashContainer.width;
  let h = extension.dashContainer.height;
  add_slide_pointer(_seqs, x, y + h / 2, x + w, y + h / 2, 40, 1.8);
  add_slide_pointer(_seqs, x + w, y + h / 2, x, y + h / 2, 40, 1.8);
  add_move_pointer(_seqs, 0, 0, 0.5);

  // autohide

  _seqs.push({
    func: () => {
      settings.setValue('animate-icons', true);
      settings.setValue('autohide-dash', true);
    },
    delay: 1000,
  });

  _seqs.push({
    func: () => {
      extension.autohider.preview();
    },
    delay: 500,
  });
  add_move_pointer(_seqs, 0, 0, 1);

  add_slide_pointer(_seqs, x, y + h / 2, x + w, y + h / 2, 40, 1.8);
  add_slide_pointer(_seqs, x + w, y + h, x, y + h, 40, 1.8);
  add_move_pointer(_seqs, 0, 0, 0.5);

  // reset

  _seqs.push({
    func: () => {
      extension.autohider.preview(false);
      settings.setValue('animate-icons', anim);
      settings.setValue('autohide-dash', hide);
    },
    delay: 500,
  });

  add_message(_seqs, 'done', 0);

  // runSequence(_seqs);
}

export function addPreferenceTests(_seqs, extension, settings) {
  add_message(_seqs, 'begin tests', 0);

  let keys = settings.keys();
  Object.keys(keys).forEach((name) => {
    let k = keys[name];
    k._value = k.value;

    add_message(_seqs, `${k.name} ${k.value}`, 0);
    switch (k.widget_type) {
      case 'switch':
        add_boolean_test(_seqs, extension, settings, k.name, k.value);
        break;
      case 'scale':
        add_scale_test(_seqs, extension, settings, k.name, k.value);
        break;
      case 'color':
        add_color_test(_seqs, extension, settings, k.name, k.value);
        break;
      case 'dropdown':
        add_dropdown_test(_seqs, extension, settings, k.name, k.value);
        break;
    }
  });

  add_message(_seqs, 'done', 0);
}

export function runTests(extension, settings) {
  let _seqs = [];
  addMotionTests(_seqs, extension, settings);
  addPreferenceTests(_seqs, extension, settings);
  extension._diagnosticTimer.runSequence(_seqs);
};

export function logChildren(widget, indent, logger) {
    logger = logger || console.log;
    indent = indent || 0;

    let indent_str = '\t'.repeat(indent);
    for (let k = 0, ch = widget.get_first_child(); ch; ++k, ch = ch.get_next_sibling()) {
        console.log(`${indent_str}C[${k}] = ${ch}`);
    }
}

export function logWidgetHierarchy(widget, logger) {
    logger = logger || console.log;

    for (let n = widget, i = 0; n; ++i, n = n.get_parent()) {
        console.log(`H[${i}]: ${n}`);
        logChildren(n, 1, logger);
    }
}

