'use strict';

import GLib from 'gi://GLib';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export const EXTENSION_UUID = 'animo-dock@heni.github.com';
export function Me() {
    let self = Me;
    if (self._me == null) {
        self._me = Extension.lookupByUUID(EXTENSION_UUID);
    }
    return self._me;
}

export function setTimeout(func, delay, ...args) {
  const wrappedFunc = () => {
    func.apply(this, args);
  };
  return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, wrappedFunc);
};

export function setInterval(func, delay, ...args) {
  const wrappedFunc = () => {
    return func.apply(this, args) || true;
  };
  return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, wrappedFunc);
};

export function clearTimeout(id) {
  GLib.source_remove(id);
};

export function clearInterval(id) {
  GLib.source_remove(id);
};
