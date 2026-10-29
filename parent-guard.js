/* parent-guard.js — شبكة أمان ضد «الصفحة البيضاء» في فضاء الأولياء.
   يُحمَّل قبل باقي السكربتات. إذا فشل تحميل أي سكربت أو وقع خطأ JavaScript أو لم تظهر الشاشة الأولى
   خلال 8 ثوانٍ، يعرض رسالة عربية/فرنسية واضحة مع زر إعادة المحاولة بدل صفحة فارغة.
   لا يقرأ ولا يطبع عنوان الصفحة ولا رموز الدعوة ولا أي بيانات حساسة. */
(function () {
  'use strict';
  var shown = false;

  function fail(code) {
    if (shown || window.__deReady) return;
    shown = true;
    var boot = document.getElementById('boot');
    if (!boot) { boot = document.createElement('div'); boot.id = 'boot'; boot.className = 'boot'; document.body.appendChild(boot); }
    ['login', 'app'].forEach(function (id) { var el = document.getElementById(id); if (el) el.hidden = true; });
    boot.hidden = false;
    boot.textContent = '';
    var box = document.createElement('div'); box.className = 'boot-fail'; box.setAttribute('role', 'alert');
    var h = document.createElement('strong'); h.textContent = 'تعذّر عرض فضاء الأولياء';
    var p = document.createElement('p');
    p.textContent = 'قد يكون الاتصال ضعيفًا أو أن متصفحك لا يدعم الصفحة. جرّب إعادة التحميل، أو افتح الرابط في متصفح Chrome أو Safari، أو تواصل مع إدارة المركز.';
    var pf = document.createElement('p'); pf.setAttribute('dir', 'ltr');
    pf.textContent = 'Impossible d’afficher l’Espace Parents. Rechargez la page ou ouvrez le lien dans Chrome/Safari.';
    var a = document.createElement('a'); a.className = 'btn'; a.textContent = 'إعادة التحميل / Recharger';
    a.href = location.pathname;                       // بلا أي معاملات: لا نعيد استعمال رمز الدعوة
    var c = document.createElement('small'); c.textContent = 'رمز: ' + code;
    box.appendChild(h); box.appendChild(p); box.appendChild(pf); box.appendChild(a); box.appendChild(c);
    boot.appendChild(box);
  }

  window.addEventListener('error', function (e) {
    if (!e) return;
    // فشل تحميل سكربت (404/حجب شبكة): خطير. فشل صورة أو خط Google: غير خطير فيُتجاهل.
    if (e.target && e.target !== window) { if (e.target.tagName === 'SCRIPT') fail('load'); return; }
    // خطأ تنفيذ: نعتدّ به فقط إن كان من سكربتات الموقع نفسه (لا من إضافات المتصفح)
    var f = String(e.filename || '');
    if (!f || f.indexOf(location.origin) === 0) fail('js');
  }, true);
  window.addEventListener('unhandledrejection', function () { fail('promise'); });
  setTimeout(function () { fail('timeout'); }, 8000);
})();
