'use strict';

import GLib from 'gi://GLib';
import Gdk from 'gi://Gdk';

export const dummy_pointer = {
  get_position: () => {
    return [{}, 0, 0];
  },
  warp: (screen, x, y) => {},
};

export function getPointer() {
  let display = Gdk.Display.get_default();

  // wayland?
  if (!display) {
    return dummy_pointer;
  }

  let deviceManager = display.get_device_manager();
  if (!deviceManager) {
    return dummy_pointer;
  }
  let pointer = deviceManager.get_client_pointer() || dummy_pointer;
  return pointer;
};

export function warpPointer(pointer, x, y) {
  let [screen, pointerX, pointerY] = pointer.get_position();
  pointer.warp(screen, x, y);
};
