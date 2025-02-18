'use strict';
import PrefKeys from './prefKeys.js';

export const schemaId = 'org.gnome.shell.extensions.animo-dock';

export var SettingsKeys = new PrefKeys();
SettingsKeys.setKeys({
  // debug: {
  //   default_value: false,
  //   widget_type: 'switch',
  // },
  // 'debug-log': {
  //   default_value: false,
  //   widget_type: 'switch',
  // },
  'experimental-features': {
    default_value: false,
    widget_type: 'switch',
  },
  'debug-visual': {
    default_value: false,
    widget_type: 'switch',
  },
  'shrink-icons': {
    default_value: false,
    widget_type: 'switch',
  },
  'icon-size': {
    default_value: 0,
    widget_type: 'scale',
  },
  'dock-size-limit': {
    default_value: 1.0,
    widget_type: 'scale',
  },
  'animate-icons-unmute': {
    default_value: true,
    widget_type: 'switch',
    key_maps: {},
    test: { pointer: 'slide-through' },
  },
  'animate-icons': {
    default_value: true,
    widget_type: 'switch',
    key_maps: {},
    test: { pointer: 'slide-through' },
  },
  'open-app-animation': {
    default_value: false,
    widget_type: 'switch',
    key_maps: {},
    // test: { values: [0, 1] },
  },
  'autohide-dash': {
    default_value: true,
    widget_type: 'switch',
    key_maps: {},
    test: { pointer: 'slide-through' },
  },
  'autohide-dodge': {
    default_value: true,
    widget_type: 'switch',
    key_maps: {},
    test: { pointer: 'slide-through' },
  },
  'pressure-sense': {
    default_value: true,
    widget_type: 'switch',
    key_maps: {},
    test: { pointer: 'slide-down' },
  },
  'background-color': {
    default_value: [0, 0, 0, 0.5],
    widget_type: 'color',
  },
  'customize-topbar': {
    default_value: false,
    widget_type: 'switch',
    key_maps: {},
  },
  'topbar-border-thickness': {
    default_value: 0,
    widget_type: 'dropdown',
    test: { values: [0, 1, 2, 3] },
  },
  'topbar-border-color': {
    default_value: [1, 1, 1, 1],
    widget_type: 'color',
  },
  'topbar-background-color': {
    default_value: [0, 0, 0, 0.5],
    widget_type: 'color',
  },
  'topbar-foreground-color': {
    default_value: [0, 0, 0, 0],
    widget_type: 'color',
  },
  'favorites-only': {
    default_value: false,
    widget_type: 'switch',
  },
  'apps-icon': {
    default_value: true,
    widget_type: 'switch',
  },
  'apps-icon-start': {
    default_value: false,
    widget_type: 'switch',
  },
  'trash-icon': {
    default_value: false,
    widget_type: 'switch',
  },
  'mounted-icon': {
    default_value: false,
    widget_type: 'switch',
  },
  'clock-icon': {
    default_value: false,
    widget_type: 'switch',
  },
  'clock-style': {
    default_value: 0,
    widget_type: 'dropdown',
  },
  'calendar-icon': {
    default_value: false,
    widget_type: 'switch',
  },
  'peek-hidden-icons': {
    default_value: false,
    widget_type: 'switch',
  },
  'animation-fps': {
    default_value: 0,
    widget_type: 'dropdown',
    test: { pointer: 'slide-through', values: [0, 1, 2] },
  },
  'animation-magnify': {
    default_value: 0,
    widget_type: 'scale',
    test: { pointer: 'slide-through', values: [0, 0.5, 1] },
  },
  'animation-spread': {
    default_value: 0,
    widget_type: 'scale',
    test: { pointer: 'slide-through', values: [0, 0.5, 1] },
  },
  'animation-rise': {
    default_value: 0,
    widget_type: 'scale',
    test: { pointer: 'slide-through', values: [0, 0.5, 1] },
  },
  'dash-padding': {
    default_value: 0,
    widget_type: 'scale',
    test: { values: [0, 0.5, 1] },
  },
  'edge-distance': {
    default_value: 0,
    widget_type: 'scale',
    test: { values: [-1, 0, 1] },
  },
  'border-radius': {
    default_value: 0,
    widget_type: 'scale',
  },
  'border-thickness': {
    default_value: 0,
    widget_type: 'dropdown',
    test: { values: [0, 1, 2, 3] },
  },
  'border-color': {
    default_value: [1, 1, 1, 1],
    widget_type: 'color',
  },
  'panel-mode': {
    default_value: false,
    widget_type: 'switch',
  },
  'combine-top-bar': {
    default_value: false,
    widget_type: 'switch',
  },
  'running-indicator-style': {
    default_value: 0,
    widget_type: 'dropdown',
    options: [
      'default',
      'dots',
      'dot',
      'dashes',
      'dash',
      'squares',
      'square',
      'segmented',
      'solid',
      'triangles',
      'triangle',
      'diamonds',
      'diamond',
      'binary',
    ],
    test: { values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  },
  'running-indicator-color': {
    default_value: [1, 1, 1, 1],
    widget_type: 'color',
  },
  'notification-badge-style': {
    default_value: 0,
    widget_type: 'dropdown',
    options: ['default', 'dot', 'dash', 'square', 'triangle', 'diamond'],
    test: { values: [0, 1, 2, 3, 4, 5] },
  },
  'notification-badge-color': {
    default_value: [1, 1, 1, 1],
    widget_type: 'color',
  },
  'preferred-monitor': {
    default_value: 0,
    widget_type: 'dropdown',
    test: { values: [0, 1, 2] },
  },
  'dock-location': {
    default_value: 0,
    widget_type: 'dropdown',
    test: { values: [0, 1, 2, 3] },
  },
  'icon-resolution': {
    default_value: 0,
    widget_type: 'dropdown',
    test: { values: [0, 1, 2, 3] },
  },
  'icon-effect': {
    default_value: 0,
    widget_type: 'dropdown',
    test: { values: [0, 1, 2] },
  },
  'icon-effect-color': {
    default_value: [1, 1, 1, 1],
    widget_type: 'color',
  },
  'msg-to-ext': {
    default_value: '',
    widget_type: 'string',
  },
  'animation-type': {
    default_value: 0,
    widget_type: 'dropdown',
    test: { values: [0, 1, 2] },
  },
  'scroll-sensitivity': {
    default_value: 0.4,
    widget_type: 'scale',
  },
  'drawing-accent-color': {
    default_value: [1.0, 0, 0, 1.0],
    widget_type: 'color',
  },
  'drawing-secondary-color': {
    default_value: [1.0, 0.6, 0, 1.0],
    widget_type: 'color',
  },
  'drawing-dark-color': {
    default_value: [0.2, 0.2, 0.2, 1.0],
    widget_type: 'color',
  },
  'drawing-light-color': {
    default_value: [1.0, 1.0, 1.0, 1.0],
    widget_type: 'color',
  },
  'drawing-dark-foreground': {
    default_value: [0.8, 0.8, 0.8, 1.0],
    widget_type: 'color',
  },
  'drawing-light-foreground': {
    default_value: [0.3, 0.3, 0.3, 1.0],
    widget_type: 'color',
  },
});
