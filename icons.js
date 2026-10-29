/* أيقونات احترافية (خطّية SVG) بدل رموز الإيموجي.
   يحوّل أي إيموجي يظهر في الصفحة إلى أيقونة SVG مرسومة بنفس لون النص، ويحذف الرموز غير المعروفة.
   لا innerHTML ولا سكربت مضمَّن: العناصر تُبنى بـ createElementNS (متوافق مع CSP). */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  /* p=مسار، c=دائرة (cx,cy,r)، r=مستطيل (x,y,w,h,rx)، l=خط (x1,y1,x2,y2) */
  var ICONS = {
    plus: [['p', 'M12 5v14M5 12h14']],
    minus: [['p', 'M5 12h14']],
    check: [['p', 'M20 6L9 17l-5-5']],
    x: [['p', 'M18 6L6 18M6 6l12 12']],
    search: [['c', 11, 11, 7], ['p', 'M21 21l-4.35-4.35']],
    trash: [['p', 'M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6']],
    edit: [['p', 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z']],
    save: [['p', 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8']],
    printer: [['p', 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2'], ['r', 6, 14, 12, 8, 0]],
    eye: [['p', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'], ['c', 12, 12, 3]],
    eyeoff: [['p', 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22']],
    lock: [['r', 3, 11, 18, 11, 2], ['p', 'M7 11V7a5 5 0 0 1 10 0v4']],
    key: [['c', 7.5, 15.5, 5.5], ['p', 'M21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3']],
    shield: [['p', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z']],
    user: [['p', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'], ['c', 12, 7, 4]],
    users: [['p', 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'], ['c', 9, 7, 4]],
    mail: [['p', 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6']],
    phone: [['p', 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z']],
    globe: [['c', 12, 12, 10], ['p', 'M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z']],
    home: [['p', 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10']],
    pin: [['p', 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'], ['c', 12, 10, 3]],
    message: [['p', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z']],
    calendar: [['r', 3, 4, 18, 18, 2], ['p', 'M16 2v4M8 2v4M3 10h18']],
    clock: [['c', 12, 12, 10], ['p', 'M12 6v6l4 2']],
    link: [['p', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71']],
    image: [['r', 3, 3, 18, 18, 2], ['c', 8.5, 8.5, 1.5], ['p', 'M21 15l-5-5L5 21']],
    download: [['p', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3']],
    upload: [['p', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12']],
    refresh: [['p', 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15']],
    alert: [['p', 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01']],
    checkcircle: [['p', 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3']],
    clipboard: [['p', 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'], ['r', 8, 2, 8, 4, 1]],
    filetext: [['p', 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8']],
    book: [['p', 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z']],
    bookopen: [['p', 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z']],
    target: [['c', 12, 12, 10], ['c', 12, 12, 6], ['c', 12, 12, 2]],
    chart: [['p', 'M12 20V10M18 20V4M6 20v-4']],
    zap: [['p', 'M13 2L3 14h9l-1 8 10-12h-9l1-8z']],
    sun: [['c', 12, 12, 4], ['p', 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41']],
    cloud: [['p', 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z']],
    arrowup: [['p', 'M12 19V5M5 12l7-7 7 7']],
    arrowright: [['p', 'M5 12h14M12 5l7 7-7 7']],
    star: [['p', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z']],
    crown: [['p', 'M2 20h20M4 17L2 7l6 4 4-8 4 8 6-4-2 10z']],
    landmark: [['p', 'M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z']],
    school: [['p', 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M12 10h.01']],
    wrench: [['p', 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z']],
    leaf: [['p', 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12']],
    idcard: [['r', 2, 5, 20, 14, 2], ['c', 8, 11, 2], ['p', 'M14 10h4M14 14h4M5 16c.6-2 4.4-2 5 0']],
    wand: [['p', 'M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M15 9h.01M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5']],
    ruler: [['p', 'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0zM14.5 12.5l2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2']]
  };
  var MAP = {
    '🏛': 'landmark', '🛠': 'wrench', '🌿': 'leaf', '🌐': 'globe', '🔐': 'lock', '👩': 'user', '👩‍🏫': 'school',
    '🏫': 'school', '🔙': 'arrowright', '🔍': 'search', '📊': 'chart', '🙈': 'eyeoff', '👁': 'eye', '➕': 'plus',
    '🔄': 'refresh', '🖼': 'image', '🖨': 'printer', '🔗': 'link', '🛡': 'shield', '📋': 'clipboard', '📝': 'filetext',
    '🪪': 'idcard', '🔑': 'key', '⚠': 'alert', '✅': 'checkcircle', '✏': 'edit', '💾': 'save', '🗑': 'trash',
    '☀': 'sun', '🌤': 'cloud', '🕒': 'clock', '📘': 'book', '🎯': 'target', '➖': 'minus', '📥': 'download',
    '📖': 'bookopen', '✓': 'check', '✔': 'check', '✕': 'x', '✖': 'x', '⚡': 'zap', '✨': 'star', '📅': 'calendar',
    '📌': 'pin', '📍': 'pin', '⬆': 'arrowup', '🪄': 'wand', '📐': 'ruler', '📤': 'upload', '👥': 'users', '📞': 'phone',
    '👑': 'crown', '📩': 'mail', '✉': 'mail', '🏠': 'home', '💬': 'message', '📧': 'mail'
  };
  var RE_G = /[\u{1F300}-\u{1FAFF}☀-➿⬅-⬇⭐](?:️)?(?:‍[\u{1F300}-\u{1FAFF}♀♂](?:️)?)*/gu;
  var RE_T = /[\u{1F300}-\u{1FAFF}☀-➿⬅-⬇⭐]/u;
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, OPTION: 1, TITLE: 1 };

  function clean(s) { return s.replace(RE_G, '').replace(/\s{2,}/g, ' ').replace(/^\s+(?=\S)/, ''); }

  function build(name) {
    var spec = ICONS[name]; if (!spec) return null;
    var span = document.createElement('span'); span.className = 'ico'; span.setAttribute('aria-hidden', 'true');
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('focusable', 'false');
    spec.forEach(function (s) {
      var n;
      if (s[0] === 'p') { n = document.createElementNS(NS, 'path'); n.setAttribute('d', s[1]); }
      else if (s[0] === 'c') { n = document.createElementNS(NS, 'circle'); n.setAttribute('cx', s[1]); n.setAttribute('cy', s[2]); n.setAttribute('r', s[3]); }
      else if (s[0] === 'r') { n = document.createElementNS(NS, 'rect'); n.setAttribute('x', s[1]); n.setAttribute('y', s[2]); n.setAttribute('width', s[3]); n.setAttribute('height', s[4]); if (s[5]) n.setAttribute('rx', s[5]); }
      svg.appendChild(n);
    });
    span.appendChild(svg); return span;
  }

  function nameFor(sym) {
    if (MAP[sym]) return MAP[sym];
    var base = sym.replace(/️/g, '');
    if (MAP[base]) return MAP[base];
    return MAP[Array.from(base)[0]] || null;
  }

  function convertText(node) {
    var p = node.parentNode; if (!p) return;
    var v = node.nodeValue; if (!RE_T.test(v)) return;
    var inSkip = false; for (var a = p; a && a.nodeType === 1; a = a.parentNode) { if (SKIP[a.nodeName]) { inSkip = true; break; } }
    if (inSkip) { node.nodeValue = clean(v); return; }
    var frag = document.createDocumentFragment(), last = 0, m;
    RE_G.lastIndex = 0;
    while ((m = RE_G.exec(v))) {
      if (m.index > last) frag.appendChild(document.createTextNode(v.slice(last, m.index)));
      var ic = nameFor(m[0]); var el = ic && build(ic);
      if (el) frag.appendChild(el);
      last = m.index + m[0].length;
    }
    if (last < v.length) frag.appendChild(document.createTextNode(v.slice(last)));
    p.replaceChild(frag, node);
  }

  function cleanAttrs(el) {
    ['title', 'placeholder', 'aria-label', 'alt'].forEach(function (k) {
      var v = el.getAttribute && el.getAttribute(k);
      if (v && RE_T.test(v)) el.setAttribute(k, clean(v));
    });
  }

  function process(root) {
    if (!root) return;
    if (root.nodeType === 3) { convertText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    var list = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) { if (RE_T.test(n.nodeValue)) list.push(n); }
    list.forEach(convertText);
    if (root.nodeType === 1) cleanAttrs(root);
    if (root.querySelectorAll) [].forEach.call(root.querySelectorAll('[title],[placeholder],[aria-label],[alt]'), cleanAttrs);
  }

  function start() {
    process(document.body);
    if (RE_T.test(document.title)) document.title = clean(document.title);
    new MutationObserver(function (recs) {
      recs.forEach(function (r) {
        if (r.type === 'characterData') { if (r.target.parentNode) convertText(r.target); return; }
        [].forEach.call(r.addedNodes, process);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
