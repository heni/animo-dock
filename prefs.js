// loosely based on JustPerfection & Blur-My-Shell

import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Pango from 'gi://Pango';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import {schemaId, SettingsKeys} from './preferences/keys.js';
import {logWidgetHierarchy, logChildren} from './diagnostics.js';

const EXTENSION_UUID = 'animo-dock@heni.github.com';
function Me() {
    return ExtensionPreferences.lookupByUUID(EXTENSION_UUID);
}

function uiFolderPath() {
    if (!uiFolderPath._value) {
        uiFolderPath._value = Me().dir.get_child('ui').get_path();
    }
    return uiFolderPath._value;
}

export default class AnimoDockPreferences extends ExtensionPreferences {
    _init() {
        let iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
        iconTheme.add_search_path(`${uiFolderPath()}/icons`);
        Me().initTranslations();
        this._initialized = true;
    }

    fillPreferencesWindow(window) {
        if (!this._initialized) {
            this._init();
        }
        return fillPreferencesWindow(window, this.getSettings());
    }
}


function updateMonitors(window, builder, settings) {
  // monitors (use dbus?)
  let count = settings.get_int('monitor-count') || 1;
  const monitors_model = builder.get_object('preferred-monitor-model');
  monitors_model.splice(count, 6 - count, []);
}

function find_descendants_by_name(root, name_selector, _answer) {
    _answer = _answer || [];
    for (let ch = root.get_first_child(); ch; ch = ch.get_next_sibling()) {
        if (ch.get_name() == name_selector) {
            _answer.push(ch);
        }
        find_descendants_by_name(ch, name_selector, _answer);
    }
    return _answer;
}

function addMenu(window, builder) {
  let menu_util = builder.get_object('menu_util');
  window.add(menu_util);

  const page = builder.get_object('menu_util');
  // uncomment to debug hierarchy view
  // logWidgetHierarchy(page);  
  const preferencesToolbar = page.get_parent().get_parent().get_parent().get_parent(); // AdwToolbarView
  const candidates = find_descendants_by_name(preferencesToolbar, "AdwHeaderBar");
  console.assert(candidates.length == 1, `failing search for AdwHeaderBar: ${candidates}`);
  const headerbar = candidates[0];
  
  headerbar.pack_start(builder.get_object('info_menu'));

  // setup menu actions
  const actionGroup = new Gio.SimpleActionGroup();
  window.insert_action_group('prefs', actionGroup);

  // a list of actions with their associated link
  const actions = [
    {
      name: 'open-bug-report',
      link: 'https://github.com/heni/animo-dock/issues',
    },
    {
      name: 'open-readme',
      link: 'https://github.com/heni/animo-dock',
    },
    {
      name: 'open-license',
      link: 'https://github.com/heni/animo-dock/blob/master/LICENSE',
    },
  ];

  actions.forEach((action) => {
    let act = new Gio.SimpleAction({ name: action.name });
    act.connect('activate', (_) =>
      Gtk.show_uri(window, action.link, Gdk.CURRENT_TIME)
    );
    actionGroup.add_action(act);
  });

  window.remove(menu_util);
}

function addButtonEvents(window, builder, settings) {
  // builder.get_object('static-animation').connect('clicked', () => {
  //   builder.get_object('animation-spread').set_value(0);
  //   builder.get_object('animation-rise').set_value(0);
  //   builder.get_object('animation-magnify').set_value(0);
  // });

  if (builder.get_object('self-test')) {
    builder.get_object('self-test').connect('clicked', () => {
      settings.set_string('msg-to-ext', 'this.runDiagnostics()');
    });
  }
}

function fillPreferencesWindow(window, settings) {
  let builder = new Gtk.Builder();

  builder.add_from_file(`${uiFolderPath()}/general.ui`);
  builder.add_from_file(`${uiFolderPath()}/appearance.ui`);
  builder.add_from_file(`${uiFolderPath()}/tweaks.ui`);
  builder.add_from_file(`${uiFolderPath()}/others.ui`);
  builder.add_from_file(`${uiFolderPath()}/menu.ui`);
  window.add(builder.get_object('general'));
  window.add(builder.get_object('appearance'));
  window.add(builder.get_object('tweaks'));
  window.add(builder.get_object('others'));
  window.set_search_enabled(true);

  settings.set_string('msg-to-ext', '');

  SettingsKeys.connectBuilder(builder);
  SettingsKeys.connectSettings(settings);

  addButtonEvents(window, builder, settings);
  updateMonitors(window, builder, settings);
  addMenu(window, builder);

  function toggle_experimental() {
    let exp = SettingsKeys.getValue('experimental-features');
    builder.get_object('self-test-row').visible = exp;
  }

  settings.connect('changed::experimental-features', () => {
    toggle_experimental();
  });

  toggle_experimental();
}
