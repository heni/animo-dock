function log_to_debug_draw(kws) {
    let {x, y, thresh, iconSize, pointer, vertical, debugDraw} = kws;
    let cx = pointer[0];
    let cy = pointer[1];

    if (vertical) {
      debugDraw.push({
        t: 'circle',
        X: x + iconSize / 2,
        y: y + cy,
        d: thresh,
        c: [1, 1, 0, 1],
      });
    } else {
      debugDraw.push({
        t: 'circle',
        x: x + cx,
        y: y + iconSize / 2,
        d: thresh,
        c: [1, 1, 0, 1],
      });
    }
}

function splice_frames_by_pointer(
    frames, p_loc, settings
) {
  const dist_threshold = settings.dist_threshold || (frames[0].l * 1.75);
  const animation_magnify = settings.animation_magnify || 0.5;

  let left = [];
  let right = [];
  let center = [];

  for (let f of frames) {
    const ir = f.r + f.l / 2;
    const dr = ir - p_loc;
    f.p = 1;
    f._p = 1;

    if (Math.abs(dr) < dist_threshold) {
      const p = 1 - Math.abs(dr) / dist_threshold;
      f.p = 1 + p * 0.7;
      f._p = 1 + (0.5 + animation_magnify * 0.6) * p;
      center.push(f);
    } else {
      if (dr < 0) {
        left.push(f);
      } else {
        right.push(f);
      }
    }
  }
  return { left, center, right };
}

function gen_frames(settings) {
  const {
    iconsCount, iconSpacing, pointer,
    dashWidth, vertical, animation_magnify,
  } = settings;

  let frames = [];
  for (let i = 0; i < iconsCount; i++) {
    frames.push({ idx: i, x: 0, y: 0, l: iconSpacing, r: 0, p: 1, });
  }

  {
    // do equal space positioning
    const total_length = iconsCount * iconSpacing;
    let r1 = Math.floor(dashWidth/2 - total_length/2);
    for (let f of frames) {
        f.r = r1;
        r1 += f.l;
    }
  }

  if (pointer) {
    const { left, center, right } = splice_frames_by_pointer(
      frames, vertical ? pointer[1] : pointer[0],
      { dist_threshold: iconSpacing * 1.75, animation_magnify }
    );

    if (center.length) {
      const totalP = center.reduce((s, f) => s + f.p, 0);
      const totalW = (iconsCount + 1) * iconSpacing;
      let leftX = Math.floor(dashWidth / 2 - totalW / 2);
      for (let f of left) {
        f.r = leftX;
        leftX += f.l;
      }
      const rightX = Math.floor(dashWidth / 2 + totalW / 2 - right.length * iconSpacing);
      let r1 = rightX;
      for (let f of right) {
        f.r = r1;
        r1 += f.l;
      }

      const center_area = (center.length + 1) * iconSpacing;
      for (let f of center) {
        f.r = leftX;
        f.l = Math.floor(center_area * (f.p / totalP));
        leftX += f.l;
      }

      center[center.length - 1].l = rightX - center[center.length - 1].r;
    }

    log_to_debug_draw({
        thresh: 3.5 * iconSpacing, pointer, vertical,
        ...settings
    });
  }

  return frames;
}


export default function Animation(animateIcons, pointer, settings) {
  if (!animateIcons.length) 
    return;
  let _firstIcon = animateIcons[0];
  let _lastIcon = animateIcons[animateIcons.length - 1];
  let first = _firstIcon._pos || [0, 0];
  let last = _lastIcon._pos || [0, 0];

  let dashWidth = settings.width;
  if (settings.vertical) {
    dashWidth = settings.height;
  }

  // spread and magnify cap
  let spread = settings.animation_spread;
  let magnify = settings.animation_magnify;
  if (spread < 0.2) {
    magnify *= 0.8;
  }
  if (magnify > 0.5 && spread < 0.55) {
    spread = 0.55 + spread * 0.2;
  }
  let iconSpacing =
    settings.iconSpacing +
    settings.iconSpacing * (settings.vertical ? 0.1 : 0.2) * spread;

  // spacing cap
  if (
    iconSpacing * (settings.iconsCount + 1) >
    dashWidth / settings.scaleFactor
  ) {
    iconSpacing = dashWidth / settings.scaleFactor / (settings.iconsCount + 1);
  }

  let debugDraw = [];
  let frames = gen_frames({
    ...settings,
    dashWidth,
    iconSpacing: Math.floor(iconSpacing * settings.scaleFactor),
    pointer: [
      settings.pointer[0] - settings.x,
      settings.pointer[1] - settings.y,
    ],
    iconsCount: settings.iconsCount + 2,
    debugDraw,
  });
  let lastIdx = frames.length - 1;
  let padLeft = Math.floor(frames[0].l);
  let padRight = Math.floor(frames[lastIdx].l);
  frames = frames.filter((i) => {
    return i.idx != 0 && i.idx != lastIdx;
  });

  // todo.. vertical
  if (settings.vertical) {
    frames.forEach((i) => {
      debugDraw.push({
        t: 'circle',
        y: i.r + settings.y + i.l/2,
        x:
          i.x +
          settings.x +
          settings.iconSize +
          (i.l - settings.iconSize) /
            (settings.dock_position == 'left' ? 2 : -2),
        d: i.l,
        c: [1, 0, 0, 1],
      });
      animateIcons[i.idx - 1]._pos[1] = i.r + settings.y + i.l/2;
    });
  } else {
    frames.forEach((i) => {
      debugDraw.push({
        t: 'circle',
        x: i.r + settings.x + i.l / 2,
        y: i.y + settings.y + settings.iconSize - (i.l - settings.iconSize) / 2,
        d: i.l,
        c: [1, 0, 0, 1],
      });
      animateIcons[i.idx - 1]._pos[0] = i.r + settings.x + i.l/2;
    });
  }

  let idx = 0;
  animateIcons.forEach((a) => {
    let f = frames[idx++];
    if (f && f.p > 1) {
      f.p *= 0.6 * (1 + magnify);

      // rise
      let sz = settings.iconSize * f.p - settings.iconSize;
      if (sz > 0) {
        if (settings.vertical) {
          if (settings.position == 'right') {
            a._pos[0] -= sz * 0.8 * settings.animation_rise;
          } else {
            a._pos[0] += sz * 0.8 * settings.animation_rise;
          }
        } else {
          a._pos[1] -= sz * 0.8 * settings.animation_rise;
        }
      }
    }
    a._targetScale = f._p;
    a._targetSpread = f.l;
  });

  /*let al = animateIcons.map(a => { return {
      pos: a._pos,
      scale: a._targetScale,
      spread: a._targetSpread,
  }});
  console.log(`Icons Animation: ${JSON.stringify(al)}`);*/

  return {
    first,
    last,
    padLeft,
    padRight,
    iconSpacing,
    debugDraw,
  };
};
