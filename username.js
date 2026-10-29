/* username.js — اسم مستخدم الولي من اسم الطالب بالفرنسية + رقم قيده (يعمل في المتصفح وفي Node).
   الصيغة: <لقب>.<اسم>.<رقم القيد>   مثال: hadj.mohamed.082   (حروف لاتينية صغيرة، 30 حرفًا كحد أقصى)
   كلمة المرور: DI + تاريخ الميلاد ddmmyyyy   مثال: DI08031996
   تصحيح الأسماء الفرنسية يدويًا: أضف الرقم والاسم في fr-names.js (يتغلب على التحويل التلقائي). */
(function (root) {
  'use strict';
  var DICT_RAW = {
    'بن': 'ben', 'بنت': 'bent', 'محمد': 'mohamed', 'امحمد': 'mohamed', 'ابراهيم': 'brahim', 'ابراه': 'brahim', 'حاج': 'hadj', 'الحاج': 'elhadj',
    'عبد': 'abd', 'الدين': 'eddine', 'عمر': 'omar', 'علي': 'ali', 'على': 'ali', 'يحي': 'yahia', 'عيسى': 'aissa', 'بهون': 'behoun',
    'صالح': 'salah', 'يوسف': 'youssef', 'مصطفى': 'mustapha', 'اسماعيل': 'smail', 'احمد': 'ahmed', 'بكير': 'bakir', 'مسعود': 'messaoud',
    'سليمان': 'slimane', 'زكرياء': 'zakaria', 'حمو': 'hammou', 'الشيخ': 'cheikh', 'داودي': 'daoudi', 'سعيد': 'said', 'توفيق': 'toufik',
    'نور': 'nour', 'نصر': 'nasr', 'اسماوي': 'asmaoui', 'درين': 'derrine', 'بشير': 'bachir', 'موسى': 'moussa', 'كليماني': 'klimani',
    'مختار': 'mokhtar', 'تيازيط': 'tiaziit', 'قاسم': 'kacem', 'زوليخة': 'zoulikha', 'اولاد': 'ouled', 'حاجو': 'hadjou', 'باحمد': 'bahmed',
    'عز': 'ezz', 'عائشة': 'aicha', 'صلاح': 'salah', 'مهدي': 'mehdi', 'سمية': 'soumia', 'منير': 'mounir', 'فاروق': 'farouk', 'الشرع': 'chara',
    'خالد': 'khaled', 'اية': 'aya', 'ريم': 'rim', 'ياسين': 'yassine', 'الرزاق': 'erezzak', 'بابا': 'baba', 'الامين': 'elamine', 'انس': 'anes',
    'الجليل': 'eldjalil', 'هامل': 'hamel', 'مامة': 'mama', 'طه': 'taha', 'يونس': 'younes', 'دحمان': 'dahmane', 'الرحمان': 'errahmane',
    'خليف': 'khelif', 'طالب': 'taleb', 'وسام': 'wissam', 'قندوزي': 'kendouzi', 'حسين': 'hocine', 'امين': 'amine', 'ابو': 'abou', 'عبيدة': 'obeida',
    'بوحديبة': 'bouhdiba', 'حبيرش': 'habirech', 'جيهان': 'djihane', 'الوهاب': 'elouahab', 'العابد': 'elabed', 'حسناء': 'hasna', 'منصور': 'mansour',
    'بلال': 'bilal', 'السعيد': 'essaid', 'انفال': 'anfel', 'الياس': 'elyes', 'كبير': 'kebir', 'الطيب': 'tayeb', 'زرقون': 'zerguoun', 'صفوان': 'safouane',
    'خروبي': 'kharoubi', 'اسكوتي': 'skouti', 'عثمان': 'othmane', 'ريان': 'rayan', 'حمودة': 'hamouda', 'ايمن': 'ayman', 'بهشو': 'behchou', 'مروة': 'marwa',
    'مروان': 'marouane', 'باباعمر': 'babaomar', 'بكلي': 'bakli', 'ببو': 'bebou', 'العيد': 'elaid', 'عافو': 'afou', 'قومار': 'goumar', 'ياسر': 'yacer',
    'حمزة': 'hamza', 'يعقوب': 'yacoub', 'نذير': 'nadir', 'ابي': 'abi', 'بعيسى': 'baissa', 'صوفيا': 'sofia', 'مسهل': 'mesehel', 'لؤي': 'louai', 'دهان': 'dahan',
    'القادر': 'elkader', 'قبسي': 'gebsi', 'حيمود': 'himoud', 'اسامة': 'oussama', 'مداني': 'madani', 'مهيري': 'mehiri', 'الصديق': 'essedik', 'مسعودة': 'messaouda',
    'سيرين': 'sirine', 'مريم': 'meriem', 'بلقاسم': 'belkacem', 'جرادة': 'djarada', 'حاتة': 'hata', 'فاطمة': 'fatima', 'الزهراء': 'ezzahra', 'بوال': 'boual',
    'ادريس': 'idriss', 'خليفة': 'khelifa', 'ريهام': 'riham', 'شهد': 'chahd', 'الشامخة': 'chamikha', 'حفيظ': 'hafid', 'العليم': 'elalim', 'سالم': 'salem',
    'سحر': 'sihem', 'الحي': 'elhai', 'بلولو': 'belloulou', 'رمضان': 'ramdane', 'الواهج': 'elouahedj', 'توهامي': 'touhami', 'مالك': 'malek', 'صديقي': 'seddiki',
    'مراد': 'mourad', 'قندوز': 'kendouz', 'نهال': 'nihal', 'مطياز': 'metiaz', 'عكيف': 'akif', 'سهام': 'siham', 'فخار': 'fakhar', 'بنورة': 'bennoura',
    'ربيع': 'rabie', 'بايوب': 'bayoub', 'ريغي': 'righi', 'عباس': 'abbas', 'لقمان': 'lokmane', 'المهدي': 'elmehdi', 'ايوب': 'ayoub', 'السلام': 'essalam',
    'الشريف': 'cherif', 'خديجة': 'khadidja', 'صغير': 'seghir', 'غبشي': 'ghebchi', 'نورالهدى': 'nourelhouda', 'يسرى': 'yousra', 'لعزيز': 'laaziz',
    'ياسمين': 'yasmine', 'سيراج': 'siradj', 'نوح': 'nouh', 'مفنون': 'mefnoun', 'البشير': 'elbachir', 'بورزمة': 'bourezma', 'زيطاري': 'zitari', 'سين': 'sine',
    'خليل': 'khalil', 'جبريط': 'djebrit', 'سعد': 'saad', 'بدر': 'badr', 'بيتور': 'bitour', 'اسحاق': 'ishak', 'يعيش': 'yaich'
  };
  var LET = { 'ا': 'a', 'ء': '', 'ؤ': 'ou', 'ئ': 'i', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'dj', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'd', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'ch', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'ة': 'a', 'و': 'ou', 'ي': 'i', 'گ': 'g', 'پ': 'p', 'ڤ': 'v' };

  function norm(w) {
    return String(w || '').replace(/[ً-ٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/[()،,]/g, '');
  }
  var DICT = {};
  Object.keys(DICT_RAW).forEach(function (k) { DICT[norm(k)] = DICT_RAW[k]; });

  function word(w) {
    var n = norm(w);
    if (!n) return '';
    if (/^[A-Za-z0-9]+$/.test(n)) return n.toLowerCase();
    if (DICT[n]) return DICT[n];
    var pre = '';
    if (n.length > 3 && n.indexOf('ال') === 0) { pre = 'el'; n = n.slice(2); if (DICT[n]) return pre + DICT[n]; }
    var o = '';
    for (var i = 0; i < n.length; i++) { var c = n.charAt(i); o += LET[c] != null ? LET[c] : (/[A-Za-z0-9]/.test(c) ? c.toLowerCase() : ''); }
    return pre + o;
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* الاسم الفرنسي الكامل (للعرض والتصحيح): يُفضَّل ما في DE_FR_NAMES[رقم القيد] إن وُجد */
  function frName(arName, mno) {
    var ov = (root.DE_FR_NAMES || {})[String(mno || '')];
    if (ov) return String(ov).trim();
    return String(arName || '').trim().split(/\s+/).map(word).filter(Boolean).map(cap).join(' ');
  }
  function slug(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ''); }

  /* اسم المستخدم: أول كلمتين من الاسم الفرنسي + رقم القيد */
  function username(arName, mno) {
    var parts = frName(arName, mno).split(/\s+/).slice(0, 2).map(slug).filter(Boolean);
    var no = slug(mno);
    if (!parts.length || !no) return '';
    var tail = '.' + no, name = parts.join('.');
    return (name.slice(0, 30 - tail.length).replace(/\.$/, '') + tail);
  }
  function password(dob) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dob || ''));
    return m ? 'DI' + m[3] + m[2] + m[1] : '';
  }
  root.DEUser = { frName: frName, username: username, password: password };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.DEUser;
})(typeof window !== 'undefined' ? window : globalThis);
