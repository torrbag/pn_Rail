class Rail {
  constructor(opts) {
    for (let o in opts) {
      this[o] = opts[o];
    }

    let app, tray, cell, img, tot, old, free, fact, cur = 0;

    const target = () => {
      app = document.getElementsByClassName("test-app")[0];
      tray = app.getElementsByClassName("slide-tray")[0];
      cell = tray.getElementsByClassName("cell");
      img = tray.getElementsByTagName("img");
    };

    const clone = () => {
      let i1 = cell[0].cloneNode(true),
        o1 = cell[1].cloneNode(true),
        i2 = cell[img.length - 1].cloneNode(true),
        o2 = cell[img.length - 2].cloneNode(true);
      tray.append(i1);
      tray.append(o1);
      tray.insertBefore(i2, cell[0]);
      tray.insertBefore(o2, cell[0]);
    };

    const setup = () => {
      target();
      clone();
      tot = img.length;
      tray.style.width = `${100 * tot}%`;
      for (let c = 0; c < cell.length; c++) {
        cell[c].style.width = `${100 / tot}%`;
      }
      translate((cur = 2));
    };

    const translate = (cur) => tray.style.transform = `translate(${cur / tot * -100}%)`;

    const transition = (spe, eas) => tray.style.transition = `transform ${spe}ms ${eas || 'linear'}`;

    const device = (e) => {
      return e.changedTouches ? e.changedTouches[0] : e;
    };

    const factor = (e) => {
      let pos =
        Math.max(device(e).clientX, old) - Math.min(device(e).clientX, old);
      let speed =
        (app.clientWidth - pos) * (this.slide_speed / app.clientWidth);
      return Math.round(speed);
    };

    const unlock = (e) => {
      e.preventDefault();
      free = true;
      old = device(e).clientX;
    };

    const drag = (e) => {
      if (free) {
        transition(0, this.slide_style);
        let bounds = -Math.round(
          cell[cur].offsetLeft - (device(e).clientX - old)
        );
        tray.style.transform = `translate(${bounds}px)`;
        fact = factor(e);
      }
    };

    const slide = (e) => {
      if (free) {
        if (device(e).clientX < old - 100) {
          if (cur > tot - 4) {
            setTimeout(() => {
              transition(0, this.slide_style);
              translate((cur = 2));
            }, fact);
          }
          translate((cur += 1));
        } else if (device(e).clientX > old + 100) {
          if (cur < 3) {
            setTimeout(() => {
              transition(0, this.slide_style);
              translate((cur = tot - 3));
            }, fact);
          }
          translate((cur -= 1));
        } else {
          translate(cur);
        }
        transition(fact, this.slide_style);
      }
    };

    const relock = () => free = false;

    const listener = (elm, arg, fnt) =>
      arg.forEach(evt => elm.addEventListener(evt, fnt, { passive: false }));

    (() => {
      setup();
      listener(tray, ['mousedown', 'touchstart'], unlock);
      listener(window, ['mousemove', 'touchmove'], drag);
      listener(window, ['mouseup', 'touchend'], slide);
      listener(window, ['mouseup', 'touchend'], relock);
    })();
  }
}
