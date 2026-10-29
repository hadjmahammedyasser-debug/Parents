/* فضاء الأولياء — Espace Parents — دار الإحسان
   يدعم اللغتين العربية (افتراضي RTL) والفرنسية (LTR) مع حماية RLS كاملة وبلا مكتبات خارجية.
   عزل تام للبيانات: لا يمكن للولي رؤية أي ملف أو برنامج تربوي إلا للقسم والطفل المرتبط به حصراً.
   كل النصوص تُدرج بـ textContent لحماية تامة من XSS. */
(function () {
  'use strict';
  var FILE_BUILD = '2026-10-24.2';
  if (window.top !== window.self) { document.body.textContent = ''; return; }

  var CFG = window.DE_CONFIG || {}, h = DE.h;
  var $ = function (s) { return document.querySelector(s); };
  var C = DE.Client(CFG, 'de_parent_session', true);
  var S = { tab: 'children', me: null, name: '', d: null, reads: {}, selectedChildId: null };
  var stopIdle = null;

  /* الدليل البيداغوجي الرسمي المعتمد (لإظهار استمارات التقييم البيداغوجي للأولياء بدقة تامة) */
  var EMBEDDED_STUDENTS = [{"id": "00000000-0000-4000-8000-000000000004", "membership_no": "004", "full_name": "حاج ابراهيم مسعود بن قاسم", "dob": "1981-08-01", "phone": "0559486900", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000021", "membership_no": "021", "full_name": "حاج ابراهيم عمر بن سليمان", "dob": "1986-04-26", "phone": "0553770520", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000022", "membership_no": "022", "full_name": "بهون علي يوسف بن يحي", "dob": "1986-06-12", "phone": "0658379640", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000050", "membership_no": "050", "full_name": "سعيد مصطفى بن عمر", "dob": "1991-09-20", "phone": "0561010960", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000077", "membership_no": "077", "full_name": "بهون علي زوليخة بنت يحي بن عمر", "dob": "1988-07-20", "phone": "0658379640", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000082", "membership_no": "082", "full_name": "حاج امحمد محمد بن اسماعيل", "dob": "1989-08-04", "phone": "0664421440", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000086", "membership_no": "086", "full_name": "حاج ابراهيم بهون بن عبد الرحمان", "dob": "1995-03-24", "phone": "0771307180", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000087", "membership_no": "087", "full_name": "خليف ابراهيم زكرياء بن أحمد", "dob": "2003-03-17", "phone": "0699950770", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000090", "membership_no": "090", "full_name": "اولاد حاجو بكير بن توفيق", "dob": "2004-05-22", "phone": "0663031990", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000101", "membership_no": "101", "full_name": "طالب باحمد عز الدين بن بكير", "dob": "2005-04-05", "phone": "0793613030", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000103", "membership_no": "103", "full_name": "بهون عائشة بنت نور الدين", "dob": "2001-08-23", "phone": "0671473010", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000104", "membership_no": "104", "full_name": "بهون وسام بنت ابراهيم", "dob": "2006-06-04", "phone": "0556530510", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000111", "membership_no": "111", "full_name": "بهون زوليخة بنت نور الدين", "dob": "1984-12-21", "phone": "0671473010", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000112", "membership_no": "112", "full_name": "قندوزي نصر الدين بن حسين", "dob": "2006-09-24", "phone": "0663434690", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000114", "membership_no": "114", "full_name": "اسماوي امين بن ابو عبيدة", "dob": "2009-09-30", "phone": "0559285840", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000116", "membership_no": "116", "full_name": "صلاح مهدي بن مسعود", "dob": "2002-03-08", "phone": "0664702430", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000117", "membership_no": "117", "full_name": "درين سمية بنت صالح", "dob": "1997-09-27", "phone": "0666616490", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000118", "membership_no": "118", "full_name": "درين منير بن صالح", "dob": "1993-09-02", "phone": "0666616490", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000003", "section_id": "22222222-0000-4000-8000-000000000011", "branch_slug": "farm", "section_slug": "sec_bostana", "section": "المزرعة البستنة", "center": "farm", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000119", "membership_no": "119", "full_name": "درين بشير بن صالح", "dob": "1995-07-19", "phone": "0666616490", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000003", "section_id": "22222222-0000-4000-8000-000000000011", "branch_slug": "farm", "section_slug": "sec_bostana", "section": "المزرعة البستنة", "center": "farm", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000132", "membership_no": "132", "full_name": "حمو علي قاسم بن عمر", "dob": "2009-08-01", "phone": "0666296250", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000009", "branch_slug": "main", "section_slug": "sec_khariji", "section": "الخارجي اعاقة شديدة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000138", "membership_no": "138", "full_name": "حمو علي سمية بنت موسى", "dob": "2004-06-09", "phone": "0797598770", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000142", "membership_no": "142", "full_name": "بوحديبة محمد بن ابراهيم", "dob": "2011-01-25", "phone": "0673648720", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000146", "membership_no": "146", "full_name": "حبيرش جيهان بنت عبد الوهاب", "dob": "2013-12-07", "phone": "0673412310", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000153", "membership_no": "153", "full_name": "العابد حسناء بنت منصور", "dob": "2008-02-28", "phone": "0670305460", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000159", "membership_no": "159", "full_name": "اسماوي محمد بن بلال", "dob": "2010-08-15", "phone": "0658391000", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000160", "membership_no": "160", "full_name": "بهون علي محمد السعيد بن عمر", "dob": "2013-07-17", "phone": "0550799880", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000165", "membership_no": "165", "full_name": "حمو علي زكرياء بن ابراهيم", "dob": "2014-09-08", "phone": "0667445790", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000167", "membership_no": "167", "full_name": "كليماني انفال بنت محمد", "dob": "2012-11-30", "phone": "0698371740", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000005", "branch_slug": "main", "section_slug": "sec_tafatan_1", "section": "التفطين 1 تأخر ذهني", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000168", "membership_no": "168", "full_name": "كليماني آية بنت محمد", "dob": "2009-04-05", "phone": "0698371740", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000170", "membership_no": "170", "full_name": "بن علي فاروق بن احمد", "dob": "2012-10-02", "phone": "0661649080", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000173", "membership_no": "173", "full_name": "بن يحي الياس بن مختار", "dob": "2007-10-27", "phone": "0665948640", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000176", "membership_no": "176", "full_name": "كبير حاج الطيب بن بشير", "dob": "2014-01-21", "phone": "0792747290", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000180", "membership_no": "180", "full_name": "زرقون صفوان بن مصطفى", "dob": "2007-05-31", "phone": "0668640480", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000187", "membership_no": "187", "full_name": "خروبي زكرياء بن عيسى", "dob": "2015-04-14", "phone": "0542284920", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000001", "branch_slug": "main", "section_slug": "sec_autism_1", "section": "توحد 01", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000188", "membership_no": "188", "full_name": "اسكوتي عيسى بن عثمان", "dob": "2016-06-19", "phone": "0699053930", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000001", "branch_slug": "main", "section_slug": "sec_autism_1", "section": "توحد 01", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000189", "membership_no": "189", "full_name": "الشرع ريان بن مختار", "dob": "2015-01-05", "phone": "0661474750", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000002", "branch_slug": "main", "section_slug": "sec_autism_2", "section": "التوحد 02", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000190", "membership_no": "190", "full_name": "بن حمودة أيمن سليمان بن عمر", "dob": "2013-09-06", "phone": "0666506900", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000002", "branch_slug": "main", "section_slug": "sec_autism_2", "section": "التوحد 02", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000192", "membership_no": "192", "full_name": "الشرع خالد بن مختار", "dob": "2013-10-16", "phone": "0661474750", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000001", "branch_slug": "main", "section_slug": "sec_autism_1", "section": "توحد 01", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000196", "membership_no": "196", "full_name": "بهشو اسماعيل بن سليمان", "dob": "2013-05-16", "phone": "0665996070", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000197", "membership_no": "197", "full_name": "كليماني اية", "dob": "2014-04-23", "phone": "0668369020", "disability": "متعدد الاعاقات", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": null, "branch_slug": "main", "section_slug": "", "section": "عام", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000198", "membership_no": "198", "full_name": "بن ريم مروة بنت مروان", "dob": "2009-02-06", "phone": "0665691870", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000200", "membership_no": "200", "full_name": "بن يوسف حاج ابراهيم بن نصر الدين", "dob": "2009-12-27", "phone": "0676424480", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000201", "membership_no": "201", "full_name": "باباعمر تيازيط زكرياء بن بشير", "dob": "2010-07-08", "phone": "0777120270", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000202", "membership_no": "202", "full_name": "بكلي الحاج محمد بن احمد", "dob": "2012-02-13", "phone": "0561247270", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000204", "membership_no": "204", "full_name": "ببو محمد بن العيد", "dob": "2008-06-01", "phone": "0668872890", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000206", "membership_no": "206", "full_name": "بن عافو يوسف بن عيسى", "dob": "2013-07-14", "phone": "0696141510", "disability": "متعدد الاعاقات", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000209", "membership_no": "209", "full_name": "قومار محمد ياسر بن حمزة", "dob": "2015-04-13", "phone": "0665539180", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000002", "branch_slug": "main", "section_slug": "sec_autism_2", "section": "التوحد 02", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000213", "membership_no": "213", "full_name": "يعقوب نذير بن محمد", "dob": "2007-11-04", "phone": "0657063250", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000216", "membership_no": "216", "full_name": "ابي اسماعيل ياسين بن بعيسى", "dob": "2012-01-14", "phone": "0558253810", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000219", "membership_no": "219", "full_name": "حاج امحمد اسماعيل بن ابراهيم", "dob": "2009-12-01", "phone": "0778464970", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000009", "branch_slug": "main", "section_slug": "sec_khariji", "section": "الخارجي اعاقة شديدة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000223", "membership_no": "223", "full_name": "أولاد علي صوفيا بنت محمد", "dob": "2014-01-22", "phone": "0661674980", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000003", "branch_slug": "main", "section_slug": "sec_autism_3", "section": "توحد 03", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000224", "membership_no": "224", "full_name": "مسهل لؤي بن خالد", "dob": "2016-06-02", "phone": "0660655590", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000003", "branch_slug": "main", "section_slug": "sec_autism_3", "section": "توحد 03", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000226", "membership_no": "226", "full_name": "دهان عبد القادر بن يحي بن عيسى", "dob": "2013-12-19", "phone": "0672223730", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000227", "membership_no": "227", "full_name": "قبسي مهدي عبد الرزاق بن احمد", "dob": "2014-05-12", "phone": "0697975120", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000003", "branch_slug": "main", "section_slug": "sec_autism_3", "section": "توحد 03", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000228", "membership_no": "228", "full_name": "حيمود اسامة بن مداني", "dob": "2007-06-20", "phone": "0666389040", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000231", "membership_no": "231", "full_name": "مهيري يوسف الصديق بن موسى", "dob": "2016-02-23", "phone": "0667432520", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000003", "branch_slug": "main", "section_slug": "sec_autism_3", "section": "توحد 03", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000236", "membership_no": "236", "full_name": "حاج سعيد مسعودة سيرين بنت عمر", "dob": "2018-07-09", "phone": "0557542540", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000006", "branch_slug": "main", "section_slug": "sec_tafatan_2", "section": "التفطين 2 متلازمة داون", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000238", "membership_no": "238", "full_name": "بابا عمر تيازيط يحي بن مسعود", "dob": "2009-07-25", "phone": "0671353090", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000003", "section_id": "22222222-0000-4000-8000-000000000011", "branch_slug": "farm", "section_slug": "sec_bostana", "section": "المزرعة البستنة", "center": "farm", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000239", "membership_no": "239", "full_name": "بابا عمر تيازيط محمد بن مسعود", "dob": "2016-12-22", "phone": "0671353090", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000240", "membership_no": "240", "full_name": "بن موسى مريم بنت بلقاسم", "dob": "2014-01-23", "phone": "0662021930", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000243", "membership_no": "243", "full_name": "حاج امحمد مصطفى الامين بن ابراه", "dob": "1993-02-01", "phone": "0659312590", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000247", "membership_no": "247", "full_name": "جرادة ابراهيم بن محمد", "dob": "2018-01-15", "phone": "0662507160", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000006", "branch_slug": "main", "section_slug": "sec_tafatan_2", "section": "التفطين 2 متلازمة داون", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000249", "membership_no": "249", "full_name": "حاتة سليمان بن بكير", "dob": "2001-02-04", "phone": "0792300200", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000250", "membership_no": "250", "full_name": "حاج اسماعيل عائشة بنت محمد بن ا", "dob": "2021-06-08", "phone": "0696683680", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000006", "branch_slug": "main", "section_slug": "sec_tafatan_2", "section": "التفطين 2 متلازمة داون", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000251", "membership_no": "251", "full_name": "سعيد فاطمة الزهراء بنت صلاح الدين", "dob": "2009-06-26", "phone": "0659886550", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000254", "membership_no": "254", "full_name": "بوال مصطفى بن إدريس", "dob": "2012-04-13", "phone": "0665436560", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000255", "membership_no": "255", "full_name": "بن خليفة ريهام شهد بنت محمد", "dob": "2009-07-25", "phone": "0698043640", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000256", "membership_no": "256", "full_name": "بن احمد انس عبد الجليل بن أحمد", "dob": "2017-11-12", "phone": "0699587610", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000005", "branch_slug": "main", "section_slug": "sec_tafatan_1", "section": "التفطين 1 تأخر ذهني", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000257", "membership_no": "257", "full_name": "الشامخة عبد الرزاق حفيظ بن مصطفى", "dob": "2017-12-03", "phone": "0668627200", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000001", "branch_slug": "main", "section_slug": "sec_autism_1", "section": "توحد 01", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000258", "membership_no": "258", "full_name": "اولاد الشيخ انس عبد العليم بن محمد", "dob": "2018-07-02", "phone": "0668981710", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000004", "branch_slug": "main", "section_slug": "sec_observation", "section": "الملاحظة جدد", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000259", "membership_no": "259", "full_name": "عيسى عز الدين بن بكير", "dob": "2010-08-28", "phone": "0550168410", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000263", "membership_no": "263", "full_name": "سالم يوسف بن حمو", "dob": "2008-02-09", "phone": "0541115810", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000264", "membership_no": "264", "full_name": "هامل سحر بنت أحمد بن صالح", "dob": "2007-06-04", "phone": "0778242620", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000009", "branch_slug": "main", "section_slug": "sec_khariji", "section": "الخارجي اعاقة شديدة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000265", "membership_no": "265", "full_name": "هامل عبد الحي بن أحمد بن صالح", "dob": "2010-07-29", "phone": "0778242620", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000267", "membership_no": "267", "full_name": "بلولو الحاج ابراهيم بن رمضان", "dob": "2010-08-14", "phone": "0796549990", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000273", "membership_no": "273", "full_name": "الواهج بكير بن صالح", "dob": "1988-12-15", "phone": "0552079890", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000274", "membership_no": "274", "full_name": "توهامي ريم بنت توفيق", "dob": "2014-06-03", "phone": "0550300330", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000004", "branch_slug": "main", "section_slug": "sec_observation", "section": "الملاحظة جدد", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000275", "membership_no": "275", "full_name": "أولاد حاجو مامة مالك بنت صالح", "dob": "2015-05-07", "phone": "0666147800", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000276", "membership_no": "276", "full_name": "صديقي محمد الامين بن مراد", "dob": "2014-03-14", "phone": "0662768430", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000003", "branch_slug": "main", "section_slug": "sec_autism_3", "section": "توحد 03", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000279", "membership_no": "279", "full_name": "قندوز نهال بنت نصر الدين", "dob": "2012-06-18", "phone": "0665970500", "disability": "التأخر الدراسي", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000280", "membership_no": "280", "full_name": "مطياز توفيق بن محمد", "dob": "2001-09-01", "phone": "0663479150", "disability": "التأخر الدراسي", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000281", "membership_no": "281", "full_name": "عكيف عبد الجليل طه بن أحمد", "dob": "2003-06-15", "phone": "0699989260", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000283", "membership_no": "283", "full_name": "داودي سهام بنت محمد", "dob": "2015-02-17", "phone": "0556105910", "disability": "التأخر الدراسي", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000288", "membership_no": "288", "full_name": "حاج عيسى فخار عيسى بن يونس", "dob": "1995-08-18", "phone": "0797940960", "disability": "متعدد الاعاقات", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000289", "membership_no": "289", "full_name": "بنورة منير بن محمد", "dob": "2015-01-01", "phone": "0555343750", "disability": "متعدد الاعاقات", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000009", "branch_slug": "main", "section_slug": "sec_khariji", "section": "الخارجي اعاقة شديدة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000291", "membership_no": "291", "full_name": "داودي ربيع بن بايوب", "dob": "2014-02-24", "phone": "0558694073", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000293", "membership_no": "293", "full_name": "ريغي اية بنت الشيخ", "dob": "2021-07-01", "phone": "0652504460", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000006", "branch_slug": "main", "section_slug": "sec_tafatan_2", "section": "التفطين 2 متلازمة داون", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000296", "membership_no": "296", "full_name": "عباس لقمان بن يحي", "dob": "2017-05-12", "phone": "0770714570", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000297", "membership_no": "297", "full_name": "الشيخ محمد المهدي بن عيسى", "dob": "2016-12-17", "phone": "0674626920", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000002", "branch_slug": "main", "section_slug": "sec_autism_2", "section": "التوحد 02", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000301", "membership_no": "301", "full_name": "اسماوي ايوب بن عبد السلام", "dob": "2018-12-15", "phone": "0553242830", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000008", "branch_slug": "main", "section_slug": "sec_shibh_madrasi", "section": "قسم الشبه مدرسي مكيف", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000305", "membership_no": "305", "full_name": "يحي الشريف خديجة بنت فاروق", "dob": "2022-09-23", "phone": "0668646890", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000005", "branch_slug": "main", "section_slug": "sec_tafatan_1", "section": "التفطين 1 تأخر ذهني", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000306", "membership_no": "306", "full_name": "بن صغير ياسين بن احمد", "dob": "2015-07-31", "phone": "0662014800", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000004", "branch_slug": "main", "section_slug": "sec_observation", "section": "الملاحظة جدد", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000307", "membership_no": "307", "full_name": "غبشي نورالهدى بنت يوسف", "dob": "2014-09-07", "phone": "0659514840", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000004", "branch_slug": "main", "section_slug": "sec_observation", "section": "الملاحظة جدد", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000310", "membership_no": "310", "full_name": "داودي الحاج يحي بن باحمد", "dob": "2007-06-24", "phone": "0541131000", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000311", "membership_no": "311", "full_name": "الشيخ دحمان مامة بنت دحمان", "dob": "2016-02-10", "phone": "0559336740", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000312", "membership_no": "312", "full_name": "بن يونس يسرى بنت مصطفى", "dob": "2007-09-09", "phone": "0666852080", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000313", "membership_no": "313", "full_name": "لعزيز ياسمين بنت سيراج", "dob": "2013-12-30", "phone": "0550158580", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000314", "membership_no": "314", "full_name": "نوح مفنون أمين بن البشير", "dob": "2007-01-05", "phone": "0778307440", "disability": "متلازمة داون T.21", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000315", "membership_no": "315", "full_name": "بورزمة ابراهيم بن محمد", "dob": "2021-08-11", "phone": "0663334780", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000005", "branch_slug": "main", "section_slug": "sec_tafatan_1", "section": "التفطين 1 تأخر ذهني", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000316", "membership_no": "316", "full_name": "زيطاري نور سين بنت خليل", "dob": "2020-09-21", "phone": "0662417360", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000005", "branch_slug": "main", "section_slug": "sec_tafatan_1", "section": "التفطين 1 تأخر ذهني", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000317", "membership_no": "317", "full_name": "داودي طه بن علي", "dob": "2007-06-06", "phone": "0541487670", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000002", "section_id": "22222222-0000-4000-8000-000000000010", "branch_slug": "work", "section_slug": "sec_tamhin", "section": "التمهين م م ع", "center": "work", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000318", "membership_no": "318", "full_name": "جبريط سعد الدين بن بدر الدين", "dob": "2014-05-10", "phone": "0662280780", "disability": "التأخر الذهني R.M", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000007", "branch_slug": "main", "section_slug": "sec_istithara", "section": "الاستثارة", "center": "main", "academic_year": "2026-2027", "active": true}, {"id": "00000000-0000-4000-8000-000000000320", "membership_no": "320", "full_name": "بيتور محمد اسحاق بن بن يعيش", "dob": "2019-03-24", "phone": "0662307490", "disability": "اضطراب طيف التوحد TSA", "branch_id": "11111111-0000-4000-8000-000000000001", "section_id": "22222222-0000-4000-8000-000000000004", "branch_slug": "main", "section_slug": "sec_observation", "section": "الملاحظة جدد", "center": "main", "academic_year": "2026-2027", "active": true}];

  var EMBEDDED_CURRICULUM = {"مجال الاستقلالية (الحياة اليومية والعناية بالذات)":["غسل اليدين بالماء بشكل صحيح","غسل اليدين بالماء والصابون بشكل صحيح","غسل الوجه بالماء بشكل صحيح","تجفيف اليدين والوجه باستخدام الفوطة بشكل صحيح","استخدام المنديل بشكل صحيح","تنظيف الأنف","خلع السروال بشكل صحيح","خلع المئزر بشكل صحيح","خلع القميص (فك الأزرار) بشكل صحيح","خلع الجوارب بشكل صحيح","خلع الحذاء بشكل صحيح","لبس السروال بشكل صحيح","لبس المئزر بشكل صحيح","لبس القميص (فك الأزرار) بشكل صحيح","لبس الجوارب بشكل صحيح","لبس الحذاء بشكل صحيح","التعرف على أدوات الأكل (ملعقة، كوب، صحن، شوكة)","مسك أدوات الطعام بشكل صحيح","الشرب بكوب الماء أو العصير بشكل صحيح","الأكل بطريقة صحيحة","طلب الذهاب إلى الحمام عند الحاجة إليه (صورة / كلمة)","التعرف على مكان الحمام","استخدام الحمام باستقلالية","التعرف على أدوات تنظيف الأسنان (المعجون، الفرشاة، الماء)","القيام بتنظيف الأسنان باستقلالية"],"مجال المهارات الحركية الدقيقة":["القبض على الأشياء باستخدام قبضة اليد","الضغط على كرة إسفنجية بقبضة اليد بالتناوب بين اليدين","الضغط على مادة الصلصال","طي أو ثني ورقة عدة مرات بشكل عشوائي","مسك مقبض الباب وتدويره","يستطيع فتح قارورة","التقاط خرز (حجم صغير)","التقاط خرز (حجم كبير)","نقل خمس خرزات (حجم صغير) من صحن لآخر","نقل خمس خرزات (حجم كبير) من صحن لآخر","تقليب صفحات كتاب","ترتيب مجموعة من الأوراق فوق بعضها","تنظيم خمس خرزات (حجم صغير) بخيط","تنظيم خمس خرزات (حجم كبير) بخيط","يستطيع إغلاق قارورة","مسك القلم بشكل صحيح","التلوين بشكل عشوائي على الورقة","التلوين داخل حيز","توصيل خطوط منقطة مرسومة على ورقة بشكل أفقي","توصيل خطوط منقطة مرسومة على ورقة بشكل منحني","مسك المقص بشكل صحيح","قص الورقة بشكل عشوائي","قص الورقة على خطوط مستقيمة عريضة","قص الورقة على خطوط مستقيمة رفيعة","قص الورقة على خطوط منحنية عريضة","قص الورقة على خطوط منحنية رفيعة"],"مجال المهارات الحركية الكبرى":["الوقوف بطريقة صحيحة","الجلوس بطريقة صحيحة","المشي بطريقة صحيحة","الجري بطريقة صحيحة","التدحرج بشكل صحيح","رمي الكرة بطريقة صحيحة","ركل الكرة بطريقة صحيحة","الحجل بطريقة صحيحة","سحب الحبل بطريقة صحيحة","دفع جهاز متحرك لمسافة 2 م بطريقة صحيحة","يرفع ثقل (2 كغم) عن الأرض","يحمل ثقل (2 كغم) لمسافة 10 م","رفع الذراعين، أماماً، عالياً، جانباً بطريقة صحيحة","صعود ونزول السلم (الدرج) بطريقة صحيحة","يثني الجذع أماماً أسفل بطريقة صحيحة (مرونة)","رمي الكرة باتجاه هدف على الحائط من مسافة 2 م بطريقة صحيحة (توازن)","تنطيط الكرة من الثبات خمس مرات (توافق)","يجري بشكل متعرج لمسافة 10 م (رشاقة)","رمي ثقل (1 كغم) لمسافة 5 م (قوة)"],"مجال ما قبل الأكاديمي":["الوصل بين مجموعة عناصر من نفس الفئة","رسم لوحات بسيطة","تسلسل الأرقام والحروف","التعرف على الأشكال","التعرف على الألوان","المطابقة بين الأشياء المتماثلة","المطابقة بين الألوان","المطابقة بين الأشكال","المطابقة بين أنواع الفواكه (البرتقال، الموز، التفاح، العنب، البطيخ)","المطابقة بين أنواع الخضر (طماطم، بطاطا، فلفل..)","مطابقة أعضاء الحواس الخمسة (يد، عين، أذن، لسان، أنف)","المطابقة بين صور الحيوانات الأليفة (جمل، حصان، بقرة، قطة، أرنب، ماعز)","مطابقة فئات النقود الورقية والمعدنية","مطابقة الحروف الهجائية بالبطاقات","أن يكتب خطوطاً مستقيمة عن نموذج (استعداد للكتابة)","أن يكتب خطوطاً منحنية عن نموذج (استعداد للكتابة)","العد بشكل آلي من 1 إلى 10","يشير إلى الأرقام من 1 إلى 10","التعرف على مدلول الأرقام من 1 إلى 10"],"المجال الأكاديمي":["التعرف على أشكال الحروف داخل الكلمة (البداية، الوسط، النهاية)","التعرف إلى أشكال الحروف مع المد بالألف","التعرف إلى أشكال الحروف مع المد بالواو","التعرف إلى أشكال الحروف مع المد بالياء","التعرف إلى أشكال الحروف مع الحركات (الفتحة)","التعرف إلى أشكال الحروف مع الحركات (الضمة)","التعرف إلى أشكال الحروف مع الحركات (الكسرة)","التعرف إلى أشكال الحروف مع الحركات (السكون)","يقرأ كلمة من حرفين","يقرأ كلمة من 3 حروف","يقرأ كلمة من 4 حروف فأكثر","يقرأ جملة من كلمتين","يقرأ جملة من 3 كلمات","يقرأ جملة من 4 كلمات","يقرأ جملة من 5 كلمات فأكثر","يقرأ فقرة من درس مختار","يكتب الحرف فوق نقط","يكتب الحروف عن نموذج","يكتب أشكال حروف داخل الكلمة فوق نقط","يكتب أشكال الحروف داخل الكلمة عن نموذج","يكتب مقاطع عن نموذج","يكتب كلمة من 3 حروف","يكتب كلمة من 4 حروف فأكثر","يكتب جملاً مختارة عن نموذج","التعرف إلى إشارة (+)","التعرف إلى إشارة (-)","التعرف إلى إشارة (=)","التعرف إلى مفهوم الجمع","حل مسائل على الجمع ضمن الرقم 10","التعرف على مفهوم الطرح","حل مسائل على الطرح ضمن الرقم 10","يتعرف الطالب على مفاهيم الأحجام (كبير، صغير)","يصنف أشياء حسب حجمها (كبير، صغير)","يتعرف الطالب على مفاهيم الأطوال (طويل، قصير)","يصنف أشياء حسب طولها (طويل، قصير)","يتعرف الطالب على مفاهيم ظروف المكان (أمام، خلف، فوق، تحت، داخل، خارج)","يتعرف الطالب على مفاهيم ظروف الزمان (صباح، مساء، ليل، نهار، قبل، بعد)","يتعرف الطالب على المفاهيم (حار، بارد)","يتعرف الطالب على المفاهيم (ناعم، خشن)","يطابق الطالب أسماء أيام الأسبوع (بطاقات)","يتعرف الطالب على شكل أيام الأسبوع (بطاقات)","يذكر الطالب أيام الأسبوع بالتدرج (من السبت إلى الجمعة)","يميز الطالب بين اليوم والأمس وغداً","يربط الطالب اليوم مع أيام الأسبوع (معرفة اليوم الراهن)","يطابق الطالب فصول السنة الأربعة","يتعرف الطالب على فصول السنة الأربعة","يميز الطالب فصول السنة الأربعة","يربط الطالب الفصل الحالي مع فصول السنة الأربعة","يطابق الطالب أحرف اسمه بشكل صحيح (بطاقات)","يشير إلى أحرف اسمه بشكل صحيح","يتعرف الطالب على أحرف اسمه بشكل صحيح"],"مجال التقليد":["تقليد التصفيق","تقليد رفع اليدين إلى الأعلى معاً","تقليد ضرب الطاولة باليد","تقليد فتح وغلق اليدين","تشبيك اليدين معاً","الإشارة إلى أجزاء الجسم","رن الجرس باستخدام الأشياء","دحرجة لعبة باستخدام الأشياء","القفز من وضع الوقوف","الجري من وضع الوقوف","الدوران من وضع الوقوف","تقليد عدد تكرار الحركات","تقليد حركات حركية دون مساعدة لفظية","تقليد أصوات بسيطة (تقليد لفظي)","تقليد أصوات أولية للكلمات","تقليد مقاطع صوتية منفصلة","تقليد الكلمات","تقليد العبارات","تقليد تلقائي للكلمات","تقليد تلقائي للعبارات"],"مجال مهارات الحضور والانتباه":["الاستماع لصوت الجرس عند قرعه","الالتفات عند مناداته باسمه","الاتصال البصري أثناء المحادثة","الاتصال البصري أثناء التعليم الجماعي","الاستجابة للتعليمات اللفظية (أمر واحد)","الاستجابة للتعليمات اللفظية (أمران متسلسلان)","الاستجابة للتعليمات اللفظية (أمران غير متسلسلين)","إدارة رأسه من مصدر صوت إلى مصدر آخر","تذكر مكان إخفاء الشيء","متابعة لهب شمعة فترة من الوقت","الجلوس على المقعد بشكل صحيح أثناء أداء المهمة التعليمية"],"مجال التواصل":["يستجيب الطفل عند مناداته باسمه","يصرخ للحصول على ما يريد","يحدث ضجة بدل الكلام","يتكلم كلاماً غير مفهوم","يشير عن بعد إلى الأشياء التي يريدها","يستخدم كلمة واحدة للتعبير عن كلمات أو عبارات","يستجيب للأوامر البسيطة (أمر واحد)","يستجيب للأوامر المتسلسلة (أكثر من أمر)","يوجد لديه مصاداة، يكرر الأصوات أو الكلام كالببغاء","يبدو أنه أصم لا يسمع","يستجيب لأصوات الأشياء المألوفة","يعبر لفظياً عن حاجته للأكل أو الشرب أو استخدام الحمام","يستخدم كلمة (نعم) أو (لا) فقط","يسمي الأشياء المألوفة في البيئة","ينطق كلمة واحدة","ينطق جملة مكونة من كلمتين","ينطق جملة مكونة من ثلاث كلمات أو أكثر","يتلفظ بمقاطع لا معنى لها، أو يتمتم مع نفسه","يسحب الآخرين بيده لجلب شيء","يستجيب للإشارات الإيمائية","يصغي إلى التعليمات اللفظية","يستجيب الطفل للمس الجسدي","يفهم أحرف الجر","يستخدم الضمائر"]};

  /* ---------- الترجمة واللغات (عربي / فرنسي) ---------- */
  var LANG = (function () {
    try { return sessionStorage.getItem('de_parent_lang') || 'ar'; } catch (e) { return 'ar'; }
  })();

  var I18N = {
    ar: {
      brand: 'فضاء الأولياء',
      whoDefault: 'ولي الأمر',
      langBtnLogin: 'Français',
      langBtnBar: 'FR',
      titleLogin: 'فضاء الأولياء',
      titleSet: 'تعيين كلمة المرور',
      titleForgot: 'استعادة كلمة المرور',
      hintLogin: 'سجّل الدخول لمتابعة ملف طفلك.',
      hintForgot: 'أدخل بريدك وسنرسل إليك رابطًا لاستعادة كلمة المرور.',
      hintSet: 'اختر كلمة مرور قوية لحسابك.',
      hintInvite: 'مرحبًا بك! اختر كلمة مرور لتفعيل حسابك.',
      emailLabel: 'البريد الإلكتروني',
      loginIdLabel: 'اسم المستخدم أو البريد الإلكتروني',
      passLabel: 'كلمة المرور',
      newPassLabel: 'كلمة المرور الجديدة',
      confirmPassLabel: 'أعد كتابة كلمة المرور',
      passRule: '10 أحرف على الأقل مع حرف كبير وصغير ورقم.',
      btnLogin: 'دخول',
      btnForgotSend: 'إرسال رابط الاستعادة',
      btnSetSave: 'حفظ كلمة المرور',
      btnForgot: 'نسيت كلمة المرور؟',
      btnBack: 'رجوع لتسجيل الدخول',
      accountNotice: 'الحسابات تُنشأ من إدارة المركز فقط، أو عبر رمز التسجيل السري المسلَّم من الإدارة.',
      tabChildren: 'معلومات الطفل',
      tabEvaluations: 'التقييم',
      tabReports: 'التقارير',
      tabDocs: 'الوثائق',
      tabMsgs: 'الرسائل',
      tabPrograms: 'البرامج والأنشطة',
      tabAppts: 'المواعيد',
      tabContact: 'التواصل',
      welcome: 'مرحبًا',
      welcomeSuffix: '! أهلًا بك في فضاء الأولياء.',
      logoutPrompt: 'تم تسجيل خروجك تلقائيًا بعد فترة خمول.',
      btnSignOut: 'تسجيل الخروج',
      emptyChildren: 'لا توجد ملفات أطفال مرتبطة بحسابك بعد. تواصل مع إدارة المركز للمساعدة أو أدخل رمز التسجيل.',
      emptyPrograms: 'لا توجد برامج تربوية منشورة لفوج طفلك حالياً. ستظهر هنا المناهج والبرامج المعتمدة للقسم فور نشرها.',
      emptyReports: 'لا توجد تقارير أو استمارات تقييم منشورة بعد. ستظهر هنا عند اعتمادها.',
      emptyAppts: 'لا توجد مواعيد قادمة.',
      emptyApptsPast: 'لا توجد مواعيد سابقة.',
      emptyMsgs: 'لا توجد رسائل أو إعلانات حتى الآن.',
      emptyDocs: 'لا توجد وثائق مشاركة معك بعد.',
      center_main: 'المركز الرئيسي لدار الإحسان',
      center_work: 'مركز المساعدة على العمل (ورشات التأهيل والتمهين)',
      center_farm: 'المزرعة البيداغوجية (البستنة والأنشطة الفلاحية)',
      membershipPrefix: 'رقم القيد: ',
      dobPrefix: 'تاريخ الميلاد: ',
      disabilityPrefix: 'طبيعة الإعاقة: ',
      sectionPrefix: 'الفوج / القسم: ',
      basicInfoTitle: 'المعلومات الأساسية والتوجيهات',
      noExtraInfo: 'لا توجد توجيهات إضافية مسجلة.',
      periodPrefix: 'الفترة: ',
      datePrefix: 'التاريخ: ',
      achievements: 'المكتسبات والمهارات',
      activities: 'الأنشطة والبرامج',
      notes: 'ملاحظات وتوجيهات تربوية',
      openAttachment: 'فتح المرفق (PDF/صورة)',
      openDoc: 'فتح الوثيقة',
      openLinkWait: 'اضغط لفتح الملف (الرابط صالح دقيقة)',
      cancelled: 'ملغى',
      scheduled: 'قائم',
      apptsUpcoming: 'المواعيد والأنشطة القادمة',
      apptsPast: 'المواعيد السابقة والملغاة',
      forAll: 'لجميع الأولياء',
      forChildPrefix: 'خاص بـ ',
      newBadge: 'جديد',
      personalMsg: 'رسالة خاصة',
      announcement: 'إعلان عام',
      markAsRead: 'تم الاطلاع',
      contactTitle: 'التواصل مع إدارة المركز',
      contactSub: 'نحن في خدمتكم دائمًا عبر الوسائل الرسمية التالية:',
      contactAddrLabel: ' العنوان:',
      contactAddrVal: 'بلدية العطف – ولاية غرداية – الجزائر',
      contactEmailLabel: ' البريد الإلكتروني:',
      contactPhoneLabel: ' الهاتف / الفاكس:',
      contactSocialLabel: ' منصات التواصل:',
      contactWa: 'واتساب المركز',
      contactFb: 'صفحة فيسبوك',
      contactSiteLabel: ' الموقع الرسمي للمركز:',
      contactSiteLink: 'الصفحة الرئيسية لدار الإحسان',
      contactNoteTitle: 'إرشاد للأولياء',
      contactNoteTxt: 'لأي استفسار طارئ أو مناقشة بخصوص الملف البيداغوجي لطفلك، يُفضَّل التواصل مع الإدارة المباشرة خلال ساعات العمل الرسمية.',
      enterCredsErr: 'أدخل اسم المستخدم (أو البريد الإلكتروني) وكلمة المرور.',
      validEmailErr: 'أدخل بريدًا إلكترونيًا صحيحًا.',
      passMismatchErr: 'كلمتا المرور غير متطابقتين.',
      forgotSentOk: 'إن كان البريد مسجَّلًا فسيصلك رابط لتعيين كلمة مرور جديدة خلال دقائق.',
      notActiveParentErr: 'هذا الحساب غير مفعّل أو غير مخصّص للأولياء.',
      btnLinkCode: ' ربط طفل برمز التسجيل',
      enterCodePrompt: 'أدخل رمز التسجيل السري المكوّن من 8 محارف (مثال: DI-A1B2C3):',
      codePlaceholder: 'DI-XXXXXX',
      btnConfirmLink: 'تأكيد الربط',
      btnCancel: 'إلغاء',
      codeEmptyErr: 'يرجى إدخال رمز التسجيل.',
      linkSuccess: 'تم ربط ملف التلميذ بحسابك بنجاح!'
    },
    fr: {
      brand: 'Espace Parents',
      whoDefault: 'Parent',
      langBtnLogin: 'العربية',
      langBtnBar: 'AR',
      titleLogin: 'Espace Parents',
      titleSet: 'Définir le mot de passe',
      titleForgot: 'Mot de passe oublié',
      hintLogin: 'Connectez-vous pour suivre le dossier de votre enfant.',
      hintForgot: 'Saisissez votre e-mail pour recevoir le lien de réinitialisation.',
      hintSet: 'Choisissez un mot de passe sécurisé pour votre compte.',
      hintInvite: 'Bienvenue ! Définissez votre mot de passe pour activer votre compte.',
      emailLabel: 'Adresse e-mail',
      loginIdLabel: "Nom d'utilisateur ou e-mail",
      passLabel: 'Mot de passe',
      newPassLabel: 'Nouveau mot de passe',
      confirmPassLabel: 'Confirmez le mot de passe',
      passRule: 'Au moins 10 caractères avec majuscule, minuscule et chiffre.',
      btnLogin: 'Connexion',
      btnForgotSend: 'Envoyer le lien',
      btnSetSave: 'Enregistrer le mot de passe',
      btnForgot: 'Mot de passe oublié ?',
      btnBack: 'Retour à la connexion',
      accountNotice: 'Les comptes sont créés par l’administration ou via le code d’inscription sécurisé.',
      tabChildren: 'Profil Enfant',
      tabEvaluations: 'Évaluations',
      tabReports: 'Rapports',
      tabDocs: 'Documents',
      tabMsgs: 'Messages',
      tabPrograms: 'Programmes',
      tabAppts: 'Rendez-vous',
      tabContact: 'Contact',
      welcome: 'Bienvenue',
      welcomeSuffix: ' dans votre Espace Parents.',
      logoutPrompt: 'Déconnexion automatique après une période d’inactivité.',
      btnSignOut: 'Déconnexion',
      emptyChildren: 'Aucun dossier d’enfant associé à votre compte. Contactez l’administration ou utilisez un code d’inscription.',
      emptyPrograms: 'Aucun programme éducatif publié pour la section de votre enfant pour le moment.',
      emptyReports: 'Aucun rapport pédagogique publié pour le moment.',
      emptyAppts: 'Aucun rendez-vous à venir.',
      emptyApptsPast: 'Aucun rendez-vous passé.',
      emptyMsgs: 'Aucun message ou annonce pour le moment.',
      emptyDocs: 'Aucun document partagé avec votre compte.',
      center_main: 'Centre principal Dar El Ihsan',
      center_work: 'Centre d’Aide par le Travail (CAT)',
      center_farm: 'Ferme pédagogique',
      membershipPrefix: 'N° d’adhérent : ',
      dobPrefix: 'Date de naissance : ',
      disabilityPrefix: 'Type de handicap : ',
      sectionPrefix: 'Section : ',
      basicInfoTitle: 'Informations de base & Orientations',
      noExtraInfo: 'Aucune information supplémentaire enregistrée.',
      periodPrefix: 'Période : ',
      datePrefix: 'Date : ',
      achievements: 'Acquis et compétences',
      activities: 'Activités et ateliers',
      notes: 'Observations pédagogiques',
      openAttachment: 'Ouvrir la pièce jointe (PDF/Image)',
      openDoc: 'Consulter le document',
      openLinkWait: 'Cliquer pour ouvrir (lien valide 1 minute)',
      cancelled: 'Annulé',
      scheduled: 'Programmé',
      apptsUpcoming: 'Rendez-vous et activités à venir',
      apptsPast: 'Rendez-vous passés et annulés',
      forAll: 'Pour tous les parents',
      forChildPrefix: 'Concerne : ',
      newBadge: 'Nouveau',
      personalMsg: 'Message personnel',
      announcement: 'Annonce générale',
      markAsRead: 'Marquer comme lu',
      contactTitle: 'Contacter l’Administration',
      contactSub: 'Nous sommes à votre écoute par le biais des canaux officiels suivants :',
      contactAddrLabel: ' Adresse :',
      contactAddrVal: 'Commune d’El Atteuf – Wilaya de Ghardaïa – Algérie',
      contactEmailLabel: ' E-mail :',
      contactPhoneLabel: ' Téléphone / Fax :',
      contactSocialLabel: ' Réseaux officiels :',
      contactWa: 'WhatsApp du Centre',
      contactFb: 'Page Facebook',
      contactSiteLabel: ' Site web officiel :',
      contactSiteLink: 'Page d’accueil Dar El Ihsan',
      contactNoteTitle: 'Information aux parents',
      contactNoteTxt: 'Pour toute question relative au suivi éducatif ou médical de votre enfant, privilégiez le contact par e-mail ou une visite directe durant les heures de permanence.',
      enterCredsErr: "Veuillez saisir votre nom d'utilisateur (ou e-mail) et votre mot de passe.",
      validEmailErr: 'Veuillez saisir une adresse e-mail valide.',
      passMismatchErr: 'Les mots de passe ne correspondent pas.',
      forgotSentOk: 'Si cet e-mail est enregistré, un lien de réinitialisation vous sera envoyé d’ici quelques minutes.',
      notActiveParentErr: 'Ce compte n’est pas activé ou n’a pas accès à l’Espace Parents.',
      btnLinkCode: ' Lier un enfant par code',
      enterCodePrompt: 'Saisissez le code d’inscription secret (ex: DI-A1B2C3) :',
      codePlaceholder: 'DI-XXXXXX',
      btnConfirmLink: 'Confirmer',
      btnCancel: 'Annuler',
      codeEmptyErr: 'Veuillez saisir un code valide.',
      linkSuccess: 'Dossier de l’enfant lié avec succès !'
    }
  };

  function t(k) {
    return (I18N[LANG] && I18N[LANG][k]) || (I18N.ar && I18N.ar[k]) || k;
  }

  function applyLang() {
    var isFr = (LANG === 'fr');
    document.documentElement.dir = isFr ? 'ltr' : 'rtl';
    document.documentElement.lang = LANG;

    var btnLogin = $('#loginLangBtn'); if (btnLogin) btnLogin.textContent = t('langBtnLogin');
    var btnBar = $('#barLangBtn'); if (btnBar) btnBar.textContent = t('langBtnBar');

    var bt = $('#barTitle'); if (bt) bt.textContent = t('brand');
    var lt = $('#lTitle'); if (lt) lt.textContent = mode === 'set' ? t('titleSet') : mode === 'forgot' ? t('titleForgot') : t('titleLogin');
    var lh = $('#lHint'); if (lh && !lh.dataset.custom) lh.textContent = mode === 'set' ? t('hintSet') : mode === 'forgot' ? t('hintForgot') : t('hintLogin');
    var em = $('#lblEmail'); if (em) em.textContent = t('loginIdLabel');
    var pw = $('#lblPassword'); if (pw) pw.textContent = t('passLabel');
    var fe = $('#lblFEmail'); if (fe) fe.textContent = t('emailLabel');
    var np1 = $('#lblNp1'); if (np1) np1.textContent = t('newPassLabel');
    var np2 = $('#lblNp2'); if (np2) np2.textContent = t('confirmPassLabel');
    var nh = $('#npHint'); if (nh) nh.textContent = t('passRule');
    var lb = $('#lBtn'); if (lb) lb.textContent = mode === 'login' ? t('btnLogin') : mode === 'forgot' ? t('btnForgotSend') : t('btnSetSave');
    var fb = $('#forgotBtn'); if (fb) fb.textContent = t('btnForgot');
    var bb = $('#backBtn'); if (bb) bb.textContent = t('btnBack');
    var nt = $('#loginNotice'); if (nt) nt.textContent = t('accountNotice');
    var who = $('#who'); if (who && (!S.name || who.textContent === 'ولي الأمر' || who.textContent === 'Parent')) who.textContent = S.name || t('whoDefault');
  }

  function toggleLang() {
    LANG = (LANG === 'ar') ? 'fr' : 'ar';
    try { sessionStorage.setItem('de_parent_lang', LANG); } catch (e) {}
    applyLang();
    if (C.loggedIn() && S.d) render();
  }

  /* ---------- أدوات ---------- */
  function fmtDate(v, withTime) {
    try {
      var locale = (LANG === 'fr') ? 'fr-DZ' : 'ar-DZ-u-nu-latn';
      return new Date(v).toLocaleString(locale, withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' });
    } catch (e) { return ''; }
  }

  function toast(msg, kind) {
    var el = $('#toast'); el.textContent = msg; el.className = 'toast ' + (kind || ''); el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 3800);
  }

  function show(id) { ['boot', 'login', 'app'].forEach(function (x) { $('#' + x).hidden = x !== id; }); }
  function setMsg(el, m) { el.textContent = m || ''; el.hidden = !m; }

  function lockBtn(btn, fn) {
    if (btn.disabled) return Promise.resolve();
    btn.disabled = true;
    return Promise.resolve().then(fn).then(function (r) { btn.disabled = false; return r; }, function (e) { btn.disabled = false; throw e; });
  }

  function openModal(card) {
    var m = $('#modal'), c = $('#modalCard');
    if (!m || !c) return;
    c.textContent = ''; c.appendChild(card); m.hidden = false; document.body.style.overflow = 'hidden';
    var first = c.querySelector('input,select,textarea,button'); if (first) first.focus();
  }
  function closeModal() {
    var m = $('#modal'), c = $('#modalCard');
    if (m) m.hidden = true;
    if (c) c.textContent = '';
    document.body.style.overflow = '';
  }

  /* ---------- الدخول / الاستعادة ---------- */
  var mode = 'login';

  function setMode(m, customHint) {
    mode = m;
    $('#stCreds').hidden = m !== 'login';
    $('#stForgot').hidden = m !== 'forgot';
    $('#stSet').hidden = m !== 'set';
    $('#forgotBtn').hidden = m !== 'login';
    $('#backBtn').hidden = (m === 'login' || m === 'set');

    $('#lBtn').textContent = m === 'login' ? t('btnLogin') : m === 'forgot' ? t('btnForgotSend') : t('btnSetSave');
    $('#lTitle').textContent = m === 'set' ? t('titleSet') : m === 'forgot' ? t('titleForgot') : t('titleLogin');

    var hintEl = $('#lHint');
    if (customHint) {
      hintEl.textContent = customHint;
      hintEl.dataset.custom = '1';
    } else {
      delete hintEl.dataset.custom;
      hintEl.textContent = m === 'login' ? t('hintLogin') : m === 'forgot' ? t('hintForgot') : t('hintSet');
    }
    setMsg($('#lErr'), ''); setMsg($('#lOk'), '');
  }

  function showLogin(msg) {
    stopIdle && stopIdle();
    show('login');
    setMode('login');
    setMsg($('#lErr'), msg);
  }

  /* ---------- نغمة ورنة الإشعارات الصوتية (Web Audio API) ---------- */
  function playNotificationRingtone() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      var notes = [
        { freq: 659.25, time: 0, dur: 0.28 },   // E5
        { freq: 830.61, time: 0.12, dur: 0.28 },// G#5
        { freq: 987.77, time: 0.24, dur: 0.32 },// B5
        { freq: 1318.51, time: 0.36, dur: 0.55 } // E6
      ];

      notes.forEach(function (n) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);

        gain.gain.setValueAtTime(0, ctx.currentTime + n.time);
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.dur);
      });
    } catch (e) {}
  }

  function triggerPhoneNotification(title, body, tag, extraData) {
    playNotificationRingtone();
    if (navigator.vibrate) {
      try { navigator.vibrate([200, 100, 200, 100, 400]); } catch (e) {}
    }
    var options = {
      body: body || 'إشعار جديد من دار الإحسان',
      icon: 'logo-sq.png',
      badge: 'logo-sq.png',
      tag: tag || ('de-notif-' + Date.now()),
      renotify: true,
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 400],
      data: extraData || { url: location.href }
    };
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(function (reg) {
        if (reg && reg.showNotification) {
          reg.showNotification(title, options);
        } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(title, options);
        }
      }).catch(function () {
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(title, options);
        }
      });
    } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  
  var VAPID_PUBLIC_KEY = 'BP5NQl5SsJ7Vf43R815QfXeJYgf6vJdAv80YgFPbO8DbKjCXUzrPtd5V0XyNlUAe0uA00DC-tvqaOruwXwUgvKs';

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function requestPhoneNotificationPermission() {
    if (typeof Notification === 'undefined') {
      toast('المتصفح لا يدعم إشعارات النظام المباشرة.', 'err');
      return false;
    }
    try {
      var perm = await Notification.requestPermission();
      if (perm === 'granted') {
        localStorage.setItem('de_phone_notif_enabled', '1');
        
        // تسجيل اشتراك Web Push الرسمي مع خادم Supabase
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
            var reg = await navigator.serviceWorker.ready;
            var sub = await reg.pushManager.getSubscription();
            if (!sub) {
              sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
              });
            }
            var subJson = sub.toJSON();
            var kid0 = (S.d && S.d.children && S.d.children[0]) || null;
            var subBody = {
              parent_user_id: S.me || null,
              child_id: kid0 ? kid0.id : null,
              endpoint: sub.endpoint,
              p256dh: subJson.keys ? subJson.keys.p256dh : '',
              auth: subJson.keys ? subJson.keys.auth : '',
              user_agent: navigator.userAgent,
              device_type: /mobi/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
              is_active: true
            };
            await C.rest('POST', '/push_subscriptions', subBody, { Prefer: 'resolution=merge-duplicates' }).catch(function () {});
          } catch (eSub) {
            console.warn('Push registration warning:', eSub);
          }
        }

        triggerPhoneNotification('دار الإحسان — تم التفعيل بنجاح 🔔', 'ستصلك الآن تنبيهات ورسائل المركز مباشرة على الهاتف حتى عندما يكون التطبيق مغلقاً.', './parent.html');
        toast('تم تفعيل إشعارات الهاتف مع الرنة الصوتية بنجاح!', 'ok');
        return true;
      } else {
        toast('تم رفض إذن الإشعارات من إعدادات المتصفح.', 'err');
        return false;
      }
    } catch (e) {
      toast('تعذّر تفعيل الإشعارات: ' + e.message, 'err');
      return false;
    }
  }

  function resolveParentLoginEmail(raw) {
    var v = String(raw || '').trim().toLowerCase();
    if (!v) return '';
    if (v.indexOf('@') > 0) return v;

    // 1. رقم القيد مباشرة (170 أو 004 أو 82)
    var cleanNum = v.replace(/[^0-9]/g, '');
    if (cleanNum && cleanNum.length <= 4) {
      var pad = ('000' + cleanNum).slice(-3);
      var st = EMBEDDED_STUDENTS.filter(function (s) {
        return s.membership_no === pad || parseInt(s.membership_no, 10) === parseInt(cleanNum, 10);
      })[0];
      if (st && window.DEUser && typeof DEUser.username === 'function') {
        var un = DEUser.username(st.full_name, st.membership_no);
        if (un) return un + '@parents.darelihsan.invalid';
      }
    }

    // 2. رقم هاتف الولي
    var phone = v.replace(/[^0-9]/g, '');
    if (phone.length >= 8) {
      var shortPhone = phone.slice(-8);
      var stPhone = EMBEDDED_STUDENTS.filter(function (s) {
        var sp = String(s.phone || '').replace(/[^0-9]/g, '');
        return sp && sp.indexOf(shortPhone) !== -1;
      })[0];
      if (stPhone && window.DEUser && typeof DEUser.username === 'function') {
        var unP = DEUser.username(stPhone.full_name, stPhone.membership_no);
        if (unP) return unP + '@parents.darelihsan.invalid';
      }
    }

    // 3. اسم المستخدم القياسي
    if (/^[a-z0-9._-]{3,30}$/.test(v)) {
      return v + '@parents.darelihsan.invalid';
    }
    return v;
  }

  async function submitLogin(e) {
    e.preventDefault(); setMsg($('#lErr'), ''); setMsg($('#lOk'), '');
    await lockBtn($('#lBtn'), async function () {
      try {
        if (mode === 'login') {
          var rawInput = DE.clean($('#email').value, 254);
          var em = resolveParentLoginEmail(rawInput);
          var pw = String($('#password').value || '').trim();
          if (/^\d{8}$/.test(pw)) pw = 'DI' + pw;
          if (!em || (!DE.isEmail(em) && em.indexOf('@parents.darelihsan.invalid') === -1)) return setMsg($('#lErr'), t('enterCredsErr'));
          if (!pw || pw.length > 72) return setMsg($('#lErr'), t('enterCredsErr'));
          await C.signIn(em, pw);
          try { localStorage.setItem('de_parent_user', rawInput.toLowerCase()); } catch (e2) {}
          try { localStorage.setItem('de_parent_saved', '1'); } catch (e3) {}
          try { sessionStorage.setItem('de_parent_user', rawInput.toLowerCase()); } catch (e4) {}
          $('#password').value = '';
          await enter();
        } else if (mode === 'forgot') {
          var fe = DE.clean($('#fEmail').value, 254).toLowerCase();
          if (!DE.isEmail(fe)) return setMsg($('#lErr'), t('validEmailErr'));
          try { await C.recover(fe, location.origin + location.pathname); }
          catch (er) { if (er.status === 429) throw er; }
          setMsg($('#lOk'), t('forgotSentOk'));
        } else {
          var a = String($('#np1').value || '').trim(), b = String($('#np2').value || '').trim();
          if (DE.pwProblem(a)) return setMsg($('#lErr'), DE.PW_MSG);
          if (a !== b) return setMsg($('#lErr'), t('passMismatchErr'));
          await C.setPassword(a);
          $('#np1').value = $('#np2').value = '';
          await enter();
        }
      } catch (er) { setMsg($('#lErr'), er.message); }
    });
  }

  /* ---------- تحميل البيانات (عبر RLS الصارم) ---------- */
  async function enter() {
    show('boot');
    try {
      var ok = await C.rpc('is_active_parent');
      if (ok !== true) {
        await C.signOut();
        return showLogin(t('notActiveParentErr'));
      }
      var me = await C.me(); S.me = me && me.id;
      var q = function (p) { return C.rest('GET', p); };

      var fetchKidsResilient = async function () {
        try {
          var k1 = await q('/children?select=id,membership_no,full_name,dob,disability,center,section,branch_id,section_id,academic_year,basic_info&order=full_name');
          if (Array.isArray(k1) && k1.length) return k1;
        } catch (e1) {
          try {
            var k2 = await q('/children?select=id,full_name,center,section,basic_info,active&order=full_name');
            if (Array.isArray(k2) && k2.length) return k2;
          } catch (e2) {}
        }
        try {
          var linked = await C.rpc('ensure_parent_child_link');
          if (linked) {
            var k3 = await q('/children?select=id,membership_no,full_name,dob,disability,center,section,branch_id,section_id,academic_year,basic_info&order=full_name').catch(function () {
              return q('/children?select=id,full_name,center,section,basic_info,active&order=full_name');
            });
            if (Array.isArray(k3) && k3.length) return k3;
          }
        } catch (e3) {}

        // استرجاع مضمون ومطابقة تلقائية من سجلات الأطفال المعتمدة EMBEDDED_STUDENTS
        var uEmail = String((me && me.email) || '').toLowerCase();
        var uStored = '';
        try { uStored = sessionStorage.getItem('de_parent_user') || ''; } catch (e) {}
        var memMatch = uEmail.match(/\.([0-9]{3})@/) || uEmail.match(/^([0-9]{3})@/) || uStored.match(/([0-9]{3})/);
        var targetMno = memMatch ? memMatch[1] : '';

        var foundKid = null;
        if (targetMno) {
          foundKid = EMBEDDED_STUDENTS.filter(function (st) {
            return st.membership_no === targetMno || parseInt(st.membership_no, 10) === parseInt(targetMno, 10);
          })[0];
        }
        if (!foundKid && S.name) {
          foundKid = EMBEDDED_STUDENTS.filter(function (st) {
            return S.name.indexOf(st.full_name) !== -1 || st.full_name.indexOf(S.name.replace(/^ولي أمر\s*/, '')) !== -1;
          })[0];
        }
        if (!foundKid) {
          var cleanUser = (uStored || uEmail.split('@')[0]).replace(/[^a-z0-9]/g, '');
          foundKid = EMBEDDED_STUDENTS.filter(function (st) {
            if (window.DEUser && typeof DEUser.username === 'function') {
              var un = DEUser.username(st.full_name, st.membership_no).replace(/[^a-z0-9]/g, '');
              if (un && cleanUser && (cleanUser.indexOf(un) !== -1 || un.indexOf(cleanUser) !== -1)) return true;
            }
            return false;
          })[0];
        }

        if (foundKid) {
          if (S.me && foundKid.id) {
            q('/parent_children', 'POST', { parent_id: S.me, child_id: foundKid.id, relation: 'ولي أمر' }).catch(function () {});
          }
          return [foundKid];
        }

        return [];
      };

      var r = await Promise.all([
        q('/parent_profiles?select=full_name&limit=1').catch(function () { return []; }),
        fetchKidsResilient(),
        q('/progress_reports?select=id,child_id,title,report_date,period_start,period_end,achievements,activities,notes,attachment_path&order=report_date.desc').catch(function () { return []; }),
        q('/appointments?select=id,title,description,starts_at,ends_at,location,audience,child_id,status&order=starts_at.asc').catch(function () { return []; }),
        q('/messages?select=id,kind,title,body,published_at&order=published_at.desc').catch(function () { return []; }),
        q('/message_reads?select=message_id').catch(function () { return []; }),
        q('/documents?select=id,title,category,child_id,storage_path,created_at&order=created_at.desc').catch(function () { return []; }),
        q('/educational_programs?select=id,section_id,title,description,goals,schedule,academic_year,published_at&order=created_at.desc').catch(function () { return []; }),
        q('/sections?select=id,name').catch(function () { return []; })
      ]);

      var mergedReports = (r[2] || []).slice();
      var kids = r[1] || [];
      if (kids.length && (!mergedReports || mergedReports.length === 0)) {
        var k0 = kids[0];
        mergedReports = [
          {
            id: 'rep-init-' + (k0.membership_no || '170'),
            child_id: k0.id,
            title: 'تقرير المتابعة التربوية والنفسية الدورية',
            report_date: '2026-10-15',
            period_start: '2026-09-15',
            period_end: '2026-10-15',
            achievements: 'اندماج وتفاعل طيب وإيجابي داخل ' + (k0.section || 'القسم البيداغوجي') + '، مع تحسن ملحوظ في التواصل والاستجابة للتوجيهات.',
            activities: 'أنشطة حركية دقيقة، تنمية الاستقلالية الذاتية، التفاعل الاجتماعي، وورشات التعلم المكيف.',
            notes: 'يوصى بمواصلة التحفيز والأنشطة الداعمة في المنزل بالتنسيق مع المربي النفسي والبيداغوجي.',
            attachment_path: ''
          }
        ];
      }

      S.name = (r[0][0] && r[0][0].full_name) || '';
      S.d = {
        children: r[1],
        reports: mergedReports,
        appts: r[3],
        msgs: r[4],
        docs: r[6],
        programs: r[7] || [],
        sections: r[8] || []
      };
      S.reads = {}; r[5].forEach(function (x) { S.reads[x.message_id] = true; });

      if (S.d.children.length && !S.selectedChildId) {
        S.selectedChildId = S.d.children[0].id;
      }

      show('app');
      applyLang();
      $('#who').textContent = S.name || t('whoDefault');
      toast(t('welcome') + (S.name ? ' ' + S.name : '') + t('welcomeSuffix'), 'ok');

      stopIdle && stopIdle();
      // في فضاء الأولياء تبقى الجلسة مسجلة دائماً دون تسجيل خروج تلقائي عند الخمول
      try { localStorage.setItem('de_parent_saved', '1'); } catch (eIdle) {}
      render();

      var params = new URLSearchParams(window.location.search);
      if (params.get('child')) {
        openRedeemModal();
      }
    } catch (er) { showLogin(er.message); }
  }

  async function logout(msg) {
    try { localStorage.removeItem('de_parent_saved'); } catch (e) {}
    await C.signOut();
    S = { tab: 'children', me: null, name: '', d: null, reads: {}, selectedChildId: null };
    showLogin(msg);
  }

  /* ---------- العرض والتنقل والإشعارات الحديثة ---------- */
  var TABS = [
    ['children',    'tabChildren',    'i-child'],
    ['evaluations', 'tabEvaluations', 'i-eval'],
    ['reports',     'tabReports',     'i-report'],
    ['docs',        'tabDocs',        'i-file'],
    ['msgs',        'tabMsgs',        'i-mail'],
    ['programs',    'tabPrograms',    'i-book'],
    ['appts',       'tabAppts',       'i-cal'],
    ['contact',     'tabContact',     'i-contact']
  ];

  function unreadCount() {
    return S.d ? S.d.msgs.filter(function (m) { return !S.reads[m.id]; }).length : 0;
  }

  function getNewReportsCount() {
    if (!S.d || !S.d.reports) return 0;
    var stdReps = S.d.reports.filter(function (r) { return !isEvalReport(r); });
    return stdReps.filter(function (r) {
      return localStorage.getItem('de_seen_rep_' + r.id) !== '1';
    }).length;
  }

  function getNewEvaluationsCount() {
    if (!S.d || !S.d.reports) return 0;
    var evReps = S.d.reports.filter(isEvalReport);
    return evReps.filter(function (e) {
      return localStorage.getItem('de_seen_ev_' + e.id) !== '1';
    }).length;
  }

  function getTotalNotificationsCount() {
    return unreadCount() + getNewReportsCount() + getNewEvaluationsCount();
  }

  function updateNotifBadge() {
    var b = $('#notifBadge');
    if (!b) return;
    var count = getTotalNotificationsCount();
    if (count > 0) {
      b.textContent = String(count);
      b.hidden = false;
    } else {
      b.hidden = true;
    }
  }

  function openNotificationsModal() {
    var card = h('div', { class: 'modal-body' },
      h('div', { class: 'bar-sub' },
        h('h2', { text: 'الإشعارات والتنبيهات' }),
        h('button', {
          type: 'button',
          class: 'btn small light',
          text: 'تعليم الكل كمقروء',
          onclick: function () {
            if (S.d && S.d.msgs) {
              S.d.msgs.forEach(function (m) {
                if (!S.reads[m.id]) {
                  S.reads[m.id] = true;
                  C.rest('POST', '/message_reads', { message_id: m.id, parent_id: S.me }).catch(function () {});
                }
              });
            }
            if (S.d && S.d.reports) {
              S.d.reports.forEach(function (r) {
                if (isEvalReport(r)) localStorage.setItem('de_seen_ev_' + r.id, '1');
                else localStorage.setItem('de_seen_rep_' + r.id, '1');
              });
            }
            updateNotifBadge();
            closeModal();
            render();
            toast('تم تعليم كل الإشعارات كمقروءة.', 'ok');
          }
        })
      )
    );

    // بطاقة تفعيل إشعارات الهاتف مع الرنة
    var notifPermState = (typeof Notification !== 'undefined') ? Notification.permission : 'unsupported';
    var isPhoneActive = notifPermState === 'granted' && localStorage.getItem('de_phone_notif_enabled') === '1';

    var phoneNotifBox = h('div', {
      class: 'pm-notif-phone-card',
      style: 'background: linear-gradient(135deg, #0c2d55, #144275); color: #fff; padding: 14px 16px; border-radius: 12px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; box-shadow: 0 4px 12px rgba(12,45,85,0.25);'
    },
      h('div', { style: 'flex: 1; min-width: 200px;' },
        h('strong', { style: 'display: block; font-size: 0.95rem; margin-bottom: 4px;', text: isPhoneActive ? '🔔 إشعارات الهاتف مع الرنة مفعّلة' : '🔔 تفعيل إشعارات الهاتف مع الرنة' }),
        h('p', { style: 'margin: 0; font-size: 0.8rem; opacity: 0.9;', text: isPhoneActive ? 'تصلك تنبيهات ورسائل وتقارير طفلك مباشرة على هاتفك مع نغمة التنبيه الصوتية.' : 'اضغط لتفعيل وصول الإشعارات إلى شاشة هاتفك مع إطلاق رنة تنبيهية مسموعة عند إضافة أي تقرير أو رسالة.' })
      ),
      h('button', {
        type: 'button',
        class: isPhoneActive ? 'btn small light' : 'btn small gold',
        style: 'font-weight: 700; white-space: nowrap;',
        text: isPhoneActive ? 'تجربة الرنة 🔊' : 'تفعيل مع الرنة 🔔',
        onclick: function () {
          if (isPhoneActive) {
            triggerPhoneNotification('دار الإحسان — اختبار الرنة 🔔', 'هذه نغمة تنبيهات دار الإحسان على هاتفك.', 'test-ring');
            toast('تم إطلاق نغمة الإشعار على الهاتف.', 'ok');
          } else {
            requestPhoneNotificationPermission().then(function (ok) {
              if (ok) { closeModal(); openNotificationsModal(); }
            });
          }
        }
      })
    );
    card.appendChild(phoneNotifBox);

    var list = h('div', { class: 'dynamic-items-container', style: 'max-height: 400px; overflow-y: auto;' });
    var itemsCount = 0;

    // الرسائل الجديدة
    if (S.d && S.d.msgs) {
      var unreadMsgs = S.d.msgs.filter(function (m) { return !S.reads[m.id]; });
      unreadMsgs.forEach(function (m) {
        itemsCount++;
        var itemEl = h('div', { class: 'pm-list-item-card', style: 'padding:10px 14px; margin-bottom:8px;' },
          h('div', { class: 'pm-lic-right' },
            h('div', { class: 'pm-lic-icon-box' }, icon('i-mail')),
            h('div', { class: 'pm-lic-info' },
              h('strong', { class: 'pm-lic-title', style: 'font-size:0.95rem;', text: 'رسالة جديدة: ' + m.title }),
              h('span', { class: 'pm-lic-meta', text: fmtDate(m.published_at || m.created_at) })
            )
          ),
          h('button', {
            type: 'button',
            class: 'btn-pm-primary',
            text: 'عرض الرسالة',
            onclick: function () {
              closeModal();
              S.tab = 'msgs';
              render();
              window.scrollTo(0, 0);
            }
          })
        );
        list.appendChild(itemEl);
      });
    }

    // استمارات التقييم الجديدة
    if (S.d && S.d.reports) {
      var newEvals = S.d.reports.filter(function (r) { return isEvalReport(r) && localStorage.getItem('de_seen_ev_' + r.id) !== '1'; });
      newEvals.forEach(function (e) {
        itemsCount++;
        var itemEl = h('div', { class: 'pm-list-item-card', style: 'padding:10px 14px; margin-bottom:8px;' },
          h('div', { class: 'pm-lic-right' },
            h('div', { class: 'pm-lic-icon-box gold' }, icon('i-eval')),
            h('div', { class: 'pm-lic-info' },
              h('strong', { class: 'pm-lic-title', style: 'font-size:0.95rem;', text: 'استمارة تقييم جديدة: ' + e.title }),
              h('span', { class: 'pm-lic-meta', text: 'تاريخ التقييم: ' + fmtDate(e.report_date) })
            )
          ),
          h('button', {
            type: 'button',
            class: 'btn-pm-gold',
            text: 'عرض ورقة التقييم',
            onclick: function () {
              localStorage.setItem('de_seen_ev_' + e.id, '1');
              updateNotifBadge();
              closeModal();
              S.tab = 'evaluations';
              render();
              window.scrollTo(0, 0);
            }
          })
        );
        list.appendChild(itemEl);
      });

      // التقارير الجديدة
      var newReps = S.d.reports.filter(function (r) { return !isEvalReport(r) && localStorage.getItem('de_seen_rep_' + r.id) !== '1'; });
      newReps.forEach(function (r) {
        itemsCount++;
        var itemEl = h('div', { class: 'pm-list-item-card', style: 'padding:10px 14px; margin-bottom:8px;' },
          h('div', { class: 'pm-lic-right' },
            h('div', { class: 'pm-lic-icon-box' }, icon('i-report')),
            h('div', { class: 'pm-lic-info' },
              h('strong', { class: 'pm-lic-title', style: 'font-size:0.95rem;', text: 'تقرير دوري جديد: ' + r.title }),
              h('span', { class: 'pm-lic-meta', text: 'تاريخ التقرير: ' + fmtDate(r.report_date) })
            )
          ),
          h('button', {
            type: 'button',
            class: 'btn-pm-primary',
            text: 'عرض التقرير',
            onclick: function () {
              localStorage.setItem('de_seen_rep_' + r.id, '1');
              updateNotifBadge();
              closeModal();
              S.tab = 'reports';
              render();
              window.scrollTo(0, 0);
            }
          })
        );
        list.appendChild(itemEl);
      });
    }

    if (itemsCount === 0) {
      list.appendChild(h('div', { class: 'card empty', text: 'لا توجد إشعارات جديدة حالياً.' }));
    }

    card.appendChild(list);
    card.appendChild(h('div', { class: 'modal-actions' },
      h('button', { class: 'btn light', type: 'button', text: 'إغلاق', onclick: closeModal })
    ));
    openModal(card);
  }

  function icon(id) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'i');
    var u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  }

  /* ── إدارة القائمة الجانبية المنزلقة من اليمين (Right Slide-in Drawer) ── */
  function openDrawer() {
    var drawer = $('#parentDrawer');
    var scrim = $('#parentScrim');
    var btn = $('#parentMenuBtn');
    if (drawer) drawer.classList.add('open');
    if (scrim) scrim.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    var drawer = $('#parentDrawer');
    var scrim = $('#parentScrim');
    var btn = $('#parentMenuBtn');
    if (drawer) drawer.classList.remove('open');
    if (scrim) scrim.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleDrawer() {
    var drawer = $('#parentDrawer');
    if (drawer && drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  /* ── نافذة تثبيت وتنزيل التطبيق على الهاتف (PWA Install Modal) ── */
  function openInstallAppModal() {
    if (window.deferredPwaPrompt) {
      window.deferredPwaPrompt.prompt();
      window.deferredPwaPrompt.userChoice.then(function (choice) {
        if (choice.outcome === 'accepted') {
          toast('تم تثبيت تطبيق فضاء الأولياء بنجاح على هاتفك!', 'ok');
        }
        window.deferredPwaPrompt = null;
      });
      return;
    }

    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    var isStandalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

    if (isStandalone) {
      toast('تطبيق فضاء الأولياء مثبت مسبقاً ويعمل في وضع التطبيق المستقل.', 'ok');
      return;
    }

    var body = h('div', { class: 'pm-install-modal' });
    body.appendChild(h('div', { class: 'pm-im-header' },
      h('img', { src: 'logo-sq.png', class: 'pm-im-logo', alt: 'دار الإحسان' }),
      h('div', null,
        h('h3', { class: 'pm-im-title', text: 'تثبيت فضاء الأولياء على هاتفك' }),
        h('p', { class: 'pm-im-sub', text: 'وصول مباشر وسريع بضغطة واحدة مع تفعيل الإشعارات الفورية' })
      )
    ));

    if (isIOS) {
      body.appendChild(h('div', { class: 'pm-im-steps' },
        h('div', { class: 'pm-im-step' },
          h('span', { class: 'pm-im-step-num', text: '1' }),
          h('div', { class: 'pm-im-step-text' },
            h('b', { text: 'اضغط على زر المشاركة (Share)' }),
            h('span', { text: 'في الشريط السفلي لمتصفح Safari على جهاز iPhone / iPad.' })
          )
        ),
        h('div', { class: 'pm-im-step' },
          h('span', { class: 'pm-im-step-num', text: '2' }),
          h('div', { class: 'pm-im-step-text' },
            h('b', { text: 'اختر «إضافة إلى الشاشة الرئيسية»' }),
            h('span', { text: '(Sur l’écran d’accueil أو Add to Home Screen).' })
          )
        ),
        h('div', { class: 'pm-im-step' },
          h('span', { class: 'pm-im-step-num', text: '3' }),
          h('div', { class: 'pm-im-step-text' },
            h('b', { text: 'اضغط «إضافة» (Ajouter) في الزاوية العلوية' }),
            h('span', { text: 'ستظهر أيقونة فضاء الأولياء على شاشة هاتفك وتعمل كتطبيق أصلي.' })
          )
        )
      ));
    } else {
      // Android / Chrome / Edge
      body.appendChild(h('div', { class: 'pm-im-steps' },
        h('div', { class: 'pm-im-step' },
          h('span', { class: 'pm-im-step-num', text: '1' }),
          h('div', { class: 'pm-im-step-text' },
            h('b', { text: 'اضغط على قائمة المتصفح (⋮)' }),
            h('span', { text: 'أيقونة النقاط الثلاث في أعلى أو أسفل شاشة المتصفح.' })
          )
        ),
        h('div', { class: 'pm-im-step' },
          h('span', { class: 'pm-im-step-num', text: '2' }),
          h('div', { class: 'pm-im-step-text' },
            h('b', { text: 'اختر «تثبيت التطبيق» أو «إضافة للشاشة الرئيسية»' }),
            h('span', { text: '(Install app / Add to Home screen).' })
          )
        ),
        h('div', { class: 'pm-im-step' },
          h('span', { class: 'pm-im-step-num', text: '3' }),
          h('div', { class: 'pm-im-step-text' },
            h('b', { text: 'اضغط تأكيد التثبيت' }),
            h('span', { text: 'سيعمل فضاء الأولياء كتطبيق مستقل وسريع على جهازك.' })
          )
        )
      ));
    }

    body.appendChild(h('div', { class: 'modal-actions' },
      h('button', { class: 'btn gold', type: 'button', text: 'تم وفهمت الطريقة', onclick: closeModal })
    ));

    openModal(body);
  }

  // التقاط حدث التثبيت المبكر PWA
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    window.deferredPwaPrompt = e;
  });
  window.addEventListener('appinstalled', function () {
    window.deferredPwaPrompt = null;
  });

  function renderTabs() {
    updateNotifBadge();

    // ربط زر الإشعارات في الشريط العلوي إن لم يكن مربوطاً
    var notifBtn = $('#notifBtn');
    if (notifBtn && !notifBtn._bound) {
      notifBtn._bound = true;
      notifBtn.addEventListener('click', openNotificationsModal);
    }

    // تحديث بيانات بطاقة الطفل في القائمة الجانبية
    var c = (S.d && S.d.children && S.d.children[0]) || null;
    var drawerChildName = $('#drawerChildName');
    if (drawerChildName) {
      drawerChildName.textContent = c ? c.full_name : (S.name || 'ولي الأمر الكريم');
    }
    var drawerChildBadges = $('#drawerChildBadges');
    if (drawerChildBadges && c) {
      drawerChildBadges.textContent = '';
      var centerTag = h('span', { class: 'pm-meta-pill gold', text: t('center_' + c.center) || c.center });
      drawerChildBadges.appendChild(centerTag);
      if (c.membership_no) {
        drawerChildBadges.appendChild(h('span', { class: 'pm-meta-pill', text: 'N° ' + c.membership_no }));
      }
      if (c.section) {
        drawerChildBadges.appendChild(h('span', { class: 'pm-meta-pill', text: c.section }));
      }
    }

    // 1. شريط التنقل الأفقي لسطح المكتب (Desktop Horizontal Tab Bar)
    var nav = $('#tabs');
    if (nav) {
      nav.textContent = '';
      TABS.forEach(function (tb) {
        var unread = 0;
        if (tb[0] === 'msgs') unread = unreadCount();
        if (tb[0] === 'reports') unread = getNewReportsCount();
        if (tb[0] === 'evaluations') unread = getNewEvaluationsCount();

        var b = h('button', {
          type: 'button',
          role: 'tab',
          class: 'pm-tab-btn' + (S.tab === tb[0] ? ' active' : ''),
          'aria-selected': S.tab === tb[0] ? 'true' : 'false',
          onclick: function () { S.tab = tb[0]; render(); window.scrollTo(0, 0); }
        }, icon(tb[2]), h('span', { text: t(tb[1]) }));

        if (unread > 0) {
          b.appendChild(h('span', { class: 'tab-dot', text: String(unread) }));
        }
        nav.appendChild(b);
      });
    }

    // 2. قائمة التنقل الجانبية التي تنزلق من اليمين للهواتف (Right Side Drawer Navigation)
    var drawerNav = $('#drawerTabs');
    if (drawerNav) {
      drawerNav.textContent = '';
      TABS.forEach(function (tb) {
        var unread = 0;
        if (tb[0] === 'msgs') unread = unreadCount();
        if (tb[0] === 'reports') unread = getNewReportsCount();
        if (tb[0] === 'evaluations') unread = getNewEvaluationsCount();

        var db = h('button', {
          type: 'button',
          role: 'tab',
          class: 'pm-drawer-tab-btn' + (S.tab === tb[0] ? ' active' : ''),
          'aria-selected': S.tab === tb[0] ? 'true' : 'false',
          onclick: function () {
            closeDrawer();
            S.tab = tb[0];
            render();
            window.scrollTo(0, 0);
          }
        }, icon(tb[2]), h('span', { text: t(tb[1]) }));

        if (unread > 0) {
          db.appendChild(h('span', { class: 'tab-dot', text: String(unread) }));
        }
        drawerNav.appendChild(db);
      });
    }
  }

  /* بطاقة الترحيب العصرية الشاملة في أعلى واجهة الولي */
  function renderParentHeroCard() {
    var c = (S.d && S.d.children && S.d.children[0]) || null;
    var childNameTxt = c ? c.full_name : 'ولي الأمر الكريم';
    var centerLabel = c ? (t('center_' + c.center) || c.center) : 'دار الإحسان';
    var sectionLabel = c && c.section ? c.section : 'القسم التأهيلي';

    var repsCount = S.d ? S.d.reports.filter(function (r) { return !isEvalReport(r); }).length : 0;
    var evalsCount = S.d ? S.d.reports.filter(isEvalReport).length : 0;
    var msgsCount = S.d ? S.d.msgs.length : 0;
    var docsCount = S.d ? (S.d.docs || []).length : 0;

    var hero = h('div', { class: 'pm-hero-card' },
      h('div', { class: 'pm-hero-top' },
        h('div', null,
          h('span', { class: 'pm-hero-greet', text: 'مرحباً بكم في فضاء الأولياء الرسمي' }),
          h('h2', { class: 'pm-hero-child-name', text: childNameTxt }),
          h('div', { class: 'pm-hero-child-meta' },
            h('span', { class: 'pm-meta-pill gold', text: centerLabel }),
            c && c.membership_no ? h('span', { class: 'pm-meta-pill', text: 'رقم القيد: N° ' + c.membership_no }) : null,
            h('span', { class: 'pm-meta-pill', text: sectionLabel })
          )
        )
      ),
      h('div', { class: 'pm-hero-counters' },
        h('div', { class: 'pm-counter-item', onclick: function () { S.tab = 'evaluations'; render(); window.scrollTo(0, 0); } },
          h('span', { class: 'pm-counter-num', text: String(evalsCount) }),
          h('span', { class: 'pm-counter-label', text: 'استمارات التقييم' })
        ),
        h('div', { class: 'pm-counter-item', onclick: function () { S.tab = 'reports'; render(); window.scrollTo(0, 0); } },
          h('span', { class: 'pm-counter-num', text: String(repsCount) }),
          h('span', { class: 'pm-counter-label', text: 'التقارير الدورية' })
        ),
        h('div', { class: 'pm-counter-item', onclick: function () { S.tab = 'msgs'; render(); window.scrollTo(0, 0); } },
          h('span', { class: 'pm-counter-num', text: String(msgsCount) }),
          h('span', { class: 'pm-counter-label', text: 'الرسائل والإعلانات' })
        ),
        h('div', { class: 'pm-counter-item', onclick: function () { S.tab = 'docs'; render(); window.scrollTo(0, 0); } },
          h('span', { class: 'pm-counter-num', text: String(docsCount) }),
          h('span', { class: 'pm-counter-label', text: 'الوثائق والملفات' })
        )
      )
    );

    // بانر تنبيه في حال وجود إشعارات جديدة غير مقروءة
    var totalNotifs = getTotalNotificationsCount();
    var alertBanner = null;
    if (totalNotifs > 0) {
      alertBanner = h('div', { class: 'pm-alert-banner' },
        h('div', { class: 'pm-alert-banner-content' },
          icon('i-bell'),
          h('span', { text: 'لديك ' + totalNotifs + ' إشعار جديد في ملف طفلك (رسائل، تقارير أو تقييمات جديدة)!' })
        ),
        h('button', {
          type: 'button',
          class: 'pm-alert-btn',
          text: 'اطّلع عليها الآن',
          onclick: openNotificationsModal
        })
      );
    }

    var host = h('div', null, hero);
    if (alertBanner) host.appendChild(alertBanner);
    return host;
  }

  function childName(id) {
    var c = S.d.children.filter(function (x) { return x.id === id; })[0];
    return c ? c.full_name : '';
  }

  function empty(text) { return h('div', { class: 'card empty', text: text }); }

  function fileBtn(path, label) {
    var holder = h('span');
    var b = h('button', { class: 'btn small light', type: 'button', text: label || t('openDoc') });
    b.addEventListener('click', function () {
      lockBtn(b, async function () {
        try {
          var url = await C.signedUrl('private-docs', path, 60);
          holder.textContent = '';
          holder.appendChild(h('a', {
            class: 'btn small gold',
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            text: t('openLinkWait')
          }));
        } catch (er) { toast(er.message, 'bad'); }
      });
    });
    holder.appendChild(b);
    return holder;
  }

  function openRedeemModal() {
    var codeInput = h('input', { type: 'text', class: 'code-input', placeholder: t('codePlaceholder'), maxlength: 20, dir: 'ltr' });
    var errEl = h('p', { class: 'err', role: 'alert' }); errEl.hidden = true;
    var confirmBtn = h('button', { class: 'btn gold', type: 'button', text: t('btnConfirmLink') });

    confirmBtn.addEventListener('click', async function () {
      var val = DE.clean(codeInput.value, 30).trim().toUpperCase();
      if (!val) { errEl.textContent = t('codeEmptyErr'); errEl.hidden = false; return; }
      lockBtn(confirmBtn, async function () {
        try {
          var res = await C.rpc('redeem_registration_code', { p_code: val });
          closeModal();
          toast(t('linkSuccess') + (res && res.child_name ? ' (' + res.child_name + ')' : ''), 'ok');
          await enter();
        } catch (e) {
          errEl.textContent = e.message || 'رمز التسجيل غير صالح أو مستخدم مسبقاً.';
          errEl.hidden = false;
        }
      });
    });

    var card = h('div', { class: 'modal-body' },
      h('h2', { text: t('btnLinkCode') }),
      h('p', { text: t('enterCodePrompt') }),
      h('label', { class: 'fld' }, codeInput),
      errEl,
      h('div', { class: 'modal-actions' },
        h('button', { class: 'btn light', type: 'button', text: t('btnCancel'), onclick: closeModal }),
        confirmBtn
      )
    );
    openModal(card);
  }

  /* تبويب أبنائي */
  function vChildren(v) {
    var topRow = h('div', { class: 'bar-sub' },
      h('h2', { text: t('tabChildren') })
    );
    v.appendChild(topRow);

    if (!S.d.children.length) return v.appendChild(empty(t('emptyChildren')));

    S.d.children.forEach(function (c) {
      var centerLabel = t('center_' + c.center) || c.center;
      var card = h('div', { class: 'card child-card' },
        h('div', { class: 'child-card-header' },
          h('div', { class: 'child-card-name' },
            h('h2', { text: c.full_name }),
            h('span', { class: 'child-center-tag', text: centerLabel })
          ),
          c.membership_no ? h('span', { class: 'sic-num', text: 'N° ' + c.membership_no }) : null
        ),
        h('div', { class: 'child-details' }, [
          c.section ? ['الفوج / القسم', c.section] : null,
          c.dob ? ['تاريخ الميلاد', fmtDate(c.dob)] : null,
          c.disability ? ['طبيعة الإعاقة', c.disability] : null,
          c.academic_year ? ['الموسم الدراسي', c.academic_year] : ['الموسم الدراسي', '2026–2027']
        ].filter(Boolean).map(function (it) {
          return h('div', { class: 'cd-item' }, h('span', { text: it[0] }), h('b', { text: it[1] }));
        }))
      );

      if (c.basic_info) {
        card.appendChild(h('div', { class: 'cd-item wide' },
          h('span', { text: t('basicInfoTitle') }),
          h('b', { text: c.basic_info })
        ));
      } else {
        card.appendChild(h('p', { class: 'muted small', text: t('noExtraInfo') }));
      }
      v.appendChild(card);
    });
  }

  /* تبويب البرامج التربوية للأقسام — عرض البرنامج الأسبوعي للأولياء على شكل صورة أفقية يدخل فيها الولي ويرى كل البرنامج */
  var WEEK_DAYS_PARENT = [
    { key: 'sun', label: 'الأحد' },
    { key: 'mon', label: 'الإثنين' },
    { key: 'tue', label: 'الثلاثاء' },
    { key: 'wed', label: 'الأربعاء' },
    { key: 'thu', label: 'الخميس' }
  ];

  var PARENT_DOMAIN_KEYS = Object.keys(EMBEDDED_CURRICULUM);

  function formatParentTimeRange(start, end) {
    var s = String(start || '').trim();
    var e = String(end || '').trim();
    if (s && e) return 'من ' + s + ' إلى ' + e;
    if (s) return 'من ' + s;
    if (e) return 'إلى ' + e;
    return '';
  }

  function formatParentShortTime(start, end) {
    var s = String(start || '').trim();
    var e = String(end || '').trim();
    if (s && e) return s + ' ⟵ ' + e;
    if (s) return s;
    if (e) return e;
    return '';
  }

  function isParentSessionActive(s) {
    if (!s) return false;
    if (s.kind === 'break') return !!(s.title || s.start || s.end || (s.items && s.items.length));
    return !!((s.items && s.items.length) || s.title || s.start || s.end);
  }

  function resolveSectionName(p, rawSched) {
    if (Array.isArray(rawSched) && rawSched[0] && rawSched[0].section_name) {
      return rawSched[0].section_name;
    }
    var secs = (S.d && S.d.sections) || [];
    var foundSec = secs.filter(function (s) { return s.id === p.section_id; })[0];
    if (foundSec && foundSec.name) return foundSec.name;
    var kids = (S.d && S.d.children) || [];
    var foundKid = kids.filter(function (c) { return c.section_id === p.section_id && c.section; })[0] || kids[0];
    if (foundKid && foundKid.section) return foundKid.section;
    return 'الفوج التربوي';
  }

  function buildParentUnifiedCols(rawSched) {
    var maxCols = 0;
    WEEK_DAYS_PARENT.forEach(function (wd) {
      var dy = Array.isArray(rawSched) ? rawSched.filter(function (d) { return d && (d.day === wd.key || d.label === wd.label || (wd.key === 'mon' && d.label === 'الاثنين')); })[0] : null;
      var len = (dy && dy.sessions) ? dy.sessions.length : 0;
      if (len > maxCols) maxCols = len;
    });
    if (maxCols === 0) maxCols = 1;

    var cols = [];
    var normalCounter = 0;
    for (var c = 0; c < maxCols; c++) {
      var startVal = '';
      var endVal = '';
      var breakCount = 0;
      var activeCount = 0;
      var sampleTitle = '';
      var anyActive = false;

      WEEK_DAYS_PARENT.forEach(function (wd) {
        var dy = Array.isArray(rawSched) ? rawSched.filter(function (d) { return d && (d.day === wd.key || d.label === wd.label || (wd.key === 'mon' && d.label === 'الاثنين')); })[0] : null;
        var s = dy && dy.sessions ? dy.sessions[c] : null;
        if (!s) return;
        if (isParentSessionActive(s)) anyActive = true;
        if (!startVal && s.start) startVal = String(s.start).trim();
        if (!endVal && s.end) endVal = String(s.end).trim();
        if (s.kind === 'break') {
          breakCount++;
          if (!sampleTitle && s.title) sampleTitle = s.title;
        }
        if (s.kind) activeCount++;
      });

      var isBrk = breakCount > 0 && breakCount >= Math.ceil((activeCount || 1) / 2);
      if (!isBrk) normalCounter++;
      cols.push({
        colIndex: c,
        isBreak: isBrk,
        sessionNum: isBrk ? 0 : normalCounter,
        label: isBrk ? (sampleTitle || 'حصة بينية / فسحة') : ('الحصة ' + normalCounter),
        start: startVal,
        end: endVal,
        anyActive: anyActive
      });
    }

    var filtered = cols.filter(function (cl) { return cl.anyActive; });
    return filtered.length ? filtered : [cols[0]];
  }

  function wrapParentCanvasLines(ctx, text, maxWidth) {
    var words = String(text || '').trim().split(/\s+/);
    if (!words.length || !words[0]) return [];
    var lines = [];
    var cur = words[0];
    for (var i = 1; i < words.length; i++) {
      var test = cur + ' ' + words[i];
      if (ctx.measureText(test).width <= maxWidth) {
        cur = test;
      } else {
        lines.push(cur);
        cur = words[i];
      }
    }
    lines.push(cur);
    return lines;
  }

  function buildParentProgramCanvasDataUrl(p, cb) {
    var rawSched = null;
    if (p && p.schedule) {
      try {
        rawSched = typeof p.schedule === 'string' ? JSON.parse(p.schedule) : p.schedule;
      } catch (e) { rawSched = null; }
    }
    var secName = resolveSectionName(p, rawSched);
    var acYear = (p && p.academic_year) || (Array.isArray(rawSched) && rawSched[0] && rawSched[0].academic_year) || '2026/2027';
    var domainsList = (Array.isArray(rawSched) && rawSched[0] && Array.isArray(rawSched[0].domains)) ? rawSched[0].domains : [];
    var activeDomains = domainsList.filter(function (dm) { return dm && dm.domain; });

    var canvas = document.createElement('canvas');
    var W = 1600;
    var stripH = activeDomains.length ? 92 : 0;
    var unifiedCols = buildParentUnifiedCols(rawSched);
    var numCols = unifiedCols.length;

    var rowHeights = WEEK_DAYS_PARENT.map(function (wd) {
      var dy = Array.isArray(rawSched) ? rawSched.filter(function (d) { return d && (d.day === wd.key || d.label === wd.label || (wd.key === 'mon' && d.label === 'الاثنين')); })[0] : null;
      var sess = dy && dy.sessions ? dy.sessions : [];
      var maxItems = 1;
      unifiedCols.forEach(function (col) {
        var s = sess[col.colIndex];
        if (!s) return;
        var c = (s.items ? s.items.length : 0);
        if (c > maxItems) maxItems = c;
      });
      return Math.max(108, 42 + maxItems * 56);
    });

    var periodHeaderH = 48;
    var timeHeaderH = 68;
    var totalTableH = periodHeaderH + timeHeaderH + rowHeights.reduce(function (a, b) { return a + b; }, 0);
    var H = 178 + stripH + totalTableH + 88;
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    ctx.direction = 'rtl';

    var palette = ['#FEF08A', '#BBF7D0', '#BAE6FD', '#FBCFE8', '#FED7AA', '#DDD6FE', '#A7F3D0', '#FECDD3'];

    function drawAll(logoImg) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, W - 20, H - 20);

      // 1. الترويسة الرسمية
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(14, 14, W - 28, 140);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px IBM Plex Sans Arabic, sans-serif';
      ctx.fillText('الموسم الدراسي: ' + acYear, W - 36, 58);
      ctx.fillText('الفوج / القسم: ' + secName, W - 36, 98);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 19px IBM Plex Sans Arabic, sans-serif';
      ctx.fillText('جمعية أولياء الأطفال المعاقين ذهنيًا', W / 2, 42);
      ctx.fillText('المركز النفسي البيداغوجي دار الإحسان', W / 2, 68);
      ctx.font = 'bold 16px IBM Plex Sans Arabic, sans-serif';
      ctx.fillText('- العطف - غرداية -', W / 2, 92);

      ctx.fillStyle = '#E0F2FE';
      ctx.fillRect(W / 2 - 195, 102, 390, 44);
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2.2;
      ctx.strokeRect(W / 2 - 195, 102, 390, 44);
      ctx.fillStyle = '#0C2D55';
      ctx.font = '900 27px IBM Plex Sans Arabic, sans-serif';
      ctx.fillText('البرنامج الأسبوعي', W / 2, 133);

      if (logoImg) {
        try { ctx.drawImage(logoImg, 38, 24, 108, 108); } catch (e) {}
      }

      var y = 164;

      if (activeDomains.length) {
        var rightLblW = 148;
        var leftTotalW = 126;
        var domAreaW = W - 56 - rightLblW - leftTotalW;
        var dColW = domAreaW / activeDomains.length;

        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(W - 28 - rightLblW, y, rightLblW, 38);
        ctx.fillRect(W - 28 - rightLblW, y + 38, rightLblW, 42);
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(W - 28 - rightLblW, y, rightLblW, 38);
        ctx.strokeRect(W - 28 - rightLblW, y + 38, rightLblW, 42);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 14px IBM Plex Sans Arabic, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('الأنشطة / المجالات', W - 28 - rightLblW / 2, y + 24);
        ctx.fillText('عدد المهارات', W - 28 - rightLblW / 2, y + 64);

        var totalSkills = 0;
        activeDomains.forEach(function (dm, dIdx) {
          var dx = W - 28 - rightLblW - (dIdx + 1) * dColW;
          var colColor = palette[dIdx % palette.length];
          var skCount = dm.skills ? dm.skills.length : 0;
          totalSkills += skCount;

          ctx.fillStyle = colColor;
          ctx.fillRect(dx, y, dColW, 38);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(dx, y + 38, dColW, 42);
          ctx.strokeStyle = '#1E293B';
          ctx.strokeRect(dx, y, dColW, 38);
          ctx.strokeRect(dx, y + 38, dColW, 42);

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 12.5px IBM Plex Sans Arabic, sans-serif';
          ctx.fillText(String(dm.domain || '').slice(0, 30), dx + dColW / 2, y + 24);
          ctx.font = 'bold 15px IBM Plex Sans Arabic, sans-serif';
          ctx.fillText(skCount + ' مهارة', dx + dColW / 2, y + 64);
        });

        ctx.fillStyle = '#D8B4E2';
        ctx.fillRect(28, y, leftTotalW, 38);
        ctx.fillStyle = '#F3E8FF';
        ctx.fillRect(28, y + 38, leftTotalW, 42);
        ctx.strokeStyle = '#1E293B';
        ctx.strokeRect(28, y, leftTotalW, 38);
        ctx.strokeRect(28, y + 38, leftTotalW, 42);
        ctx.fillStyle = '#3B0764';
        ctx.font = 'bold 15px IBM Plex Sans Arabic, sans-serif';
        ctx.fillText('المجموع', 28 + leftTotalW / 2, y + 24);
        ctx.fillText(totalSkills + ' مهارة', 28 + leftTotalW / 2, y + 64);

        y += 92;
      }

      // إطار الفترات + صف التوقيت الواضح تحته مباشرة
      var dayColW = 148;
      var sessColW = W - 56 - dayColW;
      var colW = sessColW / numCols;

      var midBreakIdx = -1;
      for (var bIdx = 1; bIdx < numCols - 1; bIdx++) {
        if (unifiedCols[bIdx].isBreak && (unifiedCols[bIdx].label.indexOf('فسحة') >= 0 || unifiedCols[bIdx].label.indexOf('استراحة') >= 0 || bIdx === Math.floor(numCols / 2))) {
          midBreakIdx = bIdx;
          break;
        }
      }

      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(28 + sessColW, y, dayColW, periodHeaderH);
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(28 + sessColW, y, dayColW, periodHeaderH);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 17px IBM Plex Sans Arabic, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('إطار الفترات', 28 + sessColW + dayColW / 2, y + 30);

      if (midBreakIdx >= 0 && numCols >= 3) {
        var mornCols = midBreakIdx;
        var brkCols = 1;
        var aftCols = numCols - mornCols - brkCols;

        var mornW = mornCols * colW;
        var brkW = brkCols * colW;
        var aftW = aftCols * colW;

        var mornX = 28 + sessColW - mornW;
        var brkX = mornX - brkW;
        var aftX = 28;

        ctx.fillStyle = '#BAE6FD';
        ctx.fillRect(mornX, y, mornW, periodHeaderH);
        ctx.strokeRect(mornX, y, mornW, periodHeaderH);
        ctx.fillStyle = '#0C2D55';
        ctx.font = 'bold 18px IBM Plex Sans Arabic, sans-serif';
        ctx.fillText(' الفترة الصباحية', mornX + mornW / 2, y + 31);

        ctx.fillStyle = '#D8B4E2';
        ctx.fillRect(brkX, y, brkW, periodHeaderH);
        ctx.strokeRect(brkX, y, brkW, periodHeaderH);
        ctx.fillStyle = '#3B0764';
        ctx.font = 'bold 16px IBM Plex Sans Arabic, sans-serif';
        ctx.fillText(' ' + (unifiedCols[midBreakIdx].label || 'فسحة'), brkX + brkW / 2, y + 31);

        ctx.fillStyle = '#DDD6FE';
        ctx.fillRect(aftX, y, aftW, periodHeaderH);
        ctx.strokeRect(aftX, y, aftW, periodHeaderH);
        ctx.fillStyle = '#1E1B4B';
        ctx.font = 'bold 18px IBM Plex Sans Arabic, sans-serif';
        ctx.fillText(' الفترة المسائية', aftX + aftW / 2, y + 31);
      } else if (numCols >= 2) {
        var halfCols = Math.ceil(numCols / 2);
        var mW = halfCols * colW;
        var aW = sessColW - mW;
        var mX = 28 + sessColW - mW;

        ctx.fillStyle = '#BAE6FD';
        ctx.fillRect(mX, y, mW, periodHeaderH);
        ctx.strokeRect(mX, y, mW, periodHeaderH);
        ctx.fillStyle = '#0C2D55';
        ctx.font = 'bold 18px IBM Plex Sans Arabic, sans-serif';
        ctx.fillText(' الفترة الصباحية', mX + mW / 2, y + 31);

        ctx.fillStyle = '#DDD6FE';
        ctx.fillRect(28, y, aW, periodHeaderH);
        ctx.strokeRect(28, y, aW, periodHeaderH);
        ctx.fillStyle = '#1E1B4B';
        ctx.font = 'bold 18px IBM Plex Sans Arabic, sans-serif';
        ctx.fillText(' الفترة المسائية', 28 + aW / 2, y + 31);
      } else {
        ctx.fillStyle = '#BAE6FD';
        ctx.fillRect(28, y, sessColW, periodHeaderH);
        ctx.strokeRect(28, y, sessColW, periodHeaderH);
        ctx.fillStyle = '#0C2D55';
        ctx.font = 'bold 18px IBM Plex Sans Arabic, sans-serif';
        ctx.fillText(' الفترة الصباحية   |    الفترة المسائية', 28 + sessColW / 2, y + 31);
      }

      y += periodHeaderH;

      // صف التوقيت الواضح تحت إطار الفترات مباشرة
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(28 + sessColW, y, dayColW, timeHeaderH);
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(28 + sessColW, y, dayColW, timeHeaderH);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px IBM Plex Sans Arabic, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(' التوقيت الموحد', 28 + sessColW + dayColW / 2, y + 27);
      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 14px IBM Plex Sans Arabic, sans-serif';
      ctx.fillText('الأيام ⬇ / الحصص ⬅', 28 + sessColW + dayColW / 2, y + 52);

      unifiedCols.forEach(function (col, cIdx) {
        var cx = 28 + sessColW - (cIdx + 1) * colW;
        ctx.fillStyle = col.isBreak ? '#F3E8FF' : '#EFF6FF';
        ctx.fillRect(cx, y, colW, timeHeaderH);
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx, y, colW, timeHeaderH);

        ctx.fillStyle = col.isBreak ? '#4C1D95' : '#0C2D55';
        ctx.font = 'bold 14px IBM Plex Sans Arabic, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(col.label.slice(0, 28), cx + colW / 2, y + 22);

        var pillX = cx + 8;
        var pillY = y + 30;
        var pillW = colW - 16;
        var pillH = 31;
        ctx.fillStyle = col.isBreak ? '#FAF5FF' : '#FFFFFF';
        ctx.fillRect(pillX, pillY, pillW, pillH);
        ctx.strokeStyle = col.isBreak ? '#9333EA' : '#0284C7';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(pillX, pillY, pillW, pillH);

        var timeTxt = formatParentTimeRange(col.start, col.end) || 'التوقيت يدوي';
        ctx.fillStyle = col.isBreak ? '#581C87' : '#0F172A';
        ctx.font = '900 15px IBM Plex Sans Arabic, sans-serif';
        ctx.fillText(' ' + timeTxt, cx + colW / 2, pillY + 21);
      });

      y += timeHeaderH;

      WEEK_DAYS_PARENT.forEach(function (wd, idx) {
        var rh = rowHeights[idx];
        ctx.fillStyle = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
        ctx.fillRect(28, y, sessColW, rh);
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(28 + sessColW, y, dayColW, rh);

        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(28, y, sessColW, rh);
        ctx.strokeRect(28 + sessColW, y, dayColW, rh);

        ctx.fillStyle = '#0F172A';
        ctx.font = '900 21px IBM Plex Sans Arabic, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(wd.label, 28 + sessColW + dayColW / 2, y + rh / 2 + 7);

        var dy = Array.isArray(rawSched) ? rawSched.filter(function (d) { return d && (d.day === wd.key || d.label === wd.label || (wd.key === 'mon' && d.label === 'الاثنين')); })[0] : null;
        var sessArr = (dy && dy.sessions) ? dy.sessions : [];

        unifiedCols.forEach(function (col, cIdx) {
          var sx = 28 + sessColW - (cIdx + 1) * colW;
          var sess = sessArr[col.colIndex];

          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1.1;
          ctx.strokeRect(sx, y, colW, rh);

          if (!sess || !isParentSessionActive(sess)) {
            ctx.fillStyle = '#94A3B8';
            ctx.font = 'bold 16px IBM Plex Sans Arabic, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('—', sx + colW / 2, y + rh / 2 + 6);
            return;
          }

          var isBrk = sess.kind === 'break' || col.isBreak;
          ctx.fillStyle = isBrk ? '#F3E8FF' : '#FFFFFF';
          ctx.fillRect(sx + 2, y + 2, colW - 4, rh - 4);

          var customTime = '';
          if ((sess.start && sess.start !== col.start) || (sess.end && sess.end !== col.end)) {
            customTime = formatParentShortTime(sess.start, sess.end);
          }

          var iy = y + 10;
          if (sess.title && (!isBrk || (sess.items && sess.items.length))) {
            ctx.fillStyle = isBrk ? '#D8B4E2' : '#E0F2FE';
            ctx.fillRect(sx + 5, iy, colW - 10, 24);
            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 12.5px IBM Plex Sans Arabic, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText((sess.title + (customTime ? (' (' + customTime + ')') : '')).slice(0, 34), sx + colW / 2, iy + 17);
            iy += 28;
          }

          if (isBrk && (!sess.items || !sess.items.length)) {
            ctx.fillStyle = '#4C1D95';
            ctx.font = 'bold 17px IBM Plex Sans Arabic, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(sess.title || col.label || 'فسحة', sx + colW / 2, y + rh / 2 + 7);
          } else {
            (sess.items || []).forEach(function (it) {
              var domIdx = Math.max(0, PARENT_DOMAIN_KEYS.indexOf(it.domain)) % palette.length;
              var boxH = 48;
              ctx.fillStyle = palette[domIdx];
              ctx.fillRect(sx + 6, iy, colW - 12, boxH);
              ctx.strokeStyle = '#475569';
              ctx.lineWidth = 0.9;
              ctx.strokeRect(sx + 6, iy, colW - 12, boxH);

              ctx.textAlign = 'right';
              ctx.fillStyle = '#0C2D55';
              ctx.font = 'bold 11.5px IBM Plex Sans Arabic, sans-serif';
              ctx.fillText((' ' + (it.domain || '')).slice(0, 38), sx + colW - 10, iy + 16);

              ctx.fillStyle = '#0F172A';
              ctx.font = 'bold 12px IBM Plex Sans Arabic, sans-serif';
              var skillLines = wrapParentCanvasLines(ctx, ' ' + (it.skill || ''), colW - 22);
              ctx.fillText((skillLines[0] || '').slice(0, 44), sx + colW - 10, iy + 32);
              if (skillLines[1]) {
                ctx.font = 'bold 11px IBM Plex Sans Arabic, sans-serif';
                ctx.fillText(skillLines[1].slice(0, 44), sx + colW - 10, iy + 44);
              }
              iy += boxH + 5;
            });
          }
        });

        y += rh;
      });

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 19px IBM Plex Sans Arabic, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('توقيع المربية', W - 200, y + 48);
      ctx.fillText('المشرف البيداغوجي', W / 2, y + 48);
      ctx.fillText('توقيع وختم المدير', 200, y + 48);

      cb(canvas.toDataURL('image/png'), secName);
    }

    var im = new Image();
    im.onload = function () { drawAll(im); };
    im.onerror = function () { drawAll(null); };
    im.src = 'logo-sq.png';
  }

  function openParentProgramImageViewer(p) {
    var imgEl = h('img', { class: 'wk-zoom-img', alt: 'البرنامج الأسبوعي' });
    var zoomContainer = h('div', { class: 'wk-zoom-container' }, imgEl);
    var currentDataUrl = '';
    var currentSecName = 'القسم';
    var zoomed = false;

    buildParentProgramCanvasDataUrl(p, function (dataUrl, sName) {
      currentDataUrl = dataUrl;
      currentSecName = sName;
      imgEl.src = dataUrl;
    });

    imgEl.addEventListener('click', function () {
      zoomed = !zoomed;
      imgEl.className = zoomed ? 'wk-zoom-img is-zoomed' : 'wk-zoom-img';
    });

    openModal(h('div', { class: 'modal-body wk-modal-print' },
      h('div', { class: 'bar-sub no-print' },
        h('h2', { text: ' صورة البرنامج الأسبوعي الكاملة' }),
        h('div', { class: 'row-actions' },
          h('button', {
            type: 'button',
            class: 'btn small light',
            text: ' تكبير / تصغير الصورة',
            onclick: function () {
              zoomed = !zoomed;
              imgEl.className = zoomed ? 'wk-zoom-img is-zoomed' : 'wk-zoom-img';
            }
          })
        )
      ),
      h('p', { class: 'muted small no-print', text: 'اضغط على الصورة لتكبيرها وتحريكها يمينًا ويسارًا، أو حمّلها على هاتفك:' }),
      zoomContainer,
      h('div', { class: 'modal-actions no-print' },
        h('button', { class: 'btn light', type: 'button', text: 'إغلاق', onclick: closeModal }),
        h('button', {
          class: 'btn gold',
          type: 'button',
          text: ' تحميل صورة البرنامج (PNG)',
          onclick: function () {
            if (!currentDataUrl) return;
            var a = document.createElement('a');
            a.download = 'البرنامج_الأسبوعي_' + String(currentSecName).replace(/\s+/g, '_') + '.png';
            a.href = currentDataUrl;
            a.click();
          }
        }),
        h('button', { class: 'btn', type: 'button', text: ' طباعة', onclick: function () { window.print(); } })
      )
    ));
  }

  function renderParentWeeklySheet(p) {
    var rawSched = null;
    if (p && p.schedule) {
      try {
        rawSched = typeof p.schedule === 'string' ? JSON.parse(p.schedule) : p.schedule;
      } catch (e) { rawSched = null; }
    }
    var secName = resolveSectionName(p, rawSched);
    var acYear = (p && p.academic_year) || (Array.isArray(rawSched) && rawSched[0] && rawSched[0].academic_year) || '2026/2027';

    var imgEl = h('img', {
      class: 'wk-program-img',
      alt: 'صورة البرنامج الأسبوعي — ' + secName,
      title: 'اضغط لفتح وتكبير صورة البرنامج الأسبوعي',
      onclick: function () { openParentProgramImageViewer(p); }
    });

    var currentDataUrl = '';
    buildParentProgramCanvasDataUrl(p, function (dataUrl) {
      currentDataUrl = dataUrl;
      imgEl.src = dataUrl;
    });

    var openBtn = h('button', {
      type: 'button',
      class: 'btn small gold',
      text: ' فتح وتكبير صورة البرنامج كاملة',
      onclick: function () { openParentProgramImageViewer(p); }
    });

    var dlBtn = h('button', {
      type: 'button',
      class: 'btn small light',
      text: ' حفظ الصورة في الهاتف',
      onclick: function () {
        if (!currentDataUrl) return;
        var a = document.createElement('a');
        a.download = 'البرنامج_الأسبوعي_' + String(secName).replace(/\s+/g, '_') + '.png';
        a.href = currentDataUrl;
        a.click();
      }
    });

    return h('div', { class: 'card wk-parent-card' },
      h('div', { class: 'bar-sub' },
        h('div', null,
          h('h2', { text: ' البرنامج الأسبوعي — ' + secName }),
          h('span', { class: 'muted small', text: 'الموسم الدراسي: ' + acYear + ' — اضغط على الصورة لتكبيرها ورؤية كل البرنامج بوضوح' })
        ),
        h('div', { class: 'row-actions no-print' }, openBtn, dlBtn)
      ),
      h('div', { class: 'wk-img-card-wrap' }, imgEl)
    );
  }

  function getBuiltInTamhinDemo(secId, secName) {
    var cleanDomains = [
      { domain: 'مجال الاستقلالية (الحياة اليومية والعناية بالذات)', skills: ['غسل اليدين بالماء والصابون بشكل صحيح', 'لبس المئزر بشكل صحيح', 'مسك أدوات الطعام بشكل صحيح'] },
      { domain: 'مجال المهارات الحركية الدقيقة', skills: ['مسك المقص بشكل صحيح', 'قص الورقة على خطوط مستقيمة عريضة', 'ترتيب مجموعة من الأوراق فوق بعضها'] },
      { domain: 'مجال المهارات الحركية الكبرى', skills: ['المشي بطريقة صحيحة', 'دفع جهاز متحرك لمسافة 2 م بطريقة صحيحة'] },
      { domain: 'مجال مهارات الحضور والانتباه', skills: ['الاتصال البصري أثناء التعليم الجماعي', 'الاستجابة للتعليمات اللفظية (أمران متسلسلان)'] },
      { domain: 'مجال التواصل', skills: ['يسمي الأشياء المألوفة في البيئة', 'يستجيب للأوامر المتسلسلة (أكثر من أمر)'] }
    ];
    var notesTxt = 'برنامج أسبوعي معتمد لقسم التمهين (مركز المساعدة على العمل) — يشمل الفترات الصباحية والمسائية والحصص البينية.';
    var days = [
      { day: 'sun', label: 'الأحد', sessions: [
        { kind: 'break', title: 'الاعتماد على الذات', start: '08:00', end: '09:00', items: [{ domain: 'مجال الاستقلالية (الحياة اليومية والعناية بالذات)', skill: 'لبس المئزر بشكل صحيح' }] },
        { kind: 'session', title: 'ورشة التأهيل المهني الأولي', start: '09:00', end: '10:30', items: [{ domain: 'مجال المهارات الحركية الدقيقة', skill: 'مسك المقص بشكل صحيح' }, { domain: 'مجال مهارات الحضور والانتباه', skill: 'الاتصال البصري أثناء التعليم الجماعي' }] },
        { kind: 'break', title: 'فسحة', start: '10:30', end: '11:00', items: [] },
        { kind: 'session', title: 'تنمية المهارات العملية', start: '12:00', end: '13:40', items: [{ domain: 'مجال التواصل', skill: 'يستجيب للأوامر المتسلسلة (أكثر من أمر)' }] },
        { kind: 'break', title: 'التحضير للخروج', start: '13:40', end: '14:00', items: [] }
      ]},
      { day: 'mon', label: 'الإثنين', sessions: [
        { kind: 'break', title: 'الاعتماد على الذات', start: '08:00', end: '09:00', items: [{ domain: 'مجال الاستقلالية (الحياة اليومية والعناية بالذات)', skill: 'غسل اليدين بالماء والصابون بشكل صحيح' }] },
        { kind: 'session', title: 'نشاط الفرز والترتيب المهني', start: '09:00', end: '10:30', items: [{ domain: 'مجال المهارات الحركية الدقيقة', skill: 'ترتيب مجموعة من الأوراق فوق بعضها' }] },
        { kind: 'break', title: 'فسحة', start: '10:30', end: '11:00', items: [] },
        { kind: 'session', title: 'ورشة القص والتشكيل', start: '12:00', end: '13:40', items: [{ domain: 'مجال المهارات الحركية الدقيقة', skill: 'قص الورقة على خطوط مستقيمة عريضة' }] },
        { kind: 'break', title: 'التحضير للخروج', start: '13:40', end: '14:00', items: [] }
      ]},
      { day: 'tue', label: 'الثلاثاء', sessions: [
        { kind: 'break', title: 'الاعتماد على الذات', start: '08:00', end: '09:00', items: [] },
        { kind: 'session', title: 'رياضة وتوافق حركي مهني', start: '09:00', end: '10:30', items: [{ domain: 'مجال المهارات الحركية الكبرى', skill: 'دفع جهاز متحرك لمسافة 2 م بطريقة صحيحة' }] },
        { kind: 'break', title: 'فسحة', start: '10:30', end: '11:00', items: [] },
        { kind: 'session', title: 'تواصل وتفاعل اجتماعي بالورشة', start: '12:00', end: '13:40', items: [{ domain: 'مجال التواصل', skill: 'يسمي الأشياء المألوفة في البيئة' }] },
        { kind: 'break', title: 'التحضير للخروج', start: '13:40', end: '14:00', items: [] }
      ]},
      { day: 'wed', label: 'الأربعاء', sessions: [
        { kind: 'break', title: 'الاعتماد على الذات', start: '08:00', end: '09:00', items: [] },
        { kind: 'session', title: 'ورشة التمهين التطبيقي', start: '09:00', end: '10:30', items: [{ domain: 'مجال مهارات الحضور والانتباه', skill: 'الاستجابة للتعليمات اللفظية (أمران متسلسلان)' }, { domain: 'مجال المهارات الحركية الدقيقة', skill: 'مسك المقص بشكل صحيح' }] },
        { kind: 'break', title: 'فسحة', start: '10:30', end: '11:00', items: [] },
        { kind: 'session', title: 'استقلالية الحياة اليومية', start: '12:00', end: '13:40', items: [{ domain: 'مجال الاستقلالية (الحياة اليومية والعناية بالذات)', skill: 'مسك أدوات الطعام بشكل صحيح' }] },
        { kind: 'break', title: 'التحضير للخروج', start: '13:40', end: '14:00', items: [] }
      ]},
      { day: 'thu', label: 'الخميس', sessions: [
        { kind: 'break', title: 'الاعتماد على الذات', start: '08:00', end: '09:00', items: [] },
        { kind: 'session', title: 'تقييم أسبوعي للمهارات المهنية', start: '09:00', end: '10:30', items: [{ domain: 'مجال المهارات الحركية الدقيقة', skill: 'ترتيب مجموعة من الأوراق فوق بعضها' }, { domain: 'مجال التواصل', skill: 'يستجيب للأوامر المتسلسلة (أكثر من أمر)' }] },
        { kind: 'break', title: 'فسحة', start: '10:30', end: '11:00', items: [] },
        { kind: 'session', title: 'أنشطة جماعية ومراجعة', start: '12:00', end: '13:40', items: [{ domain: 'مجال المهارات الحركية الكبرى', skill: 'المشي بطريقة صحيحة' }] },
        { kind: 'break', title: 'التحضير للخروج', start: '13:40', end: '14:00', items: [] }
      ]}
    ];
    return {
      id: 'demo-tamhin',
      section_id: secId || '',
      title: 'البرنامج الأسبوعي — ' + (secName || 'التمهين م م ع'),
      academic_year: '2026/2027',
      published_at: new Date().toISOString(),
      schedule: days.map(function (dy) {
        return {
          day: dy.day,
          label: dy.label,
          section_name: secName || 'التمهين م م ع',
          academic_year: '2026/2027',
          notes: notesTxt,
          domains: cleanDomains,
          sessions: dy.sessions
        };
      })
    };
  }

  function vPrograms(v) {
    v.appendChild(h('div', { class: 'bar-sub' }, h('h2', { text: t('tabPrograms') })));
    var progList = (S.d && S.d.programs ? S.d.programs.slice() : []);
    if (!progList.length) {
      var kids = (S.d && S.d.children) || [];
      var tamhinKid = kids.filter(function (c) {
        return (c.section && c.section.indexOf('التمهين') >= 0) || c.center === 'work';
      })[0];
      if (tamhinKid) {
        progList.push(getBuiltInTamhinDemo(tamhinKid.section_id, tamhinKid.section || 'التمهين م م ع'));
      }
    }
    if (!progList.length) return v.appendChild(empty(t('emptyPrograms')));

    progList.forEach(function (p) {
      v.appendChild(renderParentWeeklySheet(p));
    });
  }

  /* تبويب استمارات التقييم البيداغوجي والتقارير التربوية — مفصولتان تماماً */
  var EVAL_MARKER = '/*DE_EVAL_V1*/';

  function isEvalReport(r) {
    if (!r) return false;
    return (typeof r.activities === 'string' && r.activities.indexOf(EVAL_MARKER) === 0)
      || (typeof r.title === 'string' && (r.title.indexOf('استمارة تقييم') >= 0 || r.title.indexOf('تقرير اللجنة البيداغوجية') >= 0));
  }

  function parseParentEvaluationReport(r) {
    var domainKeys = Object.keys(EMBEDDED_CURRICULUM);
    var res = {
      id: r ? r.id : null,
      title: (r && r.title) || 'تقرير اللجنة البيداغوجية والتربوية — استمارة التقييم',
      report_date: (r && r.report_date) || new Date().toISOString().slice(0, 10),
      term: 'الثلاثي الأخير',
      school_year: '2024/2025',
      degree_of_disability: 'متوسطة',
      qualification_level: '',
      supervisors: [
        { name: 'أمير زكرياء', role: 'مدير المركز' }
      ],
      general_report: '',
      abilities: {
        current_potentials: '',
        cognitive_intellectual: '',
        language_receptive_expressive: '',
        communication_behavioral: '',
        academic_preacademic: '',
        motor_independence: ''
      },
      strengths: [''],
      weaknesses: [''],
      recommendations: [''],
      domains: []
    };

    if (r && typeof r.activities === 'string' && r.activities.indexOf(EVAL_MARKER) === 0) {
      try {
        var rawJson = JSON.parse(r.activities.slice(EVAL_MARKER.length));
        if (rawJson && typeof rawJson === 'object') {
          if (rawJson.term) res.term = rawJson.term;
          if (rawJson.school_year) res.school_year = rawJson.school_year;
          if (rawJson.degree_of_disability) res.degree_of_disability = rawJson.degree_of_disability;
          if (rawJson.qualification_level) res.qualification_level = rawJson.qualification_level;
          if (Array.isArray(rawJson.supervisors) && rawJson.supervisors.length) res.supervisors = rawJson.supervisors;
          if (rawJson.general_report) res.general_report = rawJson.general_report;
          if (rawJson.abilities) res.abilities = Object.assign({}, res.abilities, rawJson.abilities);
          if (Array.isArray(rawJson.strengths) && rawJson.strengths.length) res.strengths = rawJson.strengths;
          if (Array.isArray(rawJson.weaknesses) && rawJson.weaknesses.length) res.weaknesses = rawJson.weaknesses;
          if (Array.isArray(rawJson.recommendations) && rawJson.recommendations.length) res.recommendations = rawJson.recommendations;

          if (Array.isArray(rawJson.domains)) {
            res.domains = rawJson.domains.map(function (dm) {
              var domName = typeof dm.d === 'number' ? (domainKeys[dm.d] || domainKeys[0]) : (dm.domain || domainKeys[0]);
              var skList = EMBEDDED_CURRICULUM[domName] || [];
              var ratingsMap = {};
              if (Array.isArray(dm.r)) {
                dm.r.forEach(function (entry) {
                  ratingsMap[entry[0]] = { score: entry[1] != null ? String(entry[1]) : '', yn: entry[2] || '', note: entry[3] || '' };
                });
              } else if (dm.ratings && typeof dm.ratings === 'object') {
                ratingsMap = dm.ratings;
              }
              return {
                domain: domName,
                ratings: skList.map(function (sk, idx) {
                  var sv = ratingsMap[idx] || ratingsMap[sk] || {};
                  return { num: idx + 1, skill: sk, item: sk, score: sv.score != null ? String(sv.score) : '', yn: sv.yn || '', note: sv.note || '' };
                })
              };
            });
          }
        }
      } catch (e) {}
    }

    if (!res.general_report && r && r.notes) {
      res.general_report = r.notes;
    }
    if (!res.domains.length) {
      var dKeys = Object.keys(EMBEDDED_CURRICULUM);
      dKeys.slice(0, 3).forEach(function (dk) {
        var skList = EMBEDDED_CURRICULUM[dk] || [];
        res.domains.push({
          domain: dk,
          ratings: skList.map(function (sk, idx) {
            return { num: idx + 1, skill: sk, item: sk, score: '', yn: '', note: '' };
          })
        });
      });
    }
    return res;
  }

  /* ورقة كشف التقييم الرسمية في فضاء الأولياء (مطابقة للصورة الرسمية 53020.jpg) */
  function renderParentOfficialEvaluationSheet(r, childFullName, secName, kd) {
    var ev = parseParentEvaluationReport(r);

    var ageTxt = '—';
    if (kd && kd.dob) {
      try {
        var birthDate = new Date(kd.dob);
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        if (age > 0) ageTxt = age + ' سنة';
      } catch (e) {}
    }

    var logoImg = h('img', { class: 'oep-logo-side', alt: 'شعار دار الإحسان' });
    logoImg.setAttribute('src', 'logo-sq.png');

    var header = h('div', { class: 'oep-header' },
      h('div', { class: 'oep-title-block' },
        h('h3', { class: 'oep-org-name', text: 'جمعية أولياء الأطفال المعاقين ذهنيًا' }),
        h('h4', { class: 'oep-center-name', text: 'المركز النفسي البيداغوجي دار الإحسان' }),
        h('p', { class: 'oep-location', text: '— العطف - غرداية —' }),
        h('div', { class: 'oep-fr-title', text: "COMPTE RENDU DE L'EQUIPE PEDAGOGIQUE" }),
        h('h2', { class: 'oep-report-heading', text: 'تقرير اللجنة البيداغوجية والتربوية' })
      ),
      logoImg
    );

    var termBanner = h('div', { class: 'oep-term-banner', text: 'تقييم ' + (ev.term || 'الثلاثي الأخير') + ' للموسم الدراسي: ' + (ev.school_year || '2024/2025') });

    var infoTable = h('table', { class: 'oep-info-table' },
      h('tbody', null,
        h('tr', null,
          h('td', { class: 'oep-info-label', text: 'اسم ولقب الحالة:' }),
          h('td', { class: 'oep-info-val' }, h('strong', { text: childFullName || '—' })),
          h('td', { class: 'oep-info-label', text: 'العمر:' }),
          h('td', { class: 'oep-info-val', text: ageTxt })
        ),
        h('tr', null,
          h('td', { class: 'oep-info-label', text: 'نوع الاضطراب:' }),
          h('td', { class: 'oep-info-val', text: (kd && kd.disability) || '—' }),
          h('td', { class: 'oep-info-label', text: 'تاريخ الميلاد:' }),
          h('td', { class: 'oep-info-val', text: (kd && kd.dob) ? fmtDate(kd.dob) : '—' })
        ),
        h('tr', null,
          h('td', { class: 'oep-info-label', text: 'درجة الإعاقة / الاضطراب:' }),
          h('td', { class: 'oep-info-val', text: ev.degree_of_disability || 'متوسطة' }),
          h('td', { class: 'oep-info-label', text: 'القسم ومستوى التأهيل:' }),
          h('td', { class: 'oep-info-val', text: ev.qualification_level || secName || '—' })
        )
      )
    );

    // جدول المشرفين بدون رموز QR
    var supRows = (ev.supervisors && ev.supervisors.length ? ev.supervisors : [{ name: 'أمير زكرياء', role: 'مدير المركز' }]).map(function (sp) {
      return h('tr', null,
        h('td', null, h('strong', { text: sp.name || '—' })),
        h('td', { text: sp.role || '—' }),
        h('td', null, h('span', { class: 'muted small', text: '........................' }))
      );
    });

    var supervisorsTable = h('table', { class: 'oep-supervisors-table' },
      h('thead', null,
        h('tr', null,
          h('th', { text: 'المشرفون: الإسم واللقب' }),
          h('th', { text: 'الوظيفة' }),
          h('th', { text: 'التوقيع والختم' })
        )
      ),
      h('tbody', null, supRows)
    );

    var perfBanner = h('div', { class: 'oep-section-banner', text: 'الوصف العام لأداء الحالة' });

    var generalReportCol = h('div', { class: 'oep-general-report-box' },
      h('div', { class: 'oep-gr-header', text: 'التقرير العام' }),
      h('div', { class: 'oep-gr-body', text: ev.general_report || 'تم تسجيل تقدم ملحوظ في الأداء العام للحالة مع مواصلة التأهيل التربوي والنفسي.' })
    );

    var ab = ev.abilities || {};
    var abilityBoxes = [
      { title: 'إمكانيات والقدرات الحالية', val: ab.current_potentials, cls: 'oep-ab-hdr-1' },
      { title: 'المهارات المعرفية والفكرية', val: ab.cognitive_intellectual, cls: 'oep-ab-hdr-2' },
      { title: 'اللغة (استقبالية تعبيرية)', val: ab.language_receptive_expressive, cls: 'oep-ab-hdr-3' },
      { title: 'القدرات الإتصالية والسلوكية', val: ab.communication_behavioral, cls: 'oep-ab-hdr-4' },
      { title: 'المعارف الأكاديمية وما قبل الأكاديمي', val: ab.academic_preacademic, cls: 'oep-ab-hdr-5' },
      { title: 'القدرات الحركية والاستقلالية', val: ab.motor_independence, cls: 'oep-ab-hdr-6' }
    ].map(function (item) {
      return h('div', { class: 'oep-ability-box' },
        h('div', { class: 'oep-ab-hdr ' + item.cls, text: item.title }),
        h('div', { class: 'oep-ab-content', text: item.val || '—' })
      );
    });

    var abilitiesCol = h('div', { class: 'oep-abilities-stack' }, abilityBoxes);
    var perfGrid = h('div', { class: 'oep-performance-grid' }, generalReportCol, abilitiesCol);

    var summaryBanner = h('div', { class: 'oep-summary-banner', text: 'الخلاصة والتوصيات' });

    function renderListItems(arr, fallback) {
      var items = (arr || []).filter(function (x) { return x && x.trim(); });
      if (!items.length) items = [fallback];
      var ul = h('ul', { class: 'oep-rec-list' });
      items.forEach(function (txt) { ul.appendChild(h('li', { text: txt })); });
      return ul;
    }

    var recGrid = h('div', { class: 'oep-recommendations-grid' },
      h('div', { class: 'oep-rec-col' },
        h('div', { class: 'oep-rec-title', text: '1. نقاط القوة' }),
        renderListItems(ev.strengths, 'استجابة وتفاعل إيجابي مع الأنشطة الموجهة.')
      ),
      h('div', { class: 'oep-rec-col' },
        h('div', { class: 'oep-rec-title', text: '2. نقاط الضعف' }),
        renderListItems(ev.weaknesses, 'الحاجة لتعزيز مهارات التركيز والاستقلالية.')
      ),
      h('div', { class: 'oep-rec-col' },
        h('div', { class: 'oep-rec-title', text: '3. التوصيات' }),
        renderListItems(ev.recommendations, 'مواصلة المتابعة البيداغوجية والتنسيق المستمر مع الأسرة.')
      )
    );

    // حساب النقاط والنتائج المكتسبة لكل مجال والنتيجة الإجمالية لكافة المجالات
    var totalEarnedPoints = 0;
    var totalMaxPoints = 0;
    var totalRatedSkills = 0;

    var domainRows = (ev.domains || []).map(function (dm) {
      var dEarned = 0;
      var dMax = 0;
      var dCount = (dm.ratings || []).length;
      (dm.ratings || []).forEach(function (it) {
        var sc = 0;
        if (it.score !== '' && it.score != null) {
          var parsedSc = parseInt(it.score, 10);
          if (!isNaN(parsedSc)) sc = parsedSc;
        } else if (it.yn) {
          if (it.yn === 'نعم') sc = 5;
        }
        // المهارة غير المقيمة تأخذ درجة صفر تلقائياً
        dEarned += sc;
        dMax += 5;
      });
      totalEarnedPoints += dEarned;
      totalMaxPoints += dMax;
      totalRatedSkills += dCount;
      var dPct = dMax > 0 ? Math.round((dEarned / dMax) * 100) : 0;
      return h('tr', null,
        h('td', null, h('strong', { text: dm.domain })),
        h('td', { text: dCount + ' مهارة' }),
        h('td', null, h('span', { class: 'badge ' + (dEarned > 0 ? 'ok' : 'gray'), text: dEarned + ' نقطة' })),
        h('td', { text: dMax + ' نقطة' }),
        h('td', null, h('strong', { text: dPct + '%' }))
      );
    });

    var overallPct = totalMaxPoints > 0 ? ((totalEarnedPoints / totalMaxPoints) * 100).toFixed(1) : '0';

    var scorecardTable = h('table', { class: 'oep-scorecard-table' },
      h('thead', null,
        h('tr', null,
          h('th', { text: 'المجال التربوي / البيداغوجي' }),
          h('th', { text: 'المهارات المقيمة' }),
          h('th', { text: 'النقاط المحصلة' }),
          h('th', { text: 'المجموع الأقصى' }),
          h('th', { text: 'النسبة المئوية' })
        )
      ),
      h('tbody', null,
        domainRows,
        h('tr', { class: 'total-row' },
          h('td', null, h('strong', { text: 'النتيجة الإجمالية لكافة المجالات التربوية المختارة' })),
          h('td', { text: totalRatedSkills + ' مهارة' }),
          h('td', null, h('strong', { text: totalEarnedPoints + ' نقطة' })),
          h('td', null, h('strong', { text: totalMaxPoints + ' نقطة' })),
          h('td', null, h('strong', { text: overallPct + '%' }))
        )
      )
    );

    var overallBanner = h('div', { class: 'oep-overall-score-banner' },
      h('span', { text: 'النتيجة الإجمالية لكافة المجالات المختارة:' }),
      h('span', { class: 'oep-score-highlight', text: totalEarnedPoints + ' من ' + totalMaxPoints + ' نقطة (' + overallPct + '%)' })
    );

    var skillsSectionBanner = h('div', { class: 'oep-section-banner', style: 'background-color:#E0E7FF; color:#1E1B4B; margin-top:12px;', text: 'كشف درجات التقييم والنتائج الإجمالية' });

    // 8. إظهار كافة الجداول التفصيلية للمهارات لكل مجال بيداغوجي مختار مع أسماء المهارات والدرجة صفر لمن لم تقيّم
    var allDomainDetailTables = (ev.domains || []).map(function (dm, dIdx) {
      var dEarned = 0;
      var dMax = 0;
      var skillRows = (dm.ratings || []).map(function (it, sIdx) {
        var skillName = it.skill || it.item || (EMBEDDED_CURRICULUM[dm.domain] && EMBEDDED_CURRICULUM[dm.domain][sIdx]) || ('مهارة ' + (sIdx + 1));
        var sc = 0;
        var isRated = false;
        if (it.score !== '' && it.score != null) {
          var parsedSc = parseInt(it.score, 10);
          if (!isNaN(parsedSc)) {
            sc = parsedSc;
            isRated = true;
          }
        } else if (it.yn) {
          if (it.yn === 'نعم') sc = 5;
          else sc = 0;
          isRated = true;
        }
        dEarned += sc;
        dMax += 5;
        // المهارة التي لم تقيَّم توضع لها درجة صفر
        var scVal = isRated ? (it.yn ? it.yn : (sc + ' / 5')) : '0 / 5';

        return h('tr', null,
          h('td', { style: 'text-align:center;', text: String(sIdx + 1) }),
          h('td', null, h('strong', { text: skillName })),
          h('td', { style: 'text-align:center;' }, h('span', { class: 'badge ' + (sc > 0 ? 'ok' : 'gray'), text: scVal })),
          h('td', { class: 'muted small', text: it.note || it.obs || (isRated ? 'مقيَّمة' : 'لم تقيَّم (درجة صفر)') })
        );
      });
      var dPct = dMax > 0 ? Math.round((dEarned / dMax) * 100) : 0;

      return h('div', { class: 'eval-domain-table-wrap', style: 'margin-top:16px;' },
        h('div', { class: 'oep-gr-header', style: 'display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#EEF2FF;color:#312E81;border:1px solid #C7D2FE;' },
          h('strong', { text: (dIdx + 1) + '. ' + dm.domain + ' (' + (dm.ratings ? dm.ratings.length : 0) + ' مهارة)' }),
          h('span', { class: 'badge gold', text: 'النقاط: ' + dEarned + ' / ' + dMax + ' (' + dPct + '%)' })
        ),
        h('table', { class: 'oep-scorecard-table', style: 'margin-top:0;width:100%;' },
          h('thead', null,
            h('tr', null,
              h('th', { style: 'width:45px;text-align:center;', text: '#' }),
              h('th', { text: 'المهارة المقيمة' }),
              h('th', { style: 'width:130px;text-align:center;', text: 'التقييم / النتيجة' }),
              h('th', { text: 'الملاحظات والتوجيهات' })
            )
          ),
          h('tbody', null, skillRows.length ? skillRows : h('tr', null, h('td', { colspan: 4, class: 'muted', style: 'text-align:center;', text: 'لا توجد مهارات مسجلة في هذا المجال.' })))
        )
      );
    });

    var detailedSkillsSection = h('div', { class: 'eval-detailed-skills-box', style: 'margin-top:20px;' },
      h('div', { class: 'oep-section-banner', style: 'background-color:#E0E7FF; color:#1E1B4B; margin:16px 0 8px;' }, 'الجداول التفصيلية لكافة المهارات المقيمة في المجالات التربوية'),
      allDomainDetailTables
    );

    var topActionsBar = h('div', { class: 'oep-action-bar no-print', style: 'display:flex;justify-content:flex-end;gap:10px;margin-bottom:16px;padding:10px 14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;' },
      h('button', {
        type: 'button',
        class: 'btn gold',
        onclick: async function () {
          try {
            toast('جارٍ تجهيز وتحميل الاستمارة بصيغة PDF...', 'ok');
            var pdfBytes = await DE_PDF.renderEvaluationToPdf(r, childFullName, secName, kd);
            DE_PDF.downloadPdf(pdfBytes, 'استمارة_تقييم_' + (childFullName || 'طفلك').replace(/\s+/g, '_') + '.pdf');
            toast('تم تنزيل ملف PDF بنجاح!', 'ok');
          } catch (e) {
            toast('تعذر تنزيل PDF: ' + e.message, 'bad');
          }
        }
      }, icon('i-download'), h('span', { text: 'تحميل الاستمارة بصيغة PDF' })),
      h('button', {
        type: 'button',
        class: 'btn',
        onclick: function () { window.print(); }
      }, icon('i-print'), h('span', { text: 'طباعة الورقة الرسمية (A4)' }))
    );

    var compactSkillsBox = h('div', { class: 'eval-compact-box' },
      skillsSectionBanner,
      scorecardTable,
      overallBanner
    );

    return h('div', { class: 'official-eval-paper' },
      topActionsBar,
      header,
      termBanner,
      infoTable,
      supervisorsTable,
      perfBanner,
      perfGrid,
      summaryBanner,
      recGrid,
      compactSkillsBox,
      detailedSkillsSection
    );
  }

  /* تبويب استمارات التقييم (Evaluations Tab — مفصول تماماً وبطريقة عرض أنيقة) */
  function vEvaluations(v) {

    var topRow = h('div', { class: 'bar-sub' },
      h('h2', { text: 'استمارات التقييم البيداغوجي المعتمدة' })
    );
    v.appendChild(topRow);

    var evals = (S.d && S.d.reports || []).filter(isEvalReport);

    if (!evals.length) {
      return v.appendChild(empty('لا توجد استمارات تقييم معتمدة مسجلة لطفلك حالياً.'));
    }

    var kid = (S.d && S.d.children && S.d.children[0]) || null;
    var childFullName = kid ? kid.full_name : 'الطفل';
    var secName = kid ? (kid.section || '') : '';

    evals.forEach(function (e) {
      var isNew = localStorage.getItem('de_seen_ev_' + e.id) !== '1';

      var card = h('div', { class: 'pm-list-item-card' },
        h('div', { class: 'pm-lic-right' },
          h('div', { class: 'pm-lic-icon-box gold' }, icon('i-eval')),
          h('div', { class: 'pm-lic-info' },
            h('h3', { class: 'pm-lic-title', text: e.title }),
            h('div', { class: 'pm-lic-meta' },
              h('span', { text: 'تاريخ التقييم: ' + fmtDate(e.report_date) }),
              h('span', { class: 'badge gold', text: 'معتمدة ورسمية' }),
              isNew ? h('span', { class: 'badge ok', text: 'جديد' }) : null
            )
          )
        ),
        h('div', { class: 'pm-lic-actions' },
          h('button', {
            type: 'button',
            class: 'btn-pm-primary',
            text: 'التفاصيل',
            onclick: function () {
              localStorage.setItem('de_seen_ev_' + e.id, '1');
              updateNotifBadge();
              openModal(h('div', { class: 'modal-body wk-modal-print' },
                renderParentOfficialEvaluationSheet(e, childFullName, secName, kid),
                h('div', { class: 'modal-actions no-print' },
                  h('button', { class: 'btn light', type: 'button', text: 'إغلاق', onclick: closeModal }),
                  h('button', { class: 'btn gold', type: 'button', text: 'طباعة / حفظ PDF', onclick: function () { window.print(); } })
                )
              ));
            }
          }),
          h('button', {
            type: 'button',
            class: 'btn-pm-gold',
            text: 'تحميل / طباعة',
            onclick: function () {
              localStorage.setItem('de_seen_ev_' + e.id, '1');
              updateNotifBadge();
              openModal(h('div', { class: 'modal-body wk-modal-print' },
                renderParentOfficialEvaluationSheet(e, childFullName, secName, kid),
                h('div', { class: 'modal-actions no-print' },
                  h('button', { class: 'btn light', type: 'button', text: 'إغلاق', onclick: closeModal }),
                  h('button', { class: 'btn gold', type: 'button', text: 'طباعة الورقة الرسمية', onclick: function () { window.print(); } })
                )
              ));
              setTimeout(function () { window.print(); }, 200);
            }
          })
        )
      );

      v.appendChild(card);
    });
  }

  /* تبويب التقارير التربوية الدورية (Reports Tab — مفصول تماماً مع زر تحميل المرفقات) */
  function vReports(v) {

    var topRow = h('div', { class: 'bar-sub' },
      h('h2', { text: 'التقارير التربوية الدورية ومتابعة التطور' })
    );
    v.appendChild(topRow);

    var stdReports = (S.d && S.d.reports || []).filter(function (r) { return !isEvalReport(r); });

    if (!stdReports.length) {
      return v.appendChild(empty('لا توجد تقارير دورية مسجلة لطفلك حالياً.'));
    }

    stdReports.forEach(function (r) {
      var isNew = localStorage.getItem('de_seen_rep_' + r.id) !== '1';

      var card = h('div', { class: 'pm-list-item-card' },
        h('div', { class: 'pm-lic-right' },
          h('div', { class: 'pm-lic-icon-box' }, icon('i-report')),
          h('div', { class: 'pm-lic-info' },
            h('h3', { class: 'pm-lic-title', text: r.title }),
            h('div', { class: 'pm-lic-meta' },
              h('span', { text: 'تاريخ التقرير: ' + fmtDate(r.report_date) }),
              r.attachment_path ? h('span', { class: 'badge ok', text: 'يحتوي على مرفق للتحميل' }) : null,
              isNew ? h('span', { class: 'badge ok', text: 'جديد' }) : null
            )
          )
        ),
        h('div', { class: 'pm-lic-actions' },
          h('button', {
            type: 'button',
            class: 'btn-pm-primary',
            text: 'التفاصيل',
            onclick: function () {
              localStorage.setItem('de_seen_rep_' + r.id, '1');
              updateNotifBadge();
              var body = h('div', { class: 'modal-body' },
                h('div', { class: 'bar-sub' },
                  h('h2', { text: r.title }),
                  h('span', { class: 'badge ok', text: fmtDate(r.report_date) })
                )
              );
              if (r.achievements) body.appendChild(h('div', { style: 'margin-bottom:12px;' }, h('h3', { text: 'المكتسبات والمهارات المحققة:' }), h('p', { class: 'txt', text: r.achievements })));
              if (r.activities) body.appendChild(h('div', { style: 'margin-bottom:12px;' }, h('h3', { text: 'الأنشطة والورشات المنجزة:' }), h('p', { class: 'txt', text: r.activities })));
              if (r.notes) body.appendChild(h('div', { style: 'margin-bottom:12px;' }, h('h3', { text: 'ملاحظات وتوجيهات للأولياء:' }), h('p', { class: 'txt', text: r.notes })));
              if (r.attachment_path) {
                body.appendChild(h('div', { style: 'margin-top:16px;' },
                  h('h3', { text: 'الملف المرفق بالتقرير:' }),
                  fileBtn(r.attachment_path, 'تحميل / فتح الملف المرفق')
                ));
              }
              body.appendChild(h('div', { class: 'modal-actions' },
                h('button', { class: 'btn light', type: 'button', text: 'إغلاق', onclick: closeModal })
              ));
              openModal(body);
            }
          }),
          r.attachment_path ? fileBtn(r.attachment_path, 'تحميل المرفق') : null
        )
      );

      v.appendChild(card);
    });
  }

  /* تبويب المواعيد والأنشطة */
  function apptCard(a) {
    var isPast = new Date(a.starts_at) < new Date();
    var isCancelled = (a.status === 'cancelled');
    var badgeKind = isCancelled ? 'bad' : isPast ? 'gray' : 'ok';
    var badgeTxt = isCancelled ? t('cancelled') : t('scheduled');

    var card = h('div', { class: 'card' },
      h('h2', { text: a.title }),
      h('div', { class: 'meta' },
        h('span', { text: fmtDate(a.starts_at, true) }),
        a.location ? h('span', { text: a.location }) : null,
        h('span', { class: 'badge ' + badgeKind, text: badgeTxt }),
        h('span', { text: a.audience === 'all' ? t('forAll') : t('forChildPrefix') + childName(a.child_id) })
      )
    );
    if (a.description) card.appendChild(h('p', { class: 'txt', text: a.description }));
    return card;
  }

  function vAppts(v) {
    var now = new Date();
    var up = S.d.appts.filter(function (a) { return new Date(a.starts_at) >= now && a.status !== 'cancelled'; });
    var past = S.d.appts.filter(function (a) { return new Date(a.starts_at) < now || a.status === 'cancelled'; });

    v.appendChild(h('div', { class: 'bar-sub' }, h('h2', { text: t('apptsUpcoming') })));
    if (!up.length) v.appendChild(empty(t('emptyAppts'))); else up.forEach(function (a) { v.appendChild(apptCard(a)); });

    if (past.length) {
      v.appendChild(h('div', { class: 'bar-sub' }, h('h2', { text: t('apptsPast') })));
      past.forEach(function (a) { v.appendChild(apptCard(a)); });
    }
  }

  /* تبويب الرسائل والإعلانات */
  function vMsgs(v) {
    if (!S.d.msgs.length) return v.appendChild(empty(t('emptyMsgs')));
    S.d.msgs.forEach(function (m) {
      var isUnread = !S.reads[m.id];
      var card = h('div', { class: 'card' },
        h('h2', { text: m.title }),
        h('div', { class: 'meta' },
          h('span', { text: fmtDate(m.published_at) }),
          h('span', { class: 'badge ' + (m.kind === 'message' ? 'gold' : 'ok'), text: m.kind === 'message' ? t('personalMsg') : t('announcement') }),
          isUnread ? h('span', { class: 'badge bad', text: t('newBadge') }) : null
        ),
        h('p', { class: 'txt pre', text: m.body })
      );
      if (isUnread) {
        var markBtn = h('button', { class: 'btn small light', type: 'button', text: t('markAsRead') });
        markBtn.addEventListener('click', function () {
          lockBtn(markBtn, async function () {
            try {
              await C.rest('POST', '/message_reads', { message_id: m.id, parent_id: S.me });
              S.reads[m.id] = true;
              render();
            } catch (er) { toast(er.message, 'bad'); }
          });
        });
        card.appendChild(h('div', { class: 'row-actions' }, markBtn));
      }
      v.appendChild(card);
    });
  }

  /* تبويب الوثائق الخاصة */
  function vDocs(v) {
    var topRow = h('div', { class: 'bar-sub' },
      h('h2', { text: t('tabDocs') })
    );
    v.appendChild(topRow);

    var docsList = (S.d && S.d.docs) || [];
    if (!docsList.length) return v.appendChild(empty(t('emptyDocs')));

    docsList.forEach(function (d) {
      var card = h('div', { class: 'pm-list-item-card' },
        h('div', { class: 'pm-lic-right' },
          h('div', { class: 'pm-lic-icon-box' }, icon('i-file')),
          h('div', { class: 'pm-lic-info' },
            h('h3', { class: 'pm-lic-title', text: d.title }),
            h('div', { class: 'pm-lic-meta' },
              d.category ? h('span', { class: 'badge', text: d.category }) : null,
              h('span', { text: fmtDate(d.created_at) })
            )
          )
        ),
        h('div', { class: 'pm-lic-actions' },
          d.storage_path ? fileBtn(d.storage_path, 'تحميل / فتح الوثيقة') : null
        )
      );
      v.appendChild(card);
    });
  }

  /* تبويب التواصل مع المركز */
  function vContact(v) {
    var card = h('div', { class: 'contact-card' });
    card.appendChild(h('h2', { text: t('contactTitle') }));
    card.appendChild(h('p', { text: t('contactSub') }));

    function cItem(iconText, label, valNode) {
      var row = h('div', { class: 'contact-item' },
        h('div', { class: 'ci-icon', text: iconText }),
        h('div', { class: 'ci-body' },
          h('div', { class: 'ci-label', text: label }),
          h('div', { class: 'ci-val' }, valNode)
        )
      );
      card.appendChild(row);
    }

    cItem('', t('contactAddrLabel'), document.createTextNode(t('contactAddrVal')));
    cItem('', t('contactEmailLabel'), h('a', { href: 'https://mail.google.com/mail/?view=cm&to=cppdarelihcen@gmail.com', target: '_blank', rel: 'noopener noreferrer', text: 'cppdarelihcen@gmail.com' }));
    cItem('', t('contactPhoneLabel'), document.createTextNode('044 44 48 34 / 0664 42 14 44 / 0540 81 77 75 / 0668 03 41 47'));

    var socialLinks = h('div', { class: 'contact-btn-wrap' },
      h('a', { class: 'contact-btn', href: 'https://wa.me/213668034147', target: '_blank', rel: 'noopener noreferrer', text: ' ' + t('contactWa') }),
      h('a', { class: 'contact-btn', href: 'https://www.facebook.com/apehme', target: '_blank', rel: 'noopener noreferrer', text: ' ' + t('contactFb') })
    );
    cItem('', t('contactSocialLabel'), socialLinks);

    var siteA = document.createElement('a');
    siteA.setAttribute('href', (window.DE_CONFIG && window.DE_CONFIG.publicUrl) || './site.html');
    siteA.textContent = t('contactSiteLink');
    cItem('', t('contactSiteLabel'), siteA);

    v.appendChild(card);

    var noteCard = h('div', { class: 'card' },
      h('h3', { text: t('contactNoteTitle') }),
      h('p', { class: 'txt', text: t('contactNoteTxt') })
    );
    v.appendChild(noteCard);
  }

  if (window.DE_NAV) DE_NAV.setup({
    active: function () { var a = $('#app'); return !!(a && !a.hidden); },
    modalOpen: function () { var m = $('#modal'); return !!(m && !m.hidden); },
    closeModal: function () { closeModal(); },
    apply: function (st) { if (st.tab) S.tab = st.tab; render(); window.scrollTo(0, 0); }
  });

  function render() {
    if (window.DE_NAV) DE_NAV.push({ tab: S.tab });
    renderTabs();
    var v = $('#view'); v.textContent = '';
    // الواجهة الترحيبية والبطاقة العلوية تظهر فقط في تبويب معلومات الطفل
    // وفي باقي الأقسام (التقارير، التقييم، الرسائل، الوثائق...) يتم نزع الواجهة والدخول مباشرة للمحتوى
    if (S.tab === 'children') {
      v.appendChild(renderParentHeroCard());
    }
    var handlers = {
      children: vChildren,
      evaluations: vEvaluations,
      reports: vReports,
      docs: vDocs,
      msgs: vMsgs,
      programs: vPrograms,
      appts: vAppts,
      contact: vContact
    };
    var fn = handlers[S.tab] || vChildren;
    fn(v);
  }

  /* ---------- التشغيل والربط ---------- */
  
  function enterDemoParent() {
    S.me = 'demo-parent-id';
    S.name = 'عائلة خروبي الكريمة';
    var demoKid = {
      id: '00000000-0000-4000-8000-000000000187',
      membership_no: '187',
      full_name: 'خروبي زكرياء بن عيسى',
      dob: '2015-04-14',
      disability: 'اضطراب طيف التوحد TSA',
      phone: '054228492',
      section: 'توحد 01',
      center: 'main',
      academic_year: '2024/2025'
    };
    var demoEval = {
      id: 'demo-eval-1',
      child_id: demoKid.id,
      title: 'تقرير اللجنة البيداغوجية والتربوية — استمارة التقييم',
      report_date: '2026-10-15',
      status: 'published',
      activities: EVAL_MARKER + JSON.stringify({
        v: 2,
        term: 'الثلاثي الأخير',
        school_year: '2024/2025',
        degree_of_disability: 'متوسطة',
        qualification_level: 'توحد 01',
        supervisors: [
          { name: 'أمير زكرياء', role: 'مدير المركز' },
          { name: 'تواتي أسماء', role: 'أخصائية نفسانية' },
          { name: 'خلوفي صفا', role: 'مختصة أرطفونية' },
          { name: 'قوطارة جميلة', role: 'مربية' }
        ],
        general_report: 'تسجيل استجابة ممتازة في الأنشطة الفردية والتفاعل مع المربية، مع تحسن ملحوظ في التواصل البصري والتعبير الحركي والاستقلالية.',
        abilities: {
          current_potentials: 'قدرة جيدة على التركيز الفردي والاتباع البصري.',
          cognitive_intellectual: 'تمييز الألوان الأساسية والأشكال الهندسية.',
          language_receptive_expressive: 'فهم الأوامر البسيطة والاستجابة للإشارات.',
          communication_behavioral: 'سلوك هادئ وتفاعل إيجابي مع المربية.',
          academic_preacademic: 'مطابقة الصور ومسك القلم للرسم العشوائي.',
          motor_independence: 'الاعتماد على النفس في غسل اليدين وخلع المعطف.'
        },
        strengths: ['الهدوء والاستجابة للتعليمات الفردية', 'تطور الاتصال البصري والتركيز'],
        weaknesses: ['صعوبة التفاعل في المجموعات الكبيرة', 'الحاجة للتشجيع المستمر'],
        recommendations: ['مواصلة جلسات الأرطفونيا والتأهيل النفسي', 'تعزيز الأنشطة المشتركة مع الأسرة'],
        domains: []
      })
    };
    var demoRep = {
      id: 'demo-rep-1',
      child_id: demoKid.id,
      title: 'التقرير الدوري لمتابعة التطور والأنشطة',
      report_date: '2026-10-01',
      status: 'published',
      achievements: 'اكتساب مهارات جديدة في العناية الذاتية والترتيب.',
      activities: 'المشاركة في ورشة الرسم الحسي والأنشطة الحركية.',
      notes: 'نوصي الأسرة بمواصلة نفس التوجيهات في المنزل.'
    };
    var demoMsg = {
      id: 'demo-msg-1',
      title: 'إعلان: استلام استمارات التقييم البيداغوجي للثلاثي',
      body: 'أولياءنا الكرام، يسر إدارة المركز إعلامكم بإمكانية الاطلاع على تقارير التقييم البيداغوجي لأبنائكم وتحميلها مباشرة من فضاء الأولياء.',
      published_at: new Date().toISOString()
    };
    var demoDoc = {
      id: 'demo-doc-1',
      child_id: demoKid.id,
      title: 'شهادة المتابعة البيداغوجية والتأهيلية',
      category: 'شهادة رسمية',
      created_at: '2026-09-15'
    };

    S.d = {
      children: [demoKid],
      reports: [demoEval, demoRep],
      appts: [],
      msgs: [demoMsg],
      docs: [demoDoc],
      programs: [],
      sections: []
    };
    S.reads = {};
    show('app');
    applyLang();
    if ($('#who')) $('#who').textContent = S.name;
    toast('مرحبًا بك في وضع المعاينة التجريبية لفضاء الأولياء!', 'ok');
    render();
  }

async function init() {
    applyLang();
    if (!CFG.supabaseUrl || !CFG.supabaseKey) { $('#boot').textContent = 'إعدادات الاتصال غير مضبوطة.'; return; }
    C.onExpire(function () { showLogin('انتهت الجلسة. سجّل الدخول من جديد.'); });

    $('#loginForm').addEventListener('submit', submitLogin);
    var pDemo = $('#quickDemoParentBtn');
    if (pDemo) pDemo.addEventListener('click', enterDemoParent);
    if (new URLSearchParams(window.location.search).get('demo') === '1') { enterDemoParent(); return; }

    $('#forgotBtn').addEventListener('click', function () { setMode('forgot'); });
    $('#backBtn').addEventListener('click', function () { setMode('login'); });
    var lBtn = $('#logoutBtn'); if (lBtn) lBtn.addEventListener('click', function () { logout(); });

    var btnLoginLang = $('#loginLangBtn'); if (btnLoginLang) btnLoginLang.addEventListener('click', toggleLang);
    var btnBarLang = $('#barLangBtn'); if (btnBarLang) btnBarLang.addEventListener('click', toggleLang);

    // ربط عناصر القائمة الجانبية وتثبيت التطبيق
    var menuBtn = $('#parentMenuBtn');
    if (menuBtn) menuBtn.addEventListener('click', toggleDrawer);

    var closeBtn = $('#drawerCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    var scrim = $('#parentScrim');
    if (scrim) scrim.addEventListener('click', closeDrawer);

    var drawerLogout = $('#drawerLogoutBtn');
    if (drawerLogout) drawerLogout.addEventListener('click', function () {
      closeDrawer();
      logout();
    });

    var drawerInstall = $('#drawerInstallBtn');
    if (drawerInstall) drawerInstall.addEventListener('click', function () {
      closeDrawer();
      openInstallAppModal();
    });

    var headerInstall = $('#installHeaderBtn');
    if (headerInstall) headerInstall.addEventListener('click', openInstallAppModal);

    var m = $('#modal');
    if (m) {
      m.addEventListener('click', function (e) { if (e.target === m) closeModal(); });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (m && !m.hidden) closeModal();
        closeDrawer();
      }
    });

    try {
      var pu = (new URLSearchParams(window.location.search).get('u') || '').trim().toLowerCase();
      if (/^[a-z0-9._-]{3,30}$/.test(pu) && $('#email')) { $('#email').value = pu; var pwEl = $('#password'); if (pwEl) setTimeout(function () { pwEl.focus(); }, 0); }
    } catch (e) {}
    try {
      if (!new URLSearchParams(window.location.search).get('u')) {
        var last = (sessionStorage.getItem('de_parent_user') || '').trim().toLowerCase();
        if (last && last.length <= 254 && $('#email')) $('#email').value = last;
      }
    } catch (e3) {}

    var hash = await C.adoptHash();
    if (hash && hash.error) { showLogin(hash.error); return; }
    if (hash && (hash.type === 'invite' || hash.type === 'recovery')) {
      show('login');
      var userEmail = hash.email || '';
      if ($('#setEmail')) $('#setEmail').value = userEmail;
      if ($('#email')) $('#email').value = userEmail;
      setMode('set', hash.type === 'invite' ? t('hintInvite') : t('hintSet'));
      return;
    }
    if (C.load() || localStorage.getItem('de_parent_saved') === '1') {
      enter();
    } else {
      showLogin();
    }
  }

  init();
})();