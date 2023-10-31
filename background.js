import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Dash} from 'resource:///org/gnome/shell/ui/dash.js'

import Shell from 'gi://Shell';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import Meta from 'gi://Meta';
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import GLib from 'gi://GLib';

import {Me} from './utils.js';

import DrawOverlay from './apps/overlay.js';
import Drawing from './drawing.js';

function drawBackground(ctx) {
  let w = 2;

  // Drawing.draw_rect(
  //   ctx,
  //   [1, 0, 0, 1],
  //   w,
  //   w,
  //   this.width - w * 3,
  //   this.height - w * 3,
  //   w
  // );

  // Drawing.draw_rounded_rect(
  //   ctx,
  //   [1, 0, 0, 0],
  //   w,
  //   w,
  //   this.width - w * 3,
  //   this.height - w * 3,
  //   2,
  //   16
  // )
}

const DockBackground = GObject.registerClass(
  {},
  class AnimoDockBackground extends St.Widget {
    _init(params) {
      super._init({
        name: 'DockBackground',
        ...(params || {}),
      });

      this.drawOverlay = new DrawOverlay(20, 20);
      this.drawOverlay.onDraw = drawBackground.bind(this.drawOverlay);
      this.add_child(this.drawOverlay);
    }

    update(params) {
      let {
        first,
        last,
        padding,
        iconSize,
        scaleFactor,
        vertical,
        position,
        panel_mode,
        dashContainer,
      } = params;

      let p1 = first.get_transformed_position();
      let p2 = last.get_transformed_position();
      if (isNaN(p1[0]) || isNaN(p1[1])) {
          return;
      }

      if (vertical) {
        // Case of vertical

        // this.y = first._fixedPosition[1] - padding;
        this.y = p1[1] - padding;
        
        if (position == 'right') {
          this.x = Math.max(p1[0], p2[0]) - padding;
        } else { // position == 'left' 
          this.x = Math.min(p1[0], p2[0]) - padding;
        }

        this.width = iconSize * scaleFactor + padding * 2;
        this.height = (p2[1] - p1[1]) +
            iconSize * scaleFactor * last._targetScale + padding * 2;
      } else { 
        // Case of bottom
        this.x = p1[0] - padding;
        this.y = Math.max(p1[1], p2[1]) - padding;

        // this.y = Math.max(first._fixedPosition[1], last._fixedPosition[1]) - padding;
        
        this.height = iconSize * scaleFactor + padding * 2;
        this.width = (p2[0] - p1[0]) +
          iconSize * scaleFactor * last._targetScale + padding * 2;
      }

      if (panel_mode) {
         if (vertical) {
           this.y = dashContainer.y;
           this.height = dashContainer.height;
         } else {
           this.x = dashContainer.x;
           this.width = dashContainer.width;
        }
      }

      this.drawOverlay.resize(this.width, this.height);
      this.drawOverlay.opacity = 100;
    }
  }
);
export default DockBackground;
