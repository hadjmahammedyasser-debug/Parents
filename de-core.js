/* de-core.js — أدوات مشتركة لفضاء الأولياء ولوحة الأطفال والأولياء. بلا مكتبات خارجية.
   مبادئ: (1) لا innerHTML إطلاقًا: كل نص يُدرج بـ textContent. (2) التحقق هنا للراحة فقط؛
   الحماية الحقيقية في قيود قاعدة البيانات وسياسات RLS ودالة admin-users. (3) لا أسرار في هذا الملف. */
(function (root) {
  'use strict';

  var BUILD = '2026-10-19.3';
  var MAX_FILE = 5 * 1024 * 1024;                       // 5 ميغابايت (يطابق حد الحاوية private-docs)
  var EXT = { pdf: 'application/pdf', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
  var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  /* ---------- التحقق ---------- */
  function uuid() {
    var c = (root && root.crypto) || (typeof globalThis !== 'undefined' && globalThis.crypto) || (typeof require === 'function' ? require('crypto').webcrypto || require('crypto') : null);
    if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    var b = new Uint8Array(16);
    if (c && typeof c.getRandomValues === 'function') c.getRandomValues(b);
    else if (c && typeof c.randomFillSync === 'function') c.randomFillSync(b);
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  function clean(s, max) {      // يزيل محارف التحكم (يُبقي السطر الجديد والمسافة) ويقصّ الطول
    return String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max || 5000);
  }
  function isUuid(s) { return typeof s === 'string' && UUID_RE.test(s); }
  function isEmail(s) { return typeof s === 'string' && s.length <= 254 && /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(s); }
  function isPhone(s) { return typeof s === 'string' && /^[0-9+()\s.-]{5,25}$/.test(s); }
  function isDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    var d = new Date(s + 'T00:00:00Z');
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }
  function safeUrl(u) { try { var x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; } }
  var PW_MSG = 'كلمة المرور: 10 أحرف على الأقل مع حرف كبير وحرف صغير ورقم.';
  function pwProblem(v) {
    v = String(v || '');
    var bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(v).length : v.length;
    return v.length >= 10 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v) && bytes <= 72 ? '' : PW_MSG;
  }

  /* ---------- فحص الملفات: الامتداد + الحجم + النوع الحقيقي (magic bytes) ---------- */
  function sniff(b) {
    if (!b || b.length < 12) return null;
    if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2D) return 'pdf';             // %PDF-
    if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'jpg';
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47 && b[4] === 0x0D && b[5] === 0x0A && b[6] === 0x1A && b[7] === 0x0A) return 'png';
    if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'webp';
    return null;
  }
  function pdfHasActive(bytes) {  // فحص استدلالي لمحتوى نشط داخل PDF (ليس بديلًا عن برنامج حماية)
    var s = ''; for (var i = 0; i < bytes.length; i += 8192) s += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + 8192, bytes.length)));
    return /\/(JavaScript|JS|Launch|EmbeddedFile|RichMedia)\b/.test(s);
  }
  // f: { name, size, type, bytes:Uint8Array }  — bytes = الملف كاملًا (≤ 5MB)
  function checkFile(f) {
    var m = /\.([A-Za-z0-9]{2,5})$/.exec(String(f.name || ''));
    var ext = m ? m[1].toLowerCase() : '';
    if (ext === 'jpeg') ext = 'jpg';
    if (!EXT[ext]) return { ok: false, error: 'نوع الملف غير مسموح. المسموح: PDF وJPG وPNG وWebP.' };
    if (!(f.size > 0)) return { ok: false, error: 'الملف فارغ.' };
    if (f.size > MAX_FILE) return { ok: false, error: 'حجم الملف أكبر من الحد المسموح (5 ميغابايت).' };
    if (f.type && f.type !== EXT[ext]) return { ok: false, error: 'نوع الملف لا يطابق امتداده.' };
    var real = sniff(f.bytes);
    if (real !== ext) return { ok: false, error: 'محتوى الملف لا يطابق نوعه المعلن، تم رفضه.' };
    if (ext === 'pdf' && pdfHasActive(f.bytes)) return { ok: false, error: 'يحتوي ملف PDF على محتوى نشط (سكربت/مرفقات) وهو غير مسموح.' };
    return { ok: true, ext: ext, mime: EXT[ext] };
  }
  function objectPath(childId, ext) { return 'children/' + childId + '/' + uuid() + '.' + ext; }

  /* ---------- DOM آمن: لا innerHTML ولا style مضمّنة ولا روابط خطرة ---------- */
  function append(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
  }
  function h(tag, props) {
    var el = document.createElement(tag);
    var p = props || {};
    Object.keys(p).forEach(function (k) {
      var v = p[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'checked' || k === 'disabled' || k === 'hidden' || k === 'selected') el[k] = v;
      else if (k === 'style' || /^on/i.test(k) || k === 'innerHTML' || k === 'outerHTML' || k === 'srcdoc') return;   // مرفوضة عمدًا
      else if ((k === 'href' || k === 'src') && !/^(https:|blob:|#)/i.test(String(v))) return;
      else el.setAttribute(k, v === true ? '' : String(v));
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  /* ---------- رسائل أخطاء مفهومة (لا نعرض نصوص الخادم الخام) ---------- */
  var MSG = [
    [/invalid login credentials/i, 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'],
    [/email not confirmed/i, 'لم يُفعَّل الحساب بعد. افتح رابط الدعوة المرسل إلى بريدك.'],
    [/banned|user is banned/i, 'هذا الحساب معطَّل. تواصل مع إدارة المركز.'],
    [/invalid (totp|code)|mfa.*(invalid|failed)|code.*incorrect/i, 'رمز المصادقة غير صحيح أو منتهٍ.'],
    [/rate limit|too many|over_.*rate_limit|only request this (after|once)/i, 'محاولات كثيرة. انتظر دقيقة ثم أعد المحاولة.'],
    [/otp.*expired|token has expired|invalid.*(token|otp)|otp_expired/i, 'الرابط أو الرمز غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.'],
    [/same password|should be different/i, 'اختر كلمة مرور مختلفة عن الحالية.'],
    [/weak.?password|password should|at least \d+ char/i, 'كلمة المرور ضعيفة. استخدم 10 أحرف أو أكثر مع أحرف كبيرة وصغيرة وأرقام.'],
    [/row-level security|permission denied|42501|not authorized|غير مصرّح/i, 'ليست لديك صلاحية تنفيذ هذه العملية.'],
    [/23503|foreign key|violates foreign key/i, 'لا يمكن تنفيذ العملية لأن هناك سجلات مرتبطة (مثل تقارير). عطّل الملف بدلًا من حذفه.'],
    [/23505|duplicate key/i, 'هذا السجل موجود مسبقًا.'],
    [/23514|check constraint/i, 'إحدى القيم غير مقبولة. راجع الحقول وأعد المحاولة.'],
    [/payload too large|exceeded the maximum|too large/i, 'حجم الملف أكبر من الحد المسموح (5 ميغابايت).'],
    [/mime type|not supported|invalid_mime/i, 'نوع الملف غير مدعوم.']
  ];
  function friendly(status, raw, code) {
    var s = String(raw || '') + ' ' + String(code || '');
    for (var i = 0; i < MSG.length; i++) if (MSG[i][0].test(s)) return MSG[i][1];
    if (raw && /[\u0600-\u06FF]/.test(raw) && !/violates|SQLSTATE|stack|syntax/i.test(raw)) return raw;
    if (status === 300) return 'تعذّر تنفيذ الطلب لأن الخادم وجد أكثر من دالة مطابقة (تعارض في قاعدة البيانات). أبلغ المسؤول التقني، ولم تُحذف أي بيانات.';
    return 'حدث خطأ غير متوقع (' + status + '). حاول مرة أخرى.';
  }

  /* ---------- عميل Supabase (Auth + REST + Storage + Functions) عبر fetch ---------- */
  function Client(cfg, storeKey, persistent) {
    var base = String(cfg.supabaseUrl || '').replace(/\/+$/, '');
    var key = cfg.supabaseKey || '';
    var session = null, refreshing = null, pending = null, expireCb = function () {};
    var api = {};
    var isPersistent = !!persistent || (storeKey === 'de_parent_session');

    function store() {
      try {
        if (isPersistent && root.localStorage) return root.localStorage;
        return root.sessionStorage || root.localStorage;
      } catch (e) {
        try { return root.localStorage || root.sessionStorage; } catch (e2) { return null; }
      }
    }
    function load() {
      var s = null;
      try {
        if (root.localStorage) {
          try { s = JSON.parse(root.localStorage.getItem(storeKey) || 'null'); } catch (e1) {}
        }
        if ((!s || !s.refresh_token) && root.sessionStorage) {
          try { s = JSON.parse(root.sessionStorage.getItem(storeKey) || 'null'); } catch (e2) {}
        }
        if (s && s.refresh_token) {
          session = s;
          return s;
        }
      } catch (e) {}
      return null;
    }
    function save(tok) {
      session = { access_token: tok.access_token, refresh_token: tok.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + (tok.expires_in || 3600), user: tok.user || (session && session.user) || null };
      try {
        if (root.localStorage && (isPersistent || storeKey === 'de_parent_session')) {
          root.localStorage.setItem(storeKey, JSON.stringify(session));
        }
      } catch (e1) {}
      try {
        if (root.sessionStorage) {
          root.sessionStorage.setItem(storeKey, JSON.stringify(session));
        }
      } catch (e2) {}
    }
    function clear() {
      session = null;
      try { if (root.sessionStorage) root.sessionStorage.removeItem(storeKey); } catch (e1) {}
      try { if (root.localStorage) root.localStorage.removeItem(storeKey); } catch (e2) {}
    }
    function hdrs(token, extra) {
      var hd = { apikey: key };
      var t = token || (/^eyJ/.test(key) ? key : null);       // المفتاح الجديد sb_publishable_ ليس JWT فلا يُرسل كترويسة Authorization
      if (t) hd.Authorization = 'Bearer ' + t;
      for (var k in extra) hd[k] = extra[k];
      return hd;
    }
    async function raw(token, method, path, body, extra) {
      var isBin = typeof Uint8Array !== 'undefined' && body instanceof Uint8Array;
      var hd = hdrs(token, extra || {});
      if (body !== undefined && !isBin) hd['Content-Type'] = 'application/json';
      var res;
      try { res = await fetch(base + path, { method: method, headers: hd, body: body === undefined ? undefined : (isBin ? body : JSON.stringify(body)) }); }
      catch (e) {
        var errText = path.indexOf('/functions/v1/') === 0
          ? 'تعذّر الاتصال بالدالة السحابية. يرجى التأكد من نشر دالة admin-users في Supabase.'
          : 'تعذّر الاتصال بالخادم. تحقق من الإنترنت.';
        var ne = new Error(errText); ne.status = 0; throw ne;
      }
      var txt = await res.text(), j = null;
      try { j = txt ? JSON.parse(txt) : null; } catch (e) { j = null; }
      if (!res.ok) {
        var r = (j && (j.msg || j.message || j.error_description || j.error)) || '';
        var er = new Error(friendly(res.status, r, j && (j.code || j.error_code)));
        er.status = res.status;
        if (root.console) console.warn('API', res.status, j && (j.code || j.error_code) || '');     // لا نسجّل المحتوى
        throw er;
      }
      return j;
    }
    async function refresh() {
      if (refreshing) return refreshing;
      refreshing = (async function () {
        if (!session) return false;
        try { save(await raw(null, 'POST', '/auth/v1/token?grant_type=refresh_token', { refresh_token: session.refresh_token })); return true; }
        catch (e) { return false; }
      })().then(function (v) { refreshing = null; return v; });
      return refreshing;
    }
    async function expire() { clear(); expireCb(); }
    async function ensureFresh() {
      if (session && session.expires_at - 60 < Date.now() / 1000 && !(await refresh())) {
        await expire(); var e = new Error('انتهت الجلسة. سجّل الدخول من جديد.'); e.status = 401; throw e;
      }
    }
    async function authed(method, path, body, extra) {
      await ensureFresh();
      try { return await raw(session && session.access_token, method, path, body, extra); }
      catch (e) {
        if (e.status === 401 && session) {
          if (await refresh()) return raw(session.access_token, method, path, body, extra);
          await expire(); e.message = 'انتهت الجلسة. سجّل الدخول من جديد.';
        }
        throw e;
      }
    }

    api.load = function () { session = load(); return !!session; };
    api.loggedIn = function () { return !!session; };
    api.onExpire = function (cb) { expireCb = cb; };
    api.me = async function () {
      if (!session) return null;
      if (!session.user) { session.user = await authed('GET', '/auth/v1/user'); save({ access_token: session.access_token, refresh_token: session.refresh_token, expires_in: Math.max(60, session.expires_at - Math.floor(Date.now() / 1000)), user: session.user }); }
      return session.user;
    };
    api.signIn = async function (email, password, opts) {
      var tok = await raw(null, 'POST', '/auth/v1/token?grant_type=password', { email: email, password: password });
      var f = ((tok.user && tok.user.factors) || []).filter(function (x) { return x.status === 'verified' && x.factor_type === 'totp'; })[0];
      if (f && !(opts && opts.skipMfa)) { pending = { tok: tok, factor: f.id }; return { mfa: true }; }
      save(tok); return { mfa: false };
    };
    api.verifyMfa = async function (code) {
      if (!pending) throw new Error('انتهت المحاولة. أعد تسجيل الدخول.');
      var t = pending.tok.access_token, id = pending.factor;
      var ch = await raw(t, 'POST', '/auth/v1/factors/' + encodeURIComponent(id) + '/challenge', {});
      var v = await raw(t, 'POST', '/auth/v1/factors/' + encodeURIComponent(id) + '/verify', { challenge_id: ch.id, code: code });
      pending = null; save(v);
    };
    api.cancelMfa = function () { pending = null; };
    api.signOut = async function () {
      try { if (session) await raw(session.access_token, 'POST', '/auth/v1/logout?scope=local', {}); } catch (e) { /* نُنهي الجلسة محليًا على أي حال */ }
      clear();
    };
    api.recover = function (email, redirectTo) {
      return raw(null, 'POST', '/auth/v1/recover' + (redirectTo ? '?redirect_to=' + encodeURIComponent(redirectTo) : ''), { email: email });
    };
    // استعادة كلمة المرور برمز البريد: التحقق من الرمز ثم تعيين كلمة المرور الجديدة، ثم إغلاق جلسة الاستعادة
    api.recoverWithCode = async function (email, code, newPassword) {
      var v = await raw(null, 'POST', '/auth/v1/verify', { type: 'recovery', email: email, token: code });
      if (!v || !v.access_token) throw new Error('الرمز غير صحيح أو منتهٍ.');
      try { await raw(v.access_token, 'PUT', '/auth/v1/user', { password: newPassword }); }
      finally { try { await raw(v.access_token, 'POST', '/auth/v1/logout?scope=local', {}); } catch (e) { /* تجاهل */ } }
    };
    // روابط الدعوة/الاستعادة تأتي برموز في #hash أو في ?search: نلتقطها ونستخرج الجلسة
    api.adoptHash = async function () {
      var hStr = String(root.location.hash || '').replace(/^#/, '');
      var sStr = String(root.location.search || '').replace(/^\?/, '');
      if (!hStr && !sStr) return null;

      var p = new URLSearchParams(hStr);
      var sp = new URLSearchParams(sStr);
      for (var pair of sp.entries()) {
        if (!p.has(pair[0])) p.set(pair[0], pair[1]);
      }

      if (p.get('error') || p.get('error_code')) {
        root.history.replaceState(null, '', root.location.pathname);
        return { error: friendly(400, p.get('error_description') || '', p.get('error_code')) };
      }

      var tok = p.get('access_token');
      var ref = p.get('refresh_token') || '';
      var type = p.get('type') || '';
      var tokenHash = p.get('token_hash') || p.get('token') || '';

      // إذا وصلنا رابط تفعيل بـ token_hash من Supabase verify
      if (!tok && tokenHash) {
        try {
          var v = await raw(null, 'POST', '/auth/v1/verify', { token_hash: tokenHash, type: type || 'invite' });
          if (v && v.access_token) { tok = v.access_token; ref = v.refresh_token || ''; }
        } catch (e1) {
          try {
            var v2 = await raw(null, 'POST', '/auth/v1/verify', { token_hash: tokenHash, type: 'recovery' });
            if (v2 && v2.access_token) { tok = v2.access_token; ref = v2.refresh_token || ''; type = 'recovery'; }
          } catch (e2) {}
        }
      }

      if (!tok) return null;

      var email = '';
      try {
        var b64 = tok.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        var atobFn = typeof root.atob === 'function' ? root.atob : (typeof atob === 'function' ? atob : function (s) { return Buffer.from(s, 'base64').toString('binary'); });
        var payload = JSON.parse(atobFn(b64));
        email = payload.email || '';
      } catch (e) {}

      root.history.replaceState(null, '', root.location.pathname);
      save({ access_token: tok, refresh_token: ref, expires_in: Number(p.get('expires_in')) || 3600 });
      return { type: type || 'invite', email: email, token: tok };
    };
    api.setPassword = function (pw) { return authed('PUT', '/auth/v1/user', { password: pw }); };
    api.rest = function (method, path, body, prefer) { return authed(method, '/rest/v1' + path, body, prefer ? { Prefer: prefer } : {}); };
    api.rpc = function (name, args) { return authed('POST', '/rest/v1/rpc/' + name, args || {}); };
    api.fn = function (name, body) { return authed('POST', '/functions/v1/' + name, body); };
    api.signedUrl = async function (bucket, path, seconds) {
      var r = await authed('POST', '/storage/v1/object/sign/' + bucket + '/' + path.split('/').map(encodeURIComponent).join('/'), { expiresIn: seconds || 60 });
      var u = r && (r.signedURL || r.signedUrl);
      if (!u) throw new Error('تعذّر إنشاء رابط الملف.');
      return base + '/storage/v1' + u;
    };
    api.upload = function (bucket, path, bytes, mime) {
      return authed('POST', '/storage/v1/object/' + bucket + '/' + path.split('/').map(encodeURIComponent).join('/'), bytes, { 'Content-Type': mime, 'x-upsert': 'false' });
    };
    api.removeObject = function (bucket, path) {
      return authed('DELETE', '/storage/v1/object/' + bucket + '/' + path.split('/').map(encodeURIComponent).join('/'));
    };
    return api;
  }

  /* مهلة خمول: خروج تلقائي بعد فترة بلا نشاط (راحة للمستخدم على الأجهزة المشتركة؛ ليست بديلًا عن انتهاء الجلسة في الخادم) */
  function idle(ms, cb) {
    var t; function reset() { clearTimeout(t); t = setTimeout(cb, ms); }
    ['click', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) { root.addEventListener(ev, reset, { passive: true }); });
    reset(); return function stop() { clearTimeout(t); };
  }

  var DE = {
    BUILD: BUILD, MAX_FILE: MAX_FILE, EXT: EXT, PW_MSG: PW_MSG,
    uuid: uuid, clean: clean, isUuid: isUuid, isEmail: isEmail, isPhone: isPhone, isDate: isDate, safeUrl: safeUrl, pwProblem: pwProblem,
    sniff: sniff, pdfHasActive: pdfHasActive, checkFile: checkFile, objectPath: objectPath,
    h: h, friendly: friendly, Client: Client, idle: idle
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = DE; else root.DE = DE;
})(typeof globalThis !== 'undefined' ? globalThis : this);