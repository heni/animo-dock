'use strict';

import St from 'gi://St';
import Shell from 'gi://Shell';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Meta from 'gi://Meta';
import Clutter from 'gi://Clutter';

import {Me} from './utils.js';

function customStylesPath() {
    return Me().dir.get_child('./').get_path();
}


export default class Style {
  constructor() {
    this.styles = {};
    this.style_contents = {};
  }

  unloadAll() {
    let ctx = St.ThemeContext.get_for_stage(global.stage);
    let theme = ctx.get_theme();
    Object.keys(this.styles).forEach((k) => {
      let fn = this.styles[k];
      theme.unload_stylesheet(fn);
    });
  }

  build(name, style_array) {
    let fn = this.styles[name];
    let ctx = St.ThemeContext.get_for_stage(global.stage);
    let theme = ctx.get_theme();

    let content = '';
    style_array.forEach((k) => {
      content = `${content}\n${k}`;
    });

    if (this.style_contents[name] === content) {
      // log('skip regeneration');
      return;
    }

    if (fn) {
      theme.unload_stylesheet(fn);
    } else {
      fn = Gio.File.new_for_path(`${customStylesPath()}/${name}.css`);
      this.styles[name] = fn;
    }

    this.style_contents[name] = content;
    const [, etag] = fn.replace_contents(
      content,
      null,
      false,
      Gio.FileCreateFlags.REPLACE_DESTINATION,
      null
    );

    theme.load_stylesheet(fn);

    // log(content);
  }

  rgba(color) {
    let clr = color || [1, 1, 1, 1];
    let res = clr.map((r) => Math.floor(255 * r));
    res[3] = clr[3].toFixed(1);
    return res.join(',');
  }
};
