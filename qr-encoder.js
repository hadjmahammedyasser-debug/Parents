/* qr-encoder.js — مولّد رموز QR صغير بلا مكتبات خارجية (متوافق مع CSP: script-src 'self').
   الإمكانيات: وضع البايتات (UTF-8)، مستوى تصحيح الأخطاء M، الإصدارات 1–6 (يكفي لروابط حتى ~106 بايت).
   الاستعمال: DEQR.encode(text) ← { size, dark(x, y) }  (لا يضيف الهامش الأبيض؛ يضيفه المستدعي). */
(function (root) {
  'use strict';

  // جداول الإصدارات 1–6 لمستوى تصحيح M (ISO/IEC 18004)
  var TOTAL = [0, 26, 44, 70, 100, 134, 172];          // مجموع الكلمات الرمزية
  var ECC_LEN = [0, 10, 16, 26, 18, 24, 16];           // كلمات تصحيح لكل كتلة
  var BLOCKS = [0, 1, 1, 1, 2, 2, 4];                  // عدد الكتل
  var MAX_VER = 6;

  var EXP = new Array(512), LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
    for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  function gmul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  function rsDivisor(degree) {                          // معامِل مولّد Reed–Solomon
    var r = new Array(degree).fill(0); r[degree - 1] = 1;
    var root = 1;
    for (var i = 0; i < degree; i++) {
      for (var j = 0; j < degree; j++) {
        r[j] = gmul(r[j], root);
        if (j + 1 < degree) r[j] ^= r[j + 1];
      }
      root = gmul(root, 2);
    }
    return r;
  }
  function rsRemainder(data, div) {
    var res = new Array(div.length).fill(0);
    for (var k = 0; k < data.length; k++) {
      var factor = data[k] ^ res[0];
      res.shift(); res.push(0);
      for (var i = 0; i < div.length; i++) res[i] ^= gmul(div[i], factor);
    }
    return res;
  }

  function utf8(text) { return Array.prototype.slice.call(new TextEncoder().encode(String(text))); }

  function dataCodewords(ver) { return TOTAL[ver] - ECC_LEN[ver] * BLOCKS[ver]; }

  function makeCodewords(bytes, ver) {
    var cap = dataCodewords(ver) * 8, bits = [];
    function push(v, n) { for (var i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); }
    push(4, 4);                       // نمط البايتات 0100
    push(bytes.length, 8);            // عدد الأحرف (8 بتات للإصدارات 1–9)
    bytes.forEach(function (b) { push(b, 8); });
    push(0, Math.min(4, cap - bits.length));
    push(0, (8 - bits.length % 8) % 8);
    for (var p = 0xec; bits.length < cap; p = (p === 0xec ? 0x11 : 0xec)) push(p, 8);
    var data = [];
    for (var i = 0; i < bits.length; i += 8) {
      var v = 0; for (var j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
      data.push(v);
    }
    // تقسيم إلى كتل + تصحيح الأخطاء + تداخل
    var numBlocks = BLOCKS[ver], eccLen = ECC_LEN[ver], raw = TOTAL[ver];
    var shortLen = Math.floor(raw / numBlocks), numShort = numBlocks - raw % numBlocks;
    var div = rsDivisor(eccLen), blocks = [], k = 0;
    for (var b = 0; b < numBlocks; b++) {
      var dlen = shortLen - eccLen + (b < numShort ? 0 : 1);
      var d = data.slice(k, k + dlen); k += dlen;
      blocks.push({ d: d, e: rsRemainder(d, div) });
    }
    var out = [], maxD = 0;
    blocks.forEach(function (x) { maxD = Math.max(maxD, x.d.length); });
    for (i = 0; i < maxD; i++) blocks.forEach(function (x) { if (i < x.d.length) out.push(x.d[i]); });
    for (i = 0; i < eccLen; i++) blocks.forEach(function (x) { out.push(x.e[i]); });
    var outBits = [];
    out.forEach(function (v) { for (var q = 7; q >= 0; q--) outBits.push((v >>> q) & 1); });
    return outBits;
  }

  function build(ver, codeBits, mask) {
    var size = ver * 4 + 17, mod = [], fn = [], y, x;
    for (y = 0; y < size; y++) { mod.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
    function sf(x, y, v) { mod[y][x] = !!v; fn[y][x] = true; }

    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var dist = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx + dx, yy = cy + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) sf(xx, yy, dist !== 2 && dist !== 4);
      }
    }
    var i;
    for (i = 0; i < size; i++) { sf(6, i, i % 2 === 0); sf(i, 6, i % 2 === 0); }   // التوقيت أولًا ثم المكاشف فوقه
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    // نمط المحاذاة (في الإصدارات 2–6 موضع واحد فقط غير متصادم مع المكاشف)
    if (ver >= 2) {
      var ap = [6, size - 7];
      for (var a = 0; a < 2; a++) for (var c = 0; c < 2; c++) {
        if ((a === 0 && c === 0) || (a === 0 && c === 1) || (a === 1 && c === 0)) continue;
        for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++)
          sf(ap[c] + dx, ap[a] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
    // مناطق معلومات الصيغة (تُملأ لاحقًا) + الوحدة الداكنة الثابتة
    for (i = 0; i < 9; i++) { fn[8][i] = true; fn[i][8] = true; }
    for (i = 0; i < 8; i++) { fn[8][size - 1 - i] = true; fn[size - 1 - i][8] = true; }
    sf(8, size - 8, true);

    // وضع البيانات (تعرّج من اليمين إلى اليسار)
    var idx = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (var j = 0; j < 2; j++) {
        x = right - j;
        var upward = ((right + 1) & 2) === 0;
        y = upward ? size - 1 - vert : vert;
        if (!fn[y][x] && idx < codeBits.length) { mod[y][x] = codeBits[idx] === 1; idx++; }
      }
    }
    // القناع
    var masks = [
      function (x, y) { return (x + y) % 2 === 0; },
      function (x, y) { return y % 2 === 0; },
      function (x, y) { return x % 3 === 0; },
      function (x, y) { return (x + y) % 3 === 0; },
      function (x, y) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; },
      function (x, y) { return (x * y) % 2 + (x * y) % 3 === 0; },
      function (x, y) { return ((x * y) % 2 + (x * y) % 3) % 2 === 0; },
      function (x, y) { return ((x + y) % 2 + (x * y) % 3) % 2 === 0; }
    ];
    for (y = 0; y < size; y++) for (x = 0; x < size; x++)
      if (!fn[y][x] && masks[mask](x, y)) mod[y][x] = !mod[y][x];
    // معلومات الصيغة: مستوى M = 00 ثم القناع، مع BCH(15,5) وقناع 0x5412
    var fdata = mask, rem = fdata;                      // (00 << 3) | mask
    for (i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    var bits = ((fdata << 10) | rem) ^ 0x5412;
    function gb(n) { return (bits >>> n) & 1; }
    for (i = 0; i <= 5; i++) sf(8, i, gb(i));
    sf(8, 7, gb(6)); sf(8, 8, gb(7)); sf(7, 8, gb(8));
    for (i = 9; i < 15; i++) sf(14 - i, 8, gb(i));
    for (i = 0; i < 8; i++) sf(size - 1 - i, 8, gb(i));
    for (i = 8; i < 15; i++) sf(8, size - 15 + i, gb(i));
    sf(8, size - 8, true);
    return { size: size, mod: mod };
  }

  function penalty(m) {
    var size = m.size, mod = m.mod, res = 0, y, x, run, i, dark = 0;
    function runs(get) {
      var p = 0;
      for (var a = 0; a < size; a++) {
        var last = null, cnt = 0;
        for (var b = 0; b < size; b++) {
          var v = get(a, b);
          if (v === last) cnt++; else { if (cnt >= 5) p += 3 + (cnt - 5); last = v; cnt = 1; }
        }
        if (cnt >= 5) p += 3 + (cnt - 5);
      }
      return p;
    }
    res += runs(function (a, b) { return mod[a][b]; });
    res += runs(function (a, b) { return mod[b][a]; });
    for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
      var c = mod[y][x];
      if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) res += 3;
    }
    var P1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], P2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function matchAt(get) {
      var p = 0;
      for (var a = 0; a < size; a++) for (var b = 0; b + 11 <= size; b++) {
        var ok1 = true, ok2 = true;
        for (i = 0; i < 11; i++) {
          var v = get(a, b + i) ? 1 : 0;
          if (v !== P1[i]) ok1 = false;
          if (v !== P2[i]) ok2 = false;
        }
        if (ok1) p += 40; if (ok2) p += 40;
      }
      return p;
    }
    res += matchAt(function (a, b) { return mod[a][b]; });
    res += matchAt(function (a, b) { return mod[b][a]; });
    for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (mod[y][x]) dark++;
    var total = size * size, k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    res += Math.max(0, k) * 10;
    return res;
  }

  function encode(text) {
    var bytes = utf8(text), ver = 1;
    for (; ver <= MAX_VER; ver++) if (4 + 8 + bytes.length * 8 <= dataCodewords(ver) * 8) break;
    if (ver > MAX_VER) throw new Error('النص أطول من السعة المدعومة للرمز.');
    var codeBits = makeCodewords(bytes, ver), best = null, bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var m = build(ver, codeBits, mask), s = penalty(m);
      if (s < bestScore) { bestScore = s; best = m; }
    }
    return { size: best.size, dark: function (x, y) { return !!best.mod[y][x]; }, version: ver };
  }

  root.DEQR = { encode: encode };
})(typeof window !== 'undefined' ? window : globalThis);
