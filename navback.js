/* زر الرجوع (هاتف/متصفح): يعود خطوة داخل الموقع بدل الخروج منه.
   - كل انتقال بين الأقسام يُسجَّل في سجل المتصفح.
   - إن كانت نافذة منبثقة مفتوحة فالرجوع يغلقها فقط.
   - في أول شاشة: الرجوع مرة واحدة يُظهر «اضغط رجوع مرة أخرى للخروج»، والثانية تخرج. */
(function () {
  'use strict';
  var cfg = null, ready = false, applying = false, last = null, armed = false, armTimer = null, toastEl = null, toastTimer = null;

  function same(a, b) { try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; } }
  function say(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'nb-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
  }

  window.DE_NAV = {
    setup: function (c) { cfg = c; },
    push: function (state) {
      if (applying) { last = state; return; }
      try {
        if (!ready) {
          ready = true; last = state;
          history.replaceState({ de: 1, guard: 1 }, '', location.href);
          history.pushState({ de: 1, s: state }, '', location.href);
          return;
        }
        if (same(last, state)) return;
        last = state;
        history.pushState({ de: 1, s: state }, '', location.href);
      } catch (e) {}
    }
  };

  window.addEventListener('popstate', function (ev) {
    if (!cfg || !ready || !cfg.active()) return;
    var st = ev.state;
    if (!st || !st.de) return;
    if (cfg.modalOpen && cfg.modalOpen()) {              // نافذة مفتوحة: أغلقها وابقَ في مكانك
      cfg.closeModal();
      try { history.pushState({ de: 1, s: last }, '', location.href); } catch (e) {}
      return;
    }
    if (st.guard) {                                      // بلغنا أول شاشة
      if (armed) { armed = false; clearTimeout(armTimer); history.back(); return; }
      armed = true; clearTimeout(armTimer); armTimer = setTimeout(function () { armed = false; }, 2500);
      say('اضغط رجوع مرة أخرى للخروج');
      try { history.pushState({ de: 1, s: last }, '', location.href); } catch (e) {}
      return;
    }
    if (st.s) {
      applying = true;
      var done = function () { applying = false; };
      try { Promise.resolve(cfg.apply(st.s)).then(done, done); } catch (e) { done(); }
      last = st.s;
    }
  });
})();
