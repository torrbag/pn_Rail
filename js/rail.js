/*!
Rail-JS (MIT license)
*/
class Rail {
  constructor(opts) {
    for (let o in opts) {
      this[o] = opts[o];
    }

    let app, tray, cell, img, nav, dot, tot, old, free, fact, cur = 0;

    const buildframe = () => {
      let n = 0;
      app = document.getElementById(this.slide_id);
      img = app.getElementsByTagName("img");
      tray = document.createElement('div');
      tray.className = 'slide-tray';
      while (img.length > 0) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        n++;
        cell.id = n;
        cell.append(img[0]);
        tray.append(cell);
      }
      app.append(tray);
    }

    const buildnavbar = () => {
      let n = 0;
      nav = document.createElement('div');
      nav.className = 'dot-tray';
      for (let i = 0; i < img.length; i++) {
        dot = document.createElement('div');
        dot.className = 'dot';
        n++;
        dot.id = n;
        nav.append(dot);
      }
      app.append(nav);
      nav.firstChild.classList.add('Rail-active');
    }

    const clone = () => {
      cell = tray.getElementsByClassName("cell");
      let i1 = cell[0].cloneNode(true),
        o1 = cell[1].cloneNode(true),
        i2 = cell[img.length - 1].cloneNode(true),
        o2 = cell[img.length - 2].cloneNode(true);
      i1.id = o1.id = o2.id = i2.id = '';
      tray.append(i1);
      tray.append(o1);
      tray.insertBefore(i2, cell[0]);
      tray.insertBefore(o2, cell[0]);
    };

    const configparts = () => {
      buildframe();
      if (this.slide_navagation) buildnavbar();
      clone();
      tot = img.length;
      tray.style.width = `${100 * tot}%`;
      for (let c = 0; c < cell.length; c++) {
        cell[c].style.width = `${100 / tot}%`;
      }
      translate(cur = 2);
    };

    const currentdot = () => {
      for (let i = 0; i < nav.children.length; i++) {
        nav.children[i].classList.remove('Rail-active');
        if (cur === 1) {
          nav.children[tot - 5].classList.add('Rail-active');
        } else if (cur === tot - 2) {
          nav.children[0].classList.add('Rail-active');
        } else {
          nav.children[cur - 2].classList.add('Rail-active');
        }
      }
    }

    const translate = (cur) => tray.style.transform = `translate(${cur / tot * -100}%)`;

    const transition = (spe, eas) => tray.style.transition = `transform ${spe}ms ${eas || 'linear'}`;

    const device = (e) => {
      return e.changedTouches ? e.changedTouches[0] : e;
    };

    const factor = (e) => {
      let pos = Math.max(device(e).clientX, old) - Math.min(device(e).clientX, old);
      let speed = (app.clientWidth - pos) * (this.slide_speed / app.clientWidth);
      return Math.round(speed);
    };

    const unlock = (e) => {
      e.preventDefault();
      free = true;
      old = device(e).clientX;
    };

    const drag = (e) => {
      if (free) {
        transition(0);
        let bounds = -Math.round(cell[cur].offsetLeft - (device(e).clientX - old));
        tray.style.transform = `translate(${bounds}px)`;
        fact = factor(e);
      }
    };

    const slide = (e) => {
      if (free) {
        if (device(e).clientX < old - app.clientWidth / 10) {
          if (cur > tot - 4) {
            setTimeout(() => {
              transition(0);
              translate(cur = 2);
            }, fact);
          }
          translate((cur += 1));
        } else if (device(e).clientX > old + app.clientWidth / 10) {
          if (cur < 3) {
            setTimeout(() => {
              transition(0);
              translate(cur = tot - 3);
            }, fact);
          }
          translate(cur -= 1);
        } else {
          translate(cur);
        }
        transition(fact, this.slide_style);
        currentdot();
      }
    };

    const relock = () => free = false;

    const controlbar = (e) => {
      let target = e.target.id;
      if (target) {
        translate(cur = Number(target) + 1);
      }
      currentdot();
      transition(this.slide_speed, this.slide_style);
    }

    const listen = (elm, arg, fnt) => arg.forEach(evt => elm.addEventListener(evt, fnt, { passive: false }));

    (() => {
      configparts();
      listen(nav, ['click'], controlbar);
      listen(tray, ['mousedown', 'touchstart'], unlock);
      listen(window, ['mousemove', 'touchmove'], drag);
      listen(window, ['mouseup', 'touchend'], slide);
      listen(window, ['mouseup', 'touchend'], relock);
    })();
  }
}
