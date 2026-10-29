/**
 * مولّد رموز الاستجابة السريعة (QR Code Generator) — محلي 100% بدون أي اعتمادات خارجية
 * مخصص لرسم الرموز مباشرة على عناصر HTML5 Canvas بجودة طباعة فائقة وتوافق تام مع CSP.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) { define([], factory); }
  else if (typeof exports === 'object') { module.exports = factory(); }
  else { root.DE_QR = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Galois field tables
  var EXP_TABLE = new Array(256), LOG_TABLE = new Array(256);
  for (var i = 0; i < 8; i++) EXP_TABLE[i] = 1 << i;
  for (var i = 8; i < 256; i++) EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
  for (var i = 0; i < 255; i++) LOG_TABLE[EXP_TABLE[i]] = i;

  function glog(n) { if (n < 1) throw new Error('glog(' + n + ')'); return LOG_TABLE[n]; }
  function gexp(n) { while (n < 0) n += 255; while (n >= 255) n -= 255; return EXP_TABLE[n]; }

  function Polynomial(num, shift) {
    var offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    for (var i = num.length - offset; i < this.num.length; i++) this.num[i] = 0;
  }
  Polynomial.prototype = {
    get: function (index) { return this.num[index]; },
    getLength: function () { return this.num.length; },
    multiply: function (e) {
      var num = new Array(this.getLength() + e.getLength() - 1);
      for (var i = 0; i < num.length; i++) num[i] = 0;
      for (var i = 0; i < this.getLength(); i++) {
        for (var j = 0; j < e.getLength(); j++) {
          num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
        }
      }
      return new Polynomial(num, 0);
    },
    mod: function (e) {
      if (this.getLength() - e.getLength() < 0) return this;
      var ratio = glog(this.get(0)) - glog(e.get(0));
      var num = new Array(this.getLength());
      for (var i = 0; i < this.getLength(); i++) num[i] = this.get(i);
      for (var i = 0; i < e.getLength(); i++) {
        num[i] ^= gexp(glog(e.get(i)) + ratio);
      }
      return new Polynomial(num, 0).mod(e);
    }
  };

  var RS_BLOCK_TABLE = [
    // Version 1
    [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
    // Version 2
    [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
    // Version 3
    [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
    // Version 4
    [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
    // Version 5
    [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],
    // Version 6
    [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],
    // Version 7
    [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14],
    // Version 8
    [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15],
    // Version 9
    [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13],
    // Version 10
    [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16],
    // Version 11
    [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 45, 22, 4, 46, 23], [3, 36, 12, 8, 37, 13],
    // Version 12
    [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15],
    // Version 13
    [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12],
    // Version 14
    [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13]
  ];

  function QRCode(typeNumber, errorCorrectionLevel) {
    this.typeNumber = typeNumber || 0;
    this.errorCorrectionLevel = errorCorrectionLevel != null ? errorCorrectionLevel : 0; // 0 = L, 1 = M, 2 = Q, 3 = H
    this.modules = null;
    this.moduleCount = 0;
    this.dataList = [];
  }

  QRCode.prototype = {
    addData: function (data) {
      this.dataList.push(data);
    },
    isDark: function (row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error(row + ',' + col);
      }
      return this.modules[row][col];
    },
    getModuleCount: function () {
      return this.moduleCount;
    },
    make: function () {
      if (this.typeNumber < 1) {
        var typeNumber = 1;
        for (typeNumber = 1; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRCode.getRSBlocks(typeNumber, this.errorCorrectionLevel);
          var buffer = new QRBitBuffer();
          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
          for (var i = 0; i < this.dataList.length; i++) {
            var data = this.dataList[i];
            buffer.put(4, 4); // 8-bit byte mode
            buffer.put(data.length, QRCode.getLengthInBits(4, typeNumber));
            for (var j = 0; j < data.length; j++) buffer.put(data.charCodeAt(j), 8);
          }
          if (buffer.getLengthInBits() <= totalDataCount * 8) break;
        }
        this.typeNumber = typeNumber;
      }
      this.makeImpl(false, this.getBestMaskPattern());
    },
    makeImpl: function (test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (var row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
        for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null;
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupTimingPattern();
      this.setupPositionAdjustPattern();
      if (this.typeNumber >= 7) this.setupTypeNumber(test);
      this.setupTypeInfo(test, maskPattern);
      this.mapData(QRCode.createData(this.typeNumber, this.errorCorrectionLevel, this.dataList), maskPattern);
    },
    setupPositionProbePattern: function (row, col) {
      for (var r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (var c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if ((0 <= r && r <= 6 && (c === 0 || c === 6)) || (0 <= c && c <= 6 && (r === 0 || r === 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    getBestMaskPattern: function () {
      var minLostPoint = 0, pattern = 0;
      for (var i = 0; i < 8; i++) {
        this.makeImpl(true, i);
        var lostPoint = QRCode.getLostPoint(this);
        if (i === 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }
      return pattern;
    },
    setupTimingPattern: function () {
      for (var r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] != null) continue;
        this.modules[r][6] = (r % 2 === 0);
      }
      for (var c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] != null) continue;
        this.modules[6][c] = (c % 2 === 0);
      }
    },
    setupPositionAdjustPattern: function () {
      var pos = QRCode.getPatternPosition(this.typeNumber);
      for (var i = 0; i < pos.length; i++) {
        for (var j = 0; j < pos.length; j++) {
          var row = pos[i], col = pos[j];
          if (this.modules[row][col] != null) continue;
          for (var r = -2; r <= 2; r++) {
            for (var c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    },
    setupTypeNumber: function (test) {
      var bits = QRCode.getBCHTypeNumber(this.typeNumber);
      for (var i = 0; i < 18; i++) {
        var mod = (!test && ((bits >> i) & 1) === 1);
        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    },
    setupTypeInfo: function (test, maskPattern) {
      var ecBits = [1, 0, 3, 2][this.errorCorrectionLevel] != null ? [1, 0, 3, 2][this.errorCorrectionLevel] : 1;
      var data = (ecBits << 3) | maskPattern;
      var bits = QRCode.getBCHTypeInfo(data);
      for (var i = 0; i < 15; i++) {
        var mod = (!test && ((bits >> i) & 1) === 1);
        if (i < 6) this.modules[i][8] = mod;
        else if (i < 8) this.modules[i + 1][8] = mod;
        else this.modules[this.moduleCount - 15 + i][8] = mod;
      }
      for (var i = 0; i < 15; i++) {
        var mod = (!test && ((bits >> i) & 1) === 1);
        if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
        else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
        else this.modules[8][15 - i - 1] = mod;
      }
      this.modules[this.moduleCount - 8][8] = (!test);
    },
    mapData: function (data, maskPattern) {
      var inc = -1, row = this.moduleCount - 1, bitIndex = 7, byteIndex = 0;
      var maskFunc = QRCode.getMaskFunction(maskPattern);
      for (var col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (var c = 0; c < 2; c++) {
            if (this.modules[row][col - c] == null) {
              var dark = false;
              if (byteIndex < data.length) dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
              var mask = maskFunc(row, col - c);
              if (mask) dark = !dark;
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex === -1) { byteIndex++; bitIndex = 7; }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc; inc = -inc; break;
          }
        }
      }
    }
  };

  QRCode.getPatternPosition = function (typeNumber) {
    var PATTERN_POSITION_TABLE = [
      [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
      [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
      [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66]
    ];
    return PATTERN_POSITION_TABLE[typeNumber - 1] || [];
  };

  QRCode.getMaskFunction = function (maskPattern) {
    switch (maskPattern) {
      case 0: return function (i, j) { return (i + j) % 2 === 0; };
      case 1: return function (i, j) { return i % 2 === 0; };
      case 2: return function (i, j) { return j % 3 === 0; };
      case 3: return function (i, j) { return (i + j) % 3 === 0; };
      case 4: return function (i, j) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0; };
      case 5: return function (i, j) { return (i * j) % 2 + (i * j) % 3 === 0; };
      case 6: return function (i, j) { return ((i * j) % 2 + (i * j) % 3) % 2 === 0; };
      case 7: return function (i, j) { return ((i * j) % 3 + (i + j) % 2) % 2 === 0; };
      default: throw new Error('mask:' + maskPattern);
    }
  };

  QRCode.getRSBlocks = function (typeNumber, errorCorrectionLevel) {
    var row = (typeNumber - 1) * 4 + errorCorrectionLevel;
    var raw = RS_BLOCK_TABLE[row] || [1, 26, 19];
    var list = [];
    var count = raw[0], total = raw[1], data = raw[2];
    for (var i = 0; i < count; i++) list.push({ totalCount: total, dataCount: data });
    if (raw.length > 3) {
      count = raw[3]; total = raw[4]; data = raw[5];
      for (var i = 0; i < count; i++) list.push({ totalCount: total, dataCount: data });
    }
    return list;
  };

  QRCode.createData = function (typeNumber, errorCorrectionLevel, dataList) {
    var rsBlocks = QRCode.getRSBlocks(typeNumber, errorCorrectionLevel);
    var buffer = new QRBitBuffer();
    for (var i = 0; i < dataList.length; i++) {
      var data = dataList[i];
      buffer.put(4, 4); // 8-bit
      buffer.put(data.length, QRCode.getLengthInBits(4, typeNumber));
      for (var j = 0; j < data.length; j++) buffer.put(data.charCodeAt(j), 8);
    }
    var totalDataCount = 0;
    for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
    if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error('Data overflow');
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
    while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false);
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) break;
      buffer.put(0xEC, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) break;
      buffer.put(0x11, 8);
    }
    return QRCode.createBytes(buffer, rsBlocks);
  };

  QRCode.createBytes = function (buffer, rsBlocks) {
    var offset = 0, maxDcCount = 0, maxEcCount = 0;
    var dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length);
    for (var r = 0; r < rsBlocks.length; r++) {
      var dcCount = rsBlocks[r].dataCount, ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      offset += dcCount;
      var rsPoly = QRCode.getErrorCorrectPolynomial(ecCount);
      var rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1);
      var modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (var i = 0; i < ecdata[r].length; i++) {
        var modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
      }
    }
    var totalCodeCount = 0;
    for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
    var data = new Array(totalCodeCount), index = 0;
    for (var i = 0; i < maxDcCount; i++) {
      for (var r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) data[index++] = dcdata[r][i];
      }
    }
    for (var i = 0; i < maxEcCount; i++) {
      for (var r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) data[index++] = ecdata[r][i];
      }
    }
    return data;
  };

  QRCode.getErrorCorrectPolynomial = function (errorCorrectLength) {
    var a = new Polynomial([1], 0);
    for (var i = 0; i < errorCorrectLength; i++) a = a.multiply(new Polynomial([1, gexp(i)], 0));
    return a;
  };

  QRCode.getLengthInBits = function (mode, type) {
    if (1 <= type && type < 10) return 8;
    return 16;
  };

  QRCode.getBCHTypeInfo = function (data) {
    var d = data << 10;
    while (QRCode.getBCHDigit(d) - QRCode.getBCHDigit(1335) >= 0) {
      d ^= (1335 << (QRCode.getBCHDigit(d) - QRCode.getBCHDigit(1335)));
    }
    return ((data << 10) | d) ^ 21522;
  };

  QRCode.getBCHTypeNumber = function (data) {
    var d = data << 12;
    while (QRCode.getBCHDigit(d) - QRCode.getBCHDigit(7973) >= 0) {
      d ^= (7973 << (QRCode.getBCHDigit(d) - QRCode.getBCHDigit(7973)));
    }
    return (data << 12) | d;
  };

  QRCode.getBCHDigit = function (data) {
    var digit = 0;
    while (data !== 0) { digit++; data >>>= 1; }
    return digit;
  };

  QRCode.getLostPoint = function (qrCode) {
    var moduleCount = qrCode.getModuleCount(), lostPoint = 0;
    for (var row = 0; row < moduleCount; row++) {
      for (var col = 0; col < moduleCount; col++) {
        var sameCount = 0, dark = qrCode.isDark(row, col);
        for (var r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) continue;
          for (var c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c || (r === 0 && c === 0)) continue;
            if (dark === qrCode.isDark(row + r, col + c)) sameCount++;
          }
        }
        if (sameCount > 5) lostPoint += (3 + sameCount - 5);
      }
    }
    return lostPoint;
  };

  function QRBitBuffer() {
    this.buffer = [];
    this.length = 0;
  }
  QRBitBuffer.prototype = {
    get: function (index) {
      var bufIndex = Math.floor(index / 8);
      return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1;
    },
    put: function (num, length) {
      for (var i = 0; i < length; i++) this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    },
    getLengthInBits: function () { return this.length; },
    putBit: function (bit) {
      var bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) this.buffer.push(0);
      if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
      this.length++;
    }
  };

  /**
   * رسم رمز الاستجابة السريعة على Canvas
   * @param {HTMLCanvasElement} canvas عنصر Canvas المستهدف
   * @param {string} text النص أو الرابط المراد تشفيره
   * @param {object} options خيارات الحجم والهامش والألوان
   */
  function drawToCanvas(canvas, text, options) {
    options = options || {};
    var size = options.size || 240;
    var margin = options.margin != null ? options.margin : 4;
    var darkColor = options.dark || '#0f1c30';
    var lightColor = options.light || '#ffffff';

    var qr = new QRCode(0, 0); // Auto-size, error correction level L
    qr.addData(text);
    qr.make();

    var count = qr.getModuleCount();
    var moduleSize = (size - margin * 2) / count;

    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = lightColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = darkColor;
    for (var row = 0; row < count; row++) {
      for (var col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          var x = Math.round(margin + col * moduleSize);
          var y = Math.round(margin + row * moduleSize);
          var w = Math.ceil((col + 1) * moduleSize) - Math.floor(col * moduleSize);
          var h = Math.ceil((row + 1) * moduleSize) - Math.floor(row * moduleSize);
          ctx.fillRect(x, y, w, h);
        }
      }
    }
  }

  return {
    drawToCanvas: drawToCanvas
  };
}));
