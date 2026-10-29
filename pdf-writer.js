/* ══════════════════════════════════════════════════════════════════════════════
   DAR EL IHSAN — NATIVE CLIENT-SIDE PDF GENERATOR (منشئ ملفات PDF الرسمية)
   ══════════════════════════════════════════════════════════════════════════════
   - ينتج ملفات PDF 1.4 قياسية حقيقية تفتح في أي قارئ PDF (Acrobat, Chrome, Edge, Safari, iOS, Android).
   - يدعم الصفحات المتعددة ومقاس A4 القياسي (595.28 x 841.89 pt).
   - يرسم كافة الجداول والعلامات والترويسات الرسمية بدقة عالية ومظهر رسمي أنيق.
   - لا يتطلب أي مكتبات خارجية ويعمل دون اتصال بالإنترنت.
   ══════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var A4_W_PT = 595.28;
  var A4_H_PT = 841.89;

  // بناء ملف PDF 1.4 ثنائي قياسي من مصفوفة صور JPEG
  function buildPdfBinary(pagesJpeg) {
    var parts = [];
    var offsets = {};
    var enc = new TextEncoder();

    function writeStr(str) {
      parts.push(enc.encode(str));
    }
    function writeBytes(bytes) {
      if (bytes instanceof Uint8Array) parts.push(bytes);
      else if (bytes instanceof ArrayBuffer) parts.push(new Uint8Array(bytes));
      else parts.push(enc.encode(String(bytes)));
    }
    function currentOffset() {
      var sum = 0;
      for (var i = 0; i < parts.length; i++) sum += parts[i].byteLength;
      return sum;
    }

    // Header
    writeStr('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    var numPages = pagesJpeg.length;
    // Obj 1: Catalog
    offsets[1] = currentOffset();
    writeStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    // Obj 2: Pages
    var kidsStr = [];
    for (var i = 0; i < numPages; i++) {
      kidsStr.push((3 + i * 3) + ' 0 R');
    }
    offsets[2] = currentOffset();
    writeStr('2 0 obj\n<< /Type /Pages /Kids [' + kidsStr.join(' ') + '] /Count ' + numPages + ' >>\nendobj\n');

    // Pages & Image XObjects & Content streams
    for (var p = 0; p < numPages; p++) {
      var item = pagesJpeg[p];
      var pObj = 3 + p * 3;
      var imObj = 4 + p * 3;
      var cObj = 5 + p * 3;

      var imgW = item.width || 1240;
      var imgH = item.height || 1754;
      var jpgBytes = item.data;

      // Page Object
      offsets[pObj] = currentOffset();
      writeStr(pObj + ' 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + A4_W_PT.toFixed(2) + ' ' + A4_H_PT.toFixed(2) + '] /Resources << /XObject << /Im' + (p + 1) + ' ' + imObj + ' 0 R >> >> /Contents ' + cObj + ' 0 R >>\nendobj\n');

      // Image XObject
      offsets[imObj] = currentOffset();
      writeStr(imObj + ' 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + imgW + ' /Height ' + imgH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpgBytes.byteLength + ' >>\nstream\n');
      writeBytes(jpgBytes);
      writeStr('\nendstream\nendobj\n');

      // Content stream
      var cStr = 'q\n' + A4_W_PT.toFixed(2) + ' 0 0 ' + A4_H_PT.toFixed(2) + ' 0 0 cm\n/Im' + (p + 1) + ' Do\nQ\n';
      offsets[cObj] = currentOffset();
      writeStr(cObj + ' 0 obj\n<< /Length ' + cStr.length + ' >>\nstream\n' + cStr + 'endstream\nendobj\n');
    }

    var totalObjs = 2 + numPages * 3;
    var xrefOffset = currentOffset();
    writeStr('xref\n0 ' + (totalObjs + 1) + '\n0000000000 65535 f \n');
    for (var o = 1; o <= totalObjs; o++) {
      var offStr = ('0000000000' + offsets[o]).slice(-10);
      writeStr(offStr + ' 00000 n \n');
    }

    writeStr('trailer\n<< /Size ' + (totalObjs + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n');

    var totalLen = 0;
    for (var k = 0; k < parts.length; k++) totalLen += parts[k].byteLength;
    var full = new Uint8Array(totalLen);
    var pos = 0;
    for (var j = 0; j < parts.length; j++) {
      full.set(parts[j], pos);
      pos += parts[j].byteLength;
    }
    return full;
  }

  // تحويل كانفاس إلى بايتات صورة JPEG
  function canvasToJpegBytes(canvas, quality) {
    return new Promise(function (resolve) {
      if (canvas.toBlob) {
        canvas.toBlob(function (blob) {
          var reader = new FileReader();
          reader.onload = function () {
            resolve(new Uint8Array(reader.result));
          };
          reader.readAsArrayBuffer(blob);
        }, 'image/jpeg', quality || 0.92);
      } else {
        var dataUrl = canvas.toDataURL('image/jpeg', quality || 0.92);
        var bin = atob(dataUrl.split(',')[1]);
        var u8 = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        resolve(u8);
      }
    });
  }

  // تنزيل ملف PDF في المتصفح مباشرة
  function downloadPdf(pdfBytes, filename) {
    var blob = new Blob([pdfBytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || 'document.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  // رسم ترويسة دار الإحسان الرسمية على الكانفاس
  function drawOfficialHeader(ctx, w, titleAr, subAr) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, 1754);

    // الإطار الخارجي الأنيق
    ctx.strokeStyle = '#123E73';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, w - 60, 1694);

    ctx.strokeStyle = '#B4873A';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, w - 72, 1682);

    // الترويسة العليا
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#123E73';
    ctx.font = 'bold 26px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx.fillText('الجمهورية الجزائرية الديمقراطية الشعبية', w / 2, 85);

    ctx.font = 'bold 24px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx.fillText('جمعية أولياء الأطفال المعاقين ذهنيًا — ولاية غرداية', w / 2, 120);

    ctx.fillStyle = '#B4873A';
    ctx.font = 'bold 28px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx.fillText('المركز النفسي البيداغوجي دار الإحسان — العطف', w / 2, 160);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 185);
    ctx.lineTo(w - 80, 185);
    ctx.stroke();

    // عنوان الوثيقة الرئيسي
    if (titleAr) {
      ctx.fillStyle = '#123E73';
      ctx.fillRect(80, 205, w - 160, 50);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px "IBM Plex Sans Arabic", "Cairo", sans-serif';
      ctx.fillText(titleAr, w / 2, 238);
    }
  }

  // رسم تقرير دوري رسمي وتحويله إلى بايتات PDF
  async function renderReportToPdf(rep, child, secName, brName) {
    var c = document.createElement('canvas');
    c.width = 1240;
    c.height = 1754;
    var ctx = c.getContext('2d');

    drawOfficialHeader(ctx, 1240, rep.title || 'تقرير تربوي وبيداغوجي', 'دار الإحسان');

    // بطاقة معلومات التلميذ
    var chName = (child && child.full_name) || 'غير محدد';
    var chMem = (child && child.membership_no) ? ('N° ' + child.membership_no) : '—';
    var rDate = rep.report_date || (rep.created_at ? rep.created_at.slice(0, 10) : '—');

    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(80, 275, 1240 - 160, 130);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 275, 1240 - 160, 130);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx.textAlign = 'right';

    ctx.fillText('اسم ولقب التلميذ(ة): ' + chName, 1240 - 110, 315);
    ctx.fillText('رقم القيد / العضوية: ' + chMem, 1240 - 110, 355);
    ctx.fillText('القسم / الفوج: ' + (secName || '—'), 1240 - 110, 390);

    ctx.fillText('الفرع / المركز: ' + (brName || 'المركز الرئيسي'), 580, 315);
    ctx.fillText('تاريخ التقرير: ' + rDate, 580, 355);
    ctx.fillText('طبيعة الإعاقة: ' + ((child && child.disability) || '—'), 580, 390);

    // نص ومحتوى التقرير
    ctx.fillStyle = '#123E73';
    ctx.font = 'bold 22px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx.fillText('نص وملاحظات التقرير:', 1240 - 100, 450);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(80, 470, 1240 - 160, 850);
    ctx.strokeStyle = '#CBD5E1';
    ctx.strokeRect(80, 470, 1240 - 160, 850);

    ctx.fillStyle = '#1E293B';
    ctx.font = '20px "IBM Plex Sans Arabic", "Cairo", sans-serif';

    var text = rep.content || rep.notes || rep.body || 'لا توجد ملاحظات إضافية مسجلة في هذا التقرير.';
    var words = text.split(/\s+/);
    var line = '';
    var y = 515;
    var maxW = 1240 - 220;

    for (var n = 0; n < words.length; n++) {
      var testLine = line + (line ? ' ' : '') + words[n];
      var metrics = ctx.measureText(testLine);
      if (metrics.width > maxW && n > 0) {
        ctx.fillText(line, 1240 - 110, y);
        line = words[n];
        y += 34;
        if (y > 1280) break;
      } else {
        line = testLine;
      }
    }
    if (line && y <= 1280) {
      ctx.fillText(line, 1240 - 110, y);
    }

    // جدول التوقيعات والأختام
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(80, 1360, 1240 - 160, 220);
    ctx.strokeStyle = '#CBD5E1';
    ctx.strokeRect(80, 1360, 1240 - 160, 220);

    ctx.fillStyle = '#123E73';
    ctx.font = 'bold 20px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('توقيع وختم المربية المشرفة', 320, 1400);
    ctx.fillText('توقيع وختم مدير المركز', 920, 1400);

    ctx.strokeStyle = '#94A3B8';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(180, 1530); ctx.lineTo(460, 1530);
    ctx.moveTo(780, 1530); ctx.lineTo(1060, 1530);
    ctx.stroke();
    ctx.setLineDash([]);

    // الهامش السفلي
    ctx.font = '16px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('المركز النفسي البيداغوجي دار الإحسان — وثيقة إدارية رسمية — معتمدة ومؤرشفة رقمياً', 1240 / 2, 1690);

    var jpg = await canvasToJpegBytes(c, 0.92);
    return buildPdfBinary([{ data: jpg, width: 1240, height: 1754 }]);
  }

  // رسم استمارة التقييم البيداغوجي بكافة جداولها ومجالاتها وتحويلها إلى PDF
  async function renderEvaluationToPdf(rep, childFullName, secName, kd) {
    // 1. الصفحة الأولى: الترويسة الرسمية، معلومات الحالة، المشرفين، الوصف العام، الخلاصة والتوصيات
    var c1 = document.createElement('canvas');
    c1.width = 1240;
    c1.height = 1754;
    var ctx1 = c1.getContext('2d');

    drawOfficialHeader(ctx1, 1240, 'تقرير اللجنة البيداغوجية والتربوية (استمارة التقييم)', 'دار الإحسان');

    // بانر الثلاثي والموسم
    var term = rep.term || 'الثلاثي السنوي';
    ctx1.fillStyle = '#EAB308';
    ctx1.fillRect(80, 270, 1240 - 160, 42);
    ctx1.fillStyle = '#000000';
    ctx1.font = 'bold 22px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.textAlign = 'center';
    ctx1.fillText('تقييم ' + term + ' للموسم الدراسي 2026-2027', 1240 / 2, 298);

    // جدول معلومات الحالة
    ctx1.fillStyle = '#FFFFFF';
    ctx1.fillRect(80, 325, 1240 - 160, 120);
    ctx1.strokeStyle = '#000000';
    ctx1.lineWidth = 1.5;
    ctx1.strokeRect(80, 325, 1240 - 160, 120);

    ctx1.textAlign = 'right';
    ctx1.fillStyle = '#000000';
    ctx1.font = 'bold 19px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillText('اسم ولقب الحالة: ' + (childFullName || '—'), 1240 - 110, 360);
    ctx1.fillText('نوع الاضطراب: ' + ((kd && kd.disability) || '—'), 1240 - 110, 395);
    ctx1.fillText('درجة الإعاقة: ' + (rep.degree_of_disability || 'متوسطة'), 1240 - 110, 430);

    ctx1.fillText('القسم ومستوى التأهيل: ' + (secName || '—'), 580, 360);
    ctx1.fillText('تاريخ الميلاد: ' + ((kd && kd.dob) || '—'), 580, 395);
    ctx1.fillText('رقم القيد: ' + ((kd && kd.membership_no) || '—'), 580, 430);

    // جدول المشرفين
    ctx1.fillStyle = '#123E73';
    ctx1.fillRect(80, 460, 1240 - 160, 35);
    ctx1.fillStyle = '#FFFFFF';
    ctx1.textAlign = 'center';
    ctx1.font = 'bold 18px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillText('المشرفون التربويون والبيداغوجيون', 1240 / 2, 484);

    ctx1.fillStyle = '#F8FAFC';
    ctx1.fillRect(80, 495, 1240 - 160, 75);
    ctx1.strokeRect(80, 495, 1240 - 160, 75);

    ctx1.fillStyle = '#000000';
    ctx1.font = '17px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillText('أمير زكرياء — مدير المركز | التوقيع: .......................................', 1240 / 2, 525);
    ctx1.fillText('المربية المشرفة على القسم | التوقيع: .......................................', 1240 / 2, 555);

    // الوصف العام لأداء الحالة
    ctx1.fillStyle = '#7DD3FC';
    ctx1.fillRect(80, 585, 1240 - 160, 35);
    ctx1.fillStyle = '#0C4A6E';
    ctx1.font = 'bold 19px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillText('الوصف العام لأداء الحالة والقدرات والإمكانيات', 1240 / 2, 609);

    ctx1.fillStyle = '#FFFFFF';
    ctx1.fillRect(80, 620, 1240 - 160, 340);
    ctx1.strokeRect(80, 620, 1240 - 160, 340);

    ctx1.textAlign = 'right';
    ctx1.fillStyle = '#1E293B';
    ctx1.font = '17px "IBM Plex Sans Arabic", "Cairo", sans-serif';

    var ab = rep.abilities || {};
    var abItems = [
      '• الإمكانيات والقدرات الحالية: ' + (ab.current_potentials || 'استجابة جيدة مع التوجيه البيداغوجي.'),
      '• المهارات المعرفية والفكرية: ' + (ab.cognitive_intellectual || 'تطور ملحوظ في التمييز والتصنيف.'),
      '• اللغة والتواصل (استقبالية تعبيرية): ' + (ab.language_receptive_expressive || 'فهم الأوامر البسيطة والاستجابة بالإشارة والنطق.'),
      '• القدرات الاتصالية والسلوكية: ' + (ab.communication_behavioral || 'تفاعل إيجابي مع المربية والزملاء.'),
      '• المعارف الأكاديمية وما قبل الأكاديمي: ' + (ab.academic_preacademic || 'التعرف على الأشكال والألوان الأساسية.'),
      '• القدرات الحركية والاستقلالية: ' + (ab.motor_independence || 'استقلالية مقبولة في الأنشطة اليومية الذاتية.')
    ];
    for (var a = 0; a < abItems.length; a++) {
      ctx1.fillText(abItems[a], 1240 - 110, 655 + a * 50);
    }

    // الخلاصة والتوصيات
    ctx1.fillStyle = '#86EFAC';
    ctx1.fillRect(80, 975, 1240 - 160, 35);
    ctx1.fillStyle = '#064E3B';
    ctx1.textAlign = 'center';
    ctx1.font = 'bold 19px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillText('الخلاصة والتوصيات التربوية', 1240 / 2, 999);

    ctx1.fillStyle = '#FFFFFF';
    ctx1.fillRect(80, 1010, 1240 - 160, 320);
    ctx1.strokeRect(80, 1010, 1240 - 160, 320);

    ctx1.textAlign = 'right';
    ctx1.fillStyle = '#065F46';
    ctx1.font = 'bold 18px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillText('1. نقاط القوة:', 1240 - 110, 1045);
    ctx1.fillStyle = '#1E293B';
    ctx1.font = '17px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    var st = (rep.strengths && rep.strengths.length) ? rep.strengths.join(' ، ') : 'استجابة وتفاعل إيجابي مع الأنشطة الموجهة.';
    ctx1.fillText(st, 1240 - 110, 1080);

    ctx1.fillStyle = '#991B1B';
    ctx1.font = 'bold 18px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillText('2. نقاط الضعف ومجالات التحسين:', 1240 - 110, 1140);
    ctx1.fillStyle = '#1E293B';
    ctx1.font = '17px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    var wk = (rep.weaknesses && rep.weaknesses.length) ? rep.weaknesses.join(' ، ') : 'الحاجة لتعزيز مهارات التركيز والاستقلالية التامة.';
    ctx1.fillText(wk, 1240 - 110, 1175);

    ctx1.fillStyle = '#1E40AF';
    ctx1.font = 'bold 18px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillText('3. التوجيهات والتوصيات للأسرة:', 1240 - 110, 1235);
    ctx1.fillStyle = '#1E293B';
    ctx1.font = '17px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    var rc = (rep.recommendations && rep.recommendations.length) ? rep.recommendations.join(' ، ') : 'مواصلة المتابعة البيداغوجية في البيت والتنسيق المستمر مع المركز.';
    ctx1.fillText(rc, 1240 - 110, 1270);

    // توقيعات الصفحة الأولى
    ctx1.fillStyle = '#F8FAFC';
    ctx1.fillRect(80, 1345, 1240 - 160, 240);
    ctx1.strokeRect(80, 1345, 1240 - 160, 240);

    ctx1.fillStyle = '#123E73';
    ctx1.font = 'bold 19px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.textAlign = 'center';
    ctx1.fillText('توقيع وختم المربية المشرفة', 320, 1390);
    ctx1.fillText('توقيع وختم مدير المركز', 920, 1390);

    ctx1.font = '16px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx1.fillStyle = '#64748B';
    ctx1.fillText('الصفحة 1 من 2 — تفاصيل المهارات وجداول النقاط في الصفحة التالية', 1240 / 2, 1690);

    // 2. الصفحة الثانية: جميع جداول المجالات والمهارات التفصيلية والنتيجة الإجمالية
    var c2 = document.createElement('canvas');
    c2.width = 1240;
    c2.height = 1754;
    var ctx2 = c2.getContext('2d');

    drawOfficialHeader(ctx2, 1240, 'كشف تفاصيل المهارات والتقييم العددي لجميع المجالات', 'دار الإحسان');

    ctx2.fillStyle = '#1E1B4B';
    ctx2.fillRect(80, 270, 1240 - 160, 42);
    ctx2.fillStyle = '#FFFFFF';
    ctx2.font = 'bold 20px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx2.textAlign = 'center';
    ctx2.fillText('الجداول التفصيلية لكافة المهارات المقيمة في المجالات التربوية', 1240 / 2, 298);

    var y2 = 330;
    var totalEarned = 0;
    var totalMax = 0;
    var totalSkills = 0;
    var domains = rep.domains || [];

    for (var d = 0; d < domains.length; d++) {
      var dm = domains[d];
      var dEarned = 0;
      var dMax = 0;

      (dm.ratings || []).forEach(function (it) {
        var sc = 0;
        if (it.score !== '' && it.score != null) {
          var parsed = parseInt(it.score, 10);
          if (!isNaN(parsed)) sc = parsed;
        } else if (it.yn) {
          if (it.yn === 'نعم') sc = 5;
        }
        dEarned += sc;
        dMax += 5;
        totalSkills++;
      });
      totalEarned += dEarned;
      totalMax += dMax;
      var dPct = dMax > 0 ? Math.round((dEarned / dMax) * 100) : 0;

      // ترويسة المجال
      ctx2.fillStyle = '#EEF2FF';
      ctx2.fillRect(80, y2, 1240 - 160, 36);
      ctx2.strokeStyle = '#6366F1';
      ctx2.lineWidth = 1.5;
      ctx2.strokeRect(80, y2, 1240 - 160, 36);

      ctx2.fillStyle = '#312E81';
      ctx2.textAlign = 'right';
      ctx2.font = 'bold 18px "IBM Plex Sans Arabic", "Cairo", sans-serif';
      ctx2.fillText('• ' + dm.domain + ' (' + (dm.ratings ? dm.ratings.length : 0) + ' مهارة)', 1240 - 100, y2 + 25);

      ctx2.textAlign = 'left';
      ctx2.fillText('النقاط: ' + dEarned + ' / ' + dMax + ' (' + dPct + '%)', 100, y2 + 25);
      y2 += 40;

      // أسطر المهارات في هذا المجال
      var ratings = dm.ratings || [];
      for (var rIdx = 0; rIdx < ratings.length; rIdx++) {
        var rt = ratings[rIdx];
        if (y2 > 1460) break;

        ctx2.fillStyle = (rIdx % 2 === 0) ? '#FFFFFF' : '#F8FAFC';
        ctx2.fillRect(80, y2, 1240 - 160, 30);
        ctx2.strokeStyle = '#E2E8F0';
        ctx2.lineWidth = 0.8;
        ctx2.strokeRect(80, y2, 1240 - 160, 30);

        ctx2.textAlign = 'right';
        ctx2.fillStyle = '#0F172A';
        ctx2.font = '15px "IBM Plex Sans Arabic", "Cairo", sans-serif';
        var skillTitle = rt.skill || rt.item || ('مهارة ' + (rIdx + 1));
        var itemTxt = (rIdx + 1) + '. ' + skillTitle;
        ctx2.fillText(itemTxt.slice(0, 75), 1240 - 100, y2 + 21);

        ctx2.textAlign = 'left';
        var scoreVal = (rt.score != null && rt.score !== '') ? (rt.score + ' / 5') : (rt.yn || '0 / 5');
        ctx2.fillStyle = '#1D4ED8';
        ctx2.font = 'bold 15px "IBM Plex Sans Arabic", "Cairo", sans-serif';
        ctx2.fillText(scoreVal, 100, y2 + 21);

        y2 += 31;
      }
      y2 += 10;
      if (y2 > 1460) break;
    }

    // جدول النتيجة الإجمالية لكافة المجالات المختارة
    var overallPct = totalMax > 0 ? ((totalEarned / totalMax) * 100).toFixed(1) : '0';
    ctx2.fillStyle = '#065F46';
    ctx2.fillRect(80, 1500, 1240 - 160, 80);
    ctx2.strokeStyle = '#047857';
    ctx2.lineWidth = 2;
    ctx2.strokeRect(80, 1500, 1240 - 160, 80);

    ctx2.fillStyle = '#FFFFFF';
    ctx2.textAlign = 'center';
    ctx2.font = 'bold 22px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx2.fillText('النتيجة الإجمالية لكافة المجالات التربوية المختارة', 1240 / 2, 1535);
    ctx2.font = 'bold 26px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx2.fillText('المجموع المحصل: ' + totalEarned + ' من أصل ' + totalMax + ' نقطة (' + overallPct + '%)', 1240 / 2, 1568);

    ctx2.font = '16px "IBM Plex Sans Arabic", "Cairo", sans-serif';
    ctx2.fillStyle = '#64748B';
    ctx2.fillText('الصفحة 2 من 2 — وثيقة تقييم رسمية صادرة عن دار الإحسان', 1240 / 2, 1690);

    var jpg1 = await canvasToJpegBytes(c1, 0.92);
    var jpg2 = await canvasToJpegBytes(c2, 0.92);

    return buildPdfBinary([
      { data: jpg1, width: 1240, height: 1754 },
      { data: jpg2, width: 1240, height: 1754 }
    ]);
  }

  // تصدير الكائن العام
  root.DE_PDF = {
    buildPdfBinary: buildPdfBinary,
    canvasToJpegBytes: canvasToJpegBytes,
    downloadPdf: downloadPdf,
    renderReportToPdf: renderReportToPdf,
    renderEvaluationToPdf: renderEvaluationToPdf
  };

})(typeof window !== 'undefined' ? window : global);