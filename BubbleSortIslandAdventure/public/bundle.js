(function () {
  'use strict';

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /*! (c) Andrea Giammarchi - ISC */
  var self = undefined || /* istanbul ignore next */ {};
  try { self.WeakMap = WeakMap; }
  catch (WeakMap) {
    // this could be better but 90% of the time
    // it's everything developers need as fallback
    self.WeakMap = (function (id, Object) {    var dP = Object.defineProperty;
      var hOP = Object.hasOwnProperty;
      var proto = WeakMap.prototype;
      proto.delete = function (key) {
        return this.has(key) && delete key[this._];
      };
      proto.get = function (key) {
        return this.has(key) ? key[this._] : void 0;
      };
      proto.has = function (key) {
        return hOP.call(key, this._);
      };
      proto.set = function (key, value) {
        dP(key, this._, {configurable: true, value: value});
        return this;
      };
      return WeakMap;
      function WeakMap(iterable) {
        dP(this, '_', {value: '_@ungap/weakmap' + id++});
        if (iterable)
          iterable.forEach(add, this);
      }
      function add(pair) {
        this.set(pair[0], pair[1]);
      }
    }(Math.random(), Object));
  }
  var WeakMap$1 = self.WeakMap;

  /*! (c) Andrea Giammarchi - ISC */
  var templateLiteral = (function () {  var RAW = 'raw';
    var isNoOp = typeof document !== 'object';
    var templateLiteral = function (tl) {
      if (
        // for badly transpiled literals
        !(RAW in tl) ||
        // for some version of TypeScript
        tl.propertyIsEnumerable(RAW) ||
        // and some other version of TypeScript
        !Object.isFrozen(tl[RAW]) ||
        (
          // or for Firefox < 55
          /Firefox\/(\d+)/.test(
            (document.defaultView.navigator || {}).userAgent
          ) &&
          parseFloat(RegExp.$1) < 55
        )
      ) {
        var forever = {};
        templateLiteral = function (tl) {
          for (var key = '.', i = 0; i < tl.length; i++)
            key += tl[i].length + '.' + tl[i];
          return forever[key] || (forever[key] = tl);
        };
      } else {
        isNoOp = true;
      }
      return TL(tl);
    };
    return TL;
    function TL(tl) {
      return isNoOp ? tl : templateLiteral(tl);
    }
  }());

  function tta (template) {
    var length = arguments.length;
    var args = [templateLiteral(template)];
    var i = 1;
    while (i < length)
      args.push(arguments[i++]);
    return args;
  }

  /*! (c) Andrea Giammarchi - ISC */
  var Wire = (function (slice, proto) {

    proto = Wire.prototype;

    proto.ELEMENT_NODE = 1;
    proto.nodeType = 111;

    proto.remove = function (keepFirst) {
      var childNodes = this.childNodes;
      var first = this.firstChild;
      var last = this.lastChild;
      this._ = null;
      if (keepFirst && childNodes.length === 2) {
        last.parentNode.removeChild(last);
      } else {
        var range = this.ownerDocument.createRange();
        range.setStartBefore(keepFirst ? childNodes[1] : first);
        range.setEndAfter(last);
        range.deleteContents();
      }
      return first;
    };

    proto.valueOf = function (forceAppend) {
      var fragment = this._;
      var noFragment = fragment == null;
      if (noFragment)
        fragment = (this._ = this.ownerDocument.createDocumentFragment());
      if (noFragment || forceAppend) {
        for (var n = this.childNodes, i = 0, l = n.length; i < l; i++)
          fragment.appendChild(n[i]);
      }
      return fragment;
    };

    return Wire;

    function Wire(childNodes) {
      var nodes = (this.childNodes = slice.call(childNodes, 0));
      this.firstChild = nodes[0];
      this.lastChild = nodes[nodes.length - 1];
      this.ownerDocument = nodes[0].ownerDocument;
      this._ = null;
    }

  }([].slice));

  const {isArray} = Array;
  const wireType = Wire.prototype.nodeType;

  /*! (c) Andrea Giammarchi - ISC */
  var createContent = (function (document) {  var FRAGMENT = 'fragment';
    var TEMPLATE = 'template';
    var HAS_CONTENT = 'content' in create(TEMPLATE);

    var createHTML = HAS_CONTENT ?
      function (html) {
        var template = create(TEMPLATE);
        template.innerHTML = html;
        return template.content;
      } :
      function (html) {
        var content = create(FRAGMENT);
        var template = create(TEMPLATE);
        var childNodes = null;
        if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
          var selector = RegExp.$1;
          template.innerHTML = '<table>' + html + '</table>';
          childNodes = template.querySelectorAll(selector);
        } else {
          template.innerHTML = html;
          childNodes = template.childNodes;
        }
        append(content, childNodes);
        return content;
      };

    return function createContent(markup, type) {
      return (type === 'svg' ? createSVG : createHTML)(markup);
    };

    function append(root, childNodes) {
      var length = childNodes.length;
      while (length--)
        root.appendChild(childNodes[0]);
    }

    function create(element) {
      return element === FRAGMENT ?
        document.createDocumentFragment() :
        document.createElementNS('http://www.w3.org/1999/xhtml', element);
    }

    // it could use createElementNS when hasNode is there
    // but this fallback is equally fast and easier to maintain
    // it is also battle tested already in all IE
    function createSVG(svg) {
      var content = create(FRAGMENT);
      var template = create('div');
      template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
      append(content, template.firstChild.childNodes);
      return content;
    }

  }(document));

  /*! (c) Andrea Giammarchi - ISC */
  var self$1 = undefined || /* istanbul ignore next */ {};
  try { self$1.Map = Map; }
  catch (Map) {
    self$1.Map = function Map() {
      var i = 0;
      var k = [];
      var v = [];
      return {
        delete: function (key) {
          var had = contains(key);
          if (had) {
            k.splice(i, 1);
            v.splice(i, 1);
          }
          return had;
        },
        get: function get(key) {
          return contains(key) ? v[i] : void 0;
        },
        has: function has(key) {
          return contains(key);
        },
        set: function set(key, value) {
          v[contains(key) ? i : (k.push(key) - 1)] = value;
          return this;
        }
      };
      function contains(v) {
        i = k.indexOf(v);
        return -1 < i;
      }
    };
  }
  var Map$1 = self$1.Map;

  const append = (get, parent, children, start, end, before) => {
    if ((end - start) < 2)
      parent.insertBefore(get(children[start], 1), before);
    else {
      const fragment = parent.ownerDocument.createDocumentFragment();
      while (start < end)
        fragment.appendChild(get(children[start++], 1));
      parent.insertBefore(fragment, before);
    }
  };

  const eqeq = (a, b) => a == b;

  const identity = O => O;

  const indexOf = (
    moreNodes,
    moreStart,
    moreEnd,
    lessNodes,
    lessStart,
    lessEnd,
    compare
  ) => {
    const length = lessEnd - lessStart;
    /* istanbul ignore if */
    if (length < 1)
      return -1;
    while ((moreEnd - moreStart) >= length) {
      let m = moreStart;
      let l = lessStart;
      while (
        m < moreEnd &&
        l < lessEnd &&
        compare(moreNodes[m], lessNodes[l])
      ) {
        m++;
        l++;
      }
      if (l === lessEnd)
        return moreStart;
      moreStart = m + 1;
    }
    return -1;
  };

  const isReversed = (
    futureNodes,
    futureEnd,
    currentNodes,
    currentStart,
    currentEnd,
    compare
  ) => {
    while (
      currentStart < currentEnd &&
      compare(
        currentNodes[currentStart],
        futureNodes[futureEnd - 1]
      )) {
        currentStart++;
        futureEnd--;
      }  return futureEnd === 0;
  };

  const next = (get, list, i, length, before) => i < length ?
                get(list[i], 0) :
                (0 < i ?
                  get(list[i - 1], -0).nextSibling :
                  before);

  const remove = (get, parent, children, start, end) => {
    if ((end - start) < 2)
      parent.removeChild(get(children[start], -1));
    else {
      const range = parent.ownerDocument.createRange();
      range.setStartBefore(get(children[start], -1));
      range.setEndAfter(get(children[end - 1], -1));
      range.deleteContents();
    }
  };

  // - - - - - - - - - - - - - - - - - - -
  // diff related constants and utilities
  // - - - - - - - - - - - - - - - - - - -

  const DELETION = -1;
  const INSERTION = 1;
  const SKIP = 0;
  const SKIP_OND = 50;

  const HS = (
    futureNodes,
    futureStart,
    futureEnd,
    futureChanges,
    currentNodes,
    currentStart,
    currentEnd,
    currentChanges
  ) => {

    let k = 0;
    /* istanbul ignore next */
    let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
    const link = Array(minLen++);
    const tresh = Array(minLen);
    tresh[0] = -1;

    for (let i = 1; i < minLen; i++)
      tresh[i] = currentEnd;

    const keymap = new Map$1;
    for (let i = currentStart; i < currentEnd; i++)
      keymap.set(currentNodes[i], i);

    for (let i = futureStart; i < futureEnd; i++) {
      const idxInOld = keymap.get(futureNodes[i]);
      if (idxInOld != null) {
        k = findK(tresh, minLen, idxInOld);
        /* istanbul ignore else */
        if (-1 < k) {
          tresh[k] = idxInOld;
          link[k] = {
            newi: i,
            oldi: idxInOld,
            prev: link[k - 1]
          };
        }
      }
    }

    k = --minLen;
    --currentEnd;
    while (tresh[k] > currentEnd) --k;

    minLen = currentChanges + futureChanges - k;
    const diff = Array(minLen);
    let ptr = link[k];
    --futureEnd;
    while (ptr) {
      const {newi, oldi} = ptr;
      while (futureEnd > newi) {
        diff[--minLen] = INSERTION;
        --futureEnd;
      }
      while (currentEnd > oldi) {
        diff[--minLen] = DELETION;
        --currentEnd;
      }
      diff[--minLen] = SKIP;
      --futureEnd;
      --currentEnd;
      ptr = ptr.prev;
    }
    while (futureEnd >= futureStart) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }
    while (currentEnd >= currentStart) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }
    return diff;
  };

  // this is pretty much the same petit-dom code without the delete map part
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561
  const OND = (
    futureNodes,
    futureStart,
    rows,
    currentNodes,
    currentStart,
    cols,
    compare
  ) => {
    const length = rows + cols;
    const v = [];
    let d, k, r, c, pv, cv, pd;
    outer: for (d = 0; d <= length; d++) {
      /* istanbul ignore if */
      if (d > SKIP_OND)
        return null;
      pd = d - 1;
      /* istanbul ignore next */
      pv = d ? v[d - 1] : [0, 0];
      cv = v[d] = [];
      for (k = -d; k <= d; k += 2) {
        if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
          c = pv[pd + k + 1];
        } else {
          c = pv[pd + k - 1] + 1;
        }
        r = c - k;
        while (
          c < cols &&
          r < rows &&
          compare(
            currentNodes[currentStart + c],
            futureNodes[futureStart + r]
          )
        ) {
          c++;
          r++;
        }
        if (c === cols && r === rows) {
          break outer;
        }
        cv[d + k] = c;
      }
    }

    const diff = Array(d / 2 + length / 2);
    let diffIdx = diff.length - 1;
    for (d = v.length - 1; d >= 0; d--) {
      while (
        c > 0 &&
        r > 0 &&
        compare(
          currentNodes[currentStart + c - 1],
          futureNodes[futureStart + r - 1]
        )
      ) {
        // diagonal edge = equality
        diff[diffIdx--] = SKIP;
        c--;
        r--;
      }
      if (!d)
        break;
      pd = d - 1;
      /* istanbul ignore next */
      pv = d ? v[d - 1] : [0, 0];
      k = c - r;
      if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
        // vertical edge = insertion
        r--;
        diff[diffIdx--] = INSERTION;
      } else {
        // horizontal edge = deletion
        c--;
        diff[diffIdx--] = DELETION;
      }
    }
    return diff;
  };

  const applyDiff = (
    diff,
    get,
    parentNode,
    futureNodes,
    futureStart,
    currentNodes,
    currentStart,
    currentLength,
    before
  ) => {
    const live = new Map$1;
    const length = diff.length;
    let currentIndex = currentStart;
    let i = 0;
    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          futureStart++;
          currentIndex++;
          break;
        case INSERTION:
          // TODO: bulk appends for sequential nodes
          live.set(futureNodes[futureStart], 1);
          append(
            get,
            parentNode,
            futureNodes,
            futureStart++,
            futureStart,
            currentIndex < currentLength ?
              get(currentNodes[currentIndex], 0) :
              before
          );
          break;
        case DELETION:
          currentIndex++;
          break;
      }
    }
    i = 0;
    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          currentStart++;
          break;
        case DELETION:
          // TODO: bulk removes for sequential nodes
          if (live.has(currentNodes[currentStart]))
            currentStart++;
          else
            remove(
              get,
              parentNode,
              currentNodes,
              currentStart++,
              currentStart
            );
          break;
      }
    }
  };

  const findK = (ktr, length, j) => {
    let lo = 1;
    let hi = length;
    while (lo < hi) {
      const mid = ((lo + hi) / 2) >>> 0;
      if (j < ktr[mid])
        hi = mid;
      else
        lo = mid + 1;
    }
    return lo;
  };

  const smartDiff = (
    get,
    parentNode,
    futureNodes,
    futureStart,
    futureEnd,
    futureChanges,
    currentNodes,
    currentStart,
    currentEnd,
    currentChanges,
    currentLength,
    compare,
    before
  ) => {
    applyDiff(
      OND(
        futureNodes,
        futureStart,
        futureChanges,
        currentNodes,
        currentStart,
        currentChanges,
        compare
      ) ||
      HS(
        futureNodes,
        futureStart,
        futureEnd,
        futureChanges,
        currentNodes,
        currentStart,
        currentEnd,
        currentChanges
      ),
      get,
      parentNode,
      futureNodes,
      futureStart,
      currentNodes,
      currentStart,
      currentLength,
      before
    );
  };

  /*! (c) 2018 Andrea Giammarchi (ISC) */

  const domdiff = (
    parentNode,     // where changes happen
    currentNodes,   // Array of current items/nodes
    futureNodes,    // Array of future items/nodes
    options         // optional object with one of the following properties
                    //  before: domNode
                    //  compare(generic, generic) => true if same generic
                    //  node(generic) => Node
  ) => {
    if (!options)
      options = {};

    const compare = options.compare || eqeq;
    const get = options.node || identity;
    const before = options.before == null ? null : get(options.before, 0);

    const currentLength = currentNodes.length;
    let currentEnd = currentLength;
    let currentStart = 0;

    let futureEnd = futureNodes.length;
    let futureStart = 0;

    // common prefix
    while (
      currentStart < currentEnd &&
      futureStart < futureEnd &&
      compare(currentNodes[currentStart], futureNodes[futureStart])
    ) {
      currentStart++;
      futureStart++;
    }

    // common suffix
    while (
      currentStart < currentEnd &&
      futureStart < futureEnd &&
      compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])
    ) {
      currentEnd--;
      futureEnd--;
    }

    const currentSame = currentStart === currentEnd;
    const futureSame = futureStart === futureEnd;

    // same list
    if (currentSame && futureSame)
      return futureNodes;

    // only stuff to add
    if (currentSame && futureStart < futureEnd) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        next(get, currentNodes, currentStart, currentLength, before)
      );
      return futureNodes;
    }

    // only stuff to remove
    if (futureSame && currentStart < currentEnd) {
      remove(
        get,
        parentNode,
        currentNodes,
        currentStart,
        currentEnd
      );
      return futureNodes;
    }

    const currentChanges = currentEnd - currentStart;
    const futureChanges = futureEnd - futureStart;
    let i = -1;

    // 2 simple indels: the shortest sequence is a subsequence of the longest
    if (currentChanges < futureChanges) {
      i = indexOf(
        futureNodes,
        futureStart,
        futureEnd,
        currentNodes,
        currentStart,
        currentEnd,
        compare
      );
      // inner diff
      if (-1 < i) {
        append(
          get,
          parentNode,
          futureNodes,
          futureStart,
          i,
          get(currentNodes[currentStart], 0)
        );
        append(
          get,
          parentNode,
          futureNodes,
          i + currentChanges,
          futureEnd,
          next(get, currentNodes, currentEnd, currentLength, before)
        );
        return futureNodes;
      }
    }
    /* istanbul ignore else */
    else if (futureChanges < currentChanges) {
      i = indexOf(
        currentNodes,
        currentStart,
        currentEnd,
        futureNodes,
        futureStart,
        futureEnd,
        compare
      );
      // outer diff
      if (-1 < i) {
        remove(
          get,
          parentNode,
          currentNodes,
          currentStart,
          i
        );
        remove(
          get,
          parentNode,
          currentNodes,
          i + futureChanges,
          currentEnd
        );
        return futureNodes;
      }
    }

    // common case with one replacement for many nodes
    // or many nodes replaced for a single one
    /* istanbul ignore else */
    if ((currentChanges < 2 || futureChanges < 2)) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        get(currentNodes[currentStart], 0)
      );
      remove(
        get,
        parentNode,
        currentNodes,
        currentStart,
        currentEnd
      );
      return futureNodes;
    }

    // the half match diff part has been skipped in petit-dom
    // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
    // accordingly, I think it's safe to skip in here too
    // if one day it'll come out like the speediest thing ever to do
    // then I might add it in here too

    // Extra: before going too fancy, what about reversed lists ?
    //        This should bail out pretty quickly if that's not the case.
    if (
      currentChanges === futureChanges &&
      isReversed(
        futureNodes,
        futureEnd,
        currentNodes,
        currentStart,
        currentEnd,
        compare
      )
    ) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        next(get, currentNodes, currentEnd, currentLength, before)
      );
      return futureNodes;
    }

    // last resort through a smart diff
    smartDiff(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      futureChanges,
      currentNodes,
      currentStart,
      currentEnd,
      currentChanges,
      currentLength,
      compare,
      before
    );

    return futureNodes;
  };

  /*! (c) Andrea Giammarchi - ISC */
  var importNode = (function (
    document,
    appendChild,
    cloneNode,
    createTextNode,
    importNode
  ) {
    var native = importNode in document;
    // IE 11 has problems with cloning templates:
    // it "forgets" empty childNodes. This feature-detects that.
    var fragment = document.createDocumentFragment();
    fragment[appendChild](document[createTextNode]('g'));
    fragment[appendChild](document[createTextNode](''));
    var content = native ?
      document[importNode](fragment, true) :
      fragment[cloneNode](true);
    return content.childNodes.length < 2 ?
      function importNode(node, deep) {
        var clone = node[cloneNode]();
        for (var
          childNodes = node.childNodes || [],
          length = childNodes.length,
          i = 0; deep && i < length; i++
        ) {
          clone[appendChild](importNode(childNodes[i], deep));
        }
        return clone;
      } :
      (native ?
        document[importNode] :
        function (node, deep) {
          return node[cloneNode](!!deep);
        }
      );
  }(
    document,
    'appendChild',
    'cloneNode',
    'createTextNode',
    'importNode'
  ));

  var trim = ''.trim || function () {
    return String(this).replace(/^\s+|\s+/g, '');
  };

  // Custom
  var UID = '-' + Math.random().toFixed(6) + '%';
  //                           Edge issue!
  if (!(function (template, content, tabindex) {
    return content in template && (
      (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>'),
      template[content].childNodes[0].getAttribute(tabindex) == UID
    );
  }(document.createElement('template'), 'content', 'tabindex'))) {
    UID = '_dt: ' + UID.slice(1, -1) + ';';
  }
  var UIDC = '<!--' + UID + '-->';

  // DOM
  var COMMENT_NODE = 8;
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;

  var SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
  var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

  function sanitize (template) {
    return template.join(UIDC)
            .replace(selfClosing, fullClosing)
            .replace(attrSeeker, attrReplacer);
  }

  var spaces = ' \\f\\n\\r\\t';
  var almostEverything = '[^ ' + spaces + '\\/>"\'=]+';
  var attrName = '[ ' + spaces + ']+' + almostEverything;
  var tagName = '<([A-Za-z]+[A-Za-z0-9:_-]*)((?:';
  var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything + '))?)';

  var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([ ' + spaces + ']*/?>)', 'g');
  var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([ ' + spaces + ']*/>)', 'g');
  var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + UIDC + '\\2', 'gi');

  function attrReplacer($0, $1, $2, $3) {
    return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
  }

  function replaceAttributes($0, $1, $2) {
    return $1 + ($2 || '"') + UID + ($2 || '"');
  }

  function fullClosing($0, $1, $2) {
    return VOID_ELEMENTS.test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
  }

  function create(type, node, path, name) {
    return {name: name, node: node, path: path, type: type};
  }

  function find(node, path) {
    var length = path.length;
    var i = 0;
    while (i < length)
      node = node.childNodes[path[i++]];
    return node;
  }

  function parse(node, holes, parts, path) {
    var childNodes = node.childNodes;
    var length = childNodes.length;
    var i = 0;
    while (i < length) {
      var child = childNodes[i];
      switch (child.nodeType) {
        case ELEMENT_NODE:
          var childPath = path.concat(i);
          parseAttributes(child, holes, parts, childPath);
          parse(child, holes, parts, childPath);
          break;
        case COMMENT_NODE:
          if (child.textContent === UID) {
            parts.shift();
            holes.push(
              // basicHTML or other non standard engines
              // might end up having comments in nodes
              // where they shouldn't, hence this check.
              SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ?
                create('text', node, path) :
                create('any', child, path.concat(i))
            );
          }
          break;
        case TEXT_NODE:
          // the following ignore is actually covered by browsers
          // only basicHTML ends up on previous COMMENT_NODE case
          // instead of TEXT_NODE because it knows nothing about
          // special style or textarea behavior
          /* istanbul ignore if */
          if (
            SHOULD_USE_TEXT_CONTENT.test(node.nodeName) &&
            trim.call(child.textContent) === UIDC
          ) {
            parts.shift();
            holes.push(create('text', node, path));
          }
          break;
      }
      i++;
    }
  }

  function parseAttributes(node, holes, parts, path) {
    var cache = new Map$1;
    var attributes = node.attributes;
    var remove = [];
    var array = remove.slice.call(attributes, 0);
    var length = array.length;
    var i = 0;
    while (i < length) {
      var attribute = array[i++];
      if (attribute.value === UID) {
        var name = attribute.name;
        // the following ignore is covered by IE
        // and the IE9 double viewBox test
        /* istanbul ignore else */
        if (!cache.has(name)) {
          var realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)\s*=\s*['"]?$/, '$1');
          var value = attributes[realName] ||
                        // the following ignore is covered by browsers
                        // while basicHTML is already case-sensitive
                        /* istanbul ignore next */
                        attributes[realName.toLowerCase()];
          cache.set(name, value);
          holes.push(create('attr', value, path, realName));
        }
        remove.push(attribute);
      }
    }
    length = remove.length;
    i = 0;
    while (i < length) {
      // Edge HTML bug #16878726
      var attr = remove[i++];
      if (/^id$/i.test(attr.name))
        node.removeAttribute(attr.name);
      // standard browsers would work just fine here
      else
        node.removeAttributeNode(attr);
    }

    // This is a very specific Firefox/Safari issue
    // but since it should be a not so common pattern,
    // it's probably worth patching regardless.
    // Basically, scripts created through strings are death.
    // You need to create fresh new scripts instead.
    // TODO: is there any other node that needs such nonsense?
    var nodeName = node.nodeName;
    if (/^script$/i.test(nodeName)) {
      // this used to be like that
      // var script = createElement(node, nodeName);
      // then Edge arrived and decided that scripts created
      // through template documents aren't worth executing
      // so it became this ... hopefully it won't hurt in the wild
      var script = document.createElement(nodeName);
      length = attributes.length;
      i = 0;
      while (i < length)
        script.setAttributeNode(attributes[i++].cloneNode(true));
      script.textContent = node.textContent;
      node.parentNode.replaceChild(script, node);
    }
  }

  // globals

  var parsed = new WeakMap$1;
  var referenced = new WeakMap$1;

  function createInfo(options, template) {
    var markup = sanitize(template);
    var transform = options.transform;
    if (transform)
      markup = transform(markup);
    var content = createContent(markup, options.type);
    cleanContent(content);
    var holes = [];
    parse(content, holes, template.slice(0), []);
    var info = {
      content: content,
      updates: function (content) {
        var callbacks = [];
        var len = holes.length;
        var i = 0;
        while (i < len) {
          var info = holes[i++];
          var node = find(content, info.path);
          switch (info.type) {
            case 'any':
              callbacks.push(options.any(node, []));
              break;
            case 'attr':
              callbacks.push(options.attribute(node, info.name, info.node));
              break;
            case 'text':
              callbacks.push(options.text(node));
              node.textContent = '';
              break;
          }
        }
        return function () {
          var length = arguments.length;
          var values = length - 1;
          var i = 1;
          if (len !== values) {
            throw new Error(
              values + ' values instead of ' + len + '\n' +
              template.join(', ')
            );
          }
          while (i < length)
            callbacks[i - 1](arguments[i++]);
          return content;
        };
      }
    };
    parsed.set(template, info);
    return info;
  }

  function createDetails(options, template) {
    var info = parsed.get(template) || createInfo(options, template);
    var content = importNode.call(document, info.content, true);
    var details = {
      content: content,
      template: template,
      updates: info.updates(content)
    };
    referenced.set(options, details);
    return details;
  }

  function domtagger(options) {
    return function (template) {
      var details = referenced.get(options);
      if (details == null || details.template !== template)
        details = createDetails(options, template);
      details.updates.apply(null, arguments);
      return details.content;
    };
  }

  function cleanContent(fragment) {
    var childNodes = fragment.childNodes;
    var i = childNodes.length;
    while (i--) {
      var child = childNodes[i];
      if (
        child.nodeType !== 1 &&
        trim.call(child.textContent).length === 0
      ) {
        fragment.removeChild(child);
      }
    }
  }

  /*! (c) Andrea Giammarchi - ISC */
  var hyperStyle = (function (){  // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js
    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    var hyphen = /([^A-Z])([A-Z]+)/g;
    return function hyperStyle(node, original) {
      return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
    };
    function ized($0, $1, $2) {
      return $1 + '-' + $2.toLowerCase();
    }
    function svg(node, original) {
      var style;
      if (original)
        style = original.cloneNode(true);
      else {
        node.setAttribute('style', '--hyper:style;');
        style = node.getAttributeNode('style');
      }
      style.value = '';
      node.setAttributeNode(style);
      return update(style, true);
    }
    function toStyle(object) {
      var key, css = [];
      for (key in object)
        css.push(key.replace(hyphen, ized), ':', object[key], ';');
      return css.join('');
    }
    function update(style, isSVG) {
      var oldType, oldValue;
      return function (newValue) {
        var info, key, styleValue, value;
        switch (typeof newValue) {
          case 'object':
            if (newValue) {
              if (oldType === 'object') {
                if (!isSVG) {
                  if (oldValue !== newValue) {
                    for (key in oldValue) {
                      if (!(key in newValue)) {
                        style[key] = '';
                      }
                    }
                  }
                }
              } else {
                if (isSVG)
                  style.value = '';
                else
                  style.cssText = '';
              }
              info = isSVG ? {} : style;
              for (key in newValue) {
                value = newValue[key];
                styleValue = typeof value === 'number' &&
                                    !IS_NON_DIMENSIONAL.test(key) ?
                                    (value + 'px') : value;
                if (!isSVG && /^--/.test(key))
                  info.setProperty(key, styleValue);
                else
                  info[key] = styleValue;
              }
              oldType = 'object';
              if (isSVG)
                style.value = toStyle((oldValue = info));
              else
                oldValue = newValue;
              break;
            }
          default:
            if (oldValue != newValue) {
              oldType = 'string';
              oldValue = newValue;
              if (isSVG)
                style.value = newValue || '';
              else
                style.cssText = newValue || '';
            }
            break;
        }
      };
    }
  }());

  const OWNER_SVG_ELEMENT = 'ownerSVGElement';

  // returns nodes from wires and components
  const asNode = (item, i) => item.nodeType === wireType ?
    (
      (1 / i) < 0 ?
        (i ? item.remove(true) : item.lastChild) :
        (i ? item.valueOf(true) : item.firstChild)
    ) :
    item
  ;

  // returns true if domdiff can handle the value
  const canDiff = value => 'ELEMENT_NODE' in value;

  // generic attributes helpers
  const hyperAttribute = (node, original) => {
    let oldValue;
    let owner = false;
    const attribute = original.cloneNode(true);
    return newValue => {
      if (oldValue !== newValue) {
        oldValue = newValue;
        if (attribute.value !== newValue) {
          if (newValue == null) {
            if (owner) {
              owner = false;
              node.removeAttributeNode(attribute);
            }
            attribute.value = newValue;
          } else {
            attribute.value = newValue;
            if (!owner) {
              owner = true;
              node.setAttributeNode(attribute);
            }
          }
        }
      }
    };
  };

  // events attributes helpers
  const hyperEvent = (node, name) => {
    let oldValue;
    let type = name.slice(2);
    if (name.toLowerCase() in node)
      type = type.toLowerCase();
    return newValue => {
      if (oldValue !== newValue) {
        if (oldValue)
          node.removeEventListener(type, oldValue, false);
        oldValue = newValue;
        if (newValue)
          node.addEventListener(type, newValue, false);
      }
    };
  };

  // special attributes helpers
  const hyperProperty = (node, name) => {
    let oldValue;
    return newValue => {
      if (oldValue !== newValue) {
        oldValue = newValue;
        if (node[name] !== newValue) {
          node[name] = newValue;
          if (newValue == null) {
            node.removeAttribute(name);
          }
        }
      }
    };
  };

  // special hooks helpers
  const hyperRef = node => {
    return ref => {
      ref.current = node;
    };
  };

  // list of attributes that should not be directly assigned
  const readOnly = /^(?:form|list)$/i;

  // reused every slice time
  const slice = [].slice;

  // simplifies text node creation
  const text = (node, text) => node.ownerDocument.createTextNode(text);

  function Tagger(type) {
    this.type = type;
    return domtagger(this);
  }

  Tagger.prototype = {

    // there are four kind of attributes, and related behavior:
    //  * events, with a name starting with `on`, to add/remove event listeners
    //  * special, with a name present in their inherited prototype, accessed directly
    //  * regular, accessed through get/setAttribute standard DOM methods
    //  * style, the only regular attribute that also accepts an object as value
    //    so that you can style=${{width: 120}}. In this case, the behavior has been
    //    fully inspired by Preact library and its simplicity.
    attribute(node, name, original) {
      switch (name) {
        case 'class':
          if (OWNER_SVG_ELEMENT in node)
            return hyperAttribute(node, original);
          name = 'className';
        case 'data':
        case 'props':
          return hyperProperty(node, name);
        case 'style':
          return hyperStyle(node, original, OWNER_SVG_ELEMENT in node);
        case 'ref':
          return hyperRef(node);
        default:
          if (name.slice(0, 2) === 'on')
            return hyperEvent(node, name);
          if (name in node && !(
            OWNER_SVG_ELEMENT in node || readOnly.test(name)
          ))
            return hyperProperty(node, name);
          return hyperAttribute(node, original);

      }
    },

    // in a hyper(node)`<div>${content}</div>` case
    // everything could happen:
    //  * it's a JS primitive, stored as text
    //  * it's null or undefined, the node should be cleaned
    //  * it's a promise, update the content once resolved
    //  * it's an explicit intent, perform the desired operation
    //  * it's an Array, resolve all values if Promises and/or
    //    update the node with the resulting list of content
    any(node, childNodes) {
      const diffOptions = {node: asNode, before: node};
      const nodeType = OWNER_SVG_ELEMENT in node ? /* istanbul ignore next */ 'svg' : 'html';
      let fastPath = false;
      let oldValue;
      const anyContent = value => {
        switch (typeof value) {
          case 'string':
          case 'number':
          case 'boolean':
            if (fastPath) {
              if (oldValue !== value) {
                oldValue = value;
                childNodes[0].textContent = value;
              }
            } else {
              fastPath = true;
              oldValue = value;
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                [text(node, value)],
                diffOptions
              );
            }
            break;
          case 'function':
            anyContent(value(node));
            break;
          case 'object':
          case 'undefined':
            if (value == null) {
              fastPath = false;
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                [],
                diffOptions
              );
              break;
            }
          default:
            fastPath = false;
            oldValue = value;
            if (isArray(value)) {
              if (value.length === 0) {
                if (childNodes.length) {
                  childNodes = domdiff(
                    node.parentNode,
                    childNodes,
                    [],
                    diffOptions
                  );
                }
              } else {
                switch (typeof value[0]) {
                  case 'string':
                  case 'number':
                  case 'boolean':
                    anyContent(String(value));
                    break;
                  case 'function':
                    anyContent(value.map(invoke, node));
                    break;
                  case 'object':
                    if (isArray(value[0])) {
                      value = value.concat.apply([], value);
                    }
                  default:
                    childNodes = domdiff(
                      node.parentNode,
                      childNodes,
                      value,
                      diffOptions
                    );
                    break;
                }
              }
            } else if (canDiff(value)) {
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                value.nodeType === 11 ?
                  slice.call(value.childNodes) :
                  [value],
                diffOptions
              );
            } else if ('text' in value) {
              anyContent(String(value.text));
            } else if ('any' in value) {
              anyContent(value.any);
            } else if ('html' in value) {
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                slice.call(
                  createContent(
                    [].concat(value.html).join(''),
                    nodeType
                  ).childNodes
                ),
                diffOptions
              );
            } else if ('length' in value) {
              anyContent(slice.call(value));
            }
            break;
        }
      };
      return anyContent;
    },

    // style or textareas don't accept HTML as content
    // it's pointless to transform or analyze anything
    // different from text there but it's worth checking
    // for possible defined intents.
    text(node) {
      let oldValue;
      const textContent = value => {
        if (oldValue !== value) {
          oldValue = value;
          const type = typeof value;
          if (type === 'object' && value) {
            if ('text' in value) {
              textContent(String(value.text));
            } else if ('any' in value) {
              textContent(value.any);
            } else if ('html' in value) {
              textContent([].concat(value.html).join(''));
            } else if ('length' in value) {
              textContent(slice.call(value).join(''));
            }
          } else if (type === 'function') {
            textContent(value(node));
          } else {
            node.textContent = value == null ? '' : value;
          }
        }
      };
      return textContent;
    }
  };

  function invoke(callback) {
    return callback(this);
  }

  const wm = new WeakMap$1;
  const container = new WeakMap$1;

  let current = null;

  // generic content render
  function render(node, callback) {
    const value = update.call(this, node, callback);
    if (container.get(node) !== value) {
      container.set(node, value);
      appendClean(node, value);
    }
    return node;
  }

  // keyed render via render(node, () => html`...`)
  // non keyed renders in the wild via html`...`
  const html = outer('html');
  const svg = outer('svg');

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function appendClean(node, fragment) {
    node.textContent = '';
    node.appendChild(fragment);
  }

  function asNode$1(result, forceFragment) {
    return result.nodeType === wireType ?
      result.valueOf(forceFragment) :
      result;
  }

  function outer(type) {
    const wm = new WeakMap$1;
    tag.for = (identity, id) => {
      const ref = wm.get(identity) || set(identity);
      if (id == null)
        id = '$';
      return ref[id] || create(ref, id);
    };
    return tag;
    function create(ref, id) {
      let wire = null;
      const $ = new Tagger(type);
      return (ref[id] = function () {
        const result = $.apply(null, tta.apply(null, arguments));
        return wire || (wire = wiredContent(result));
      });
    }
    function set(identity) {
      const ref = {'$': null};
      wm.set(identity, ref);
      return ref;
    }
    function tag() {
      const args = tta.apply(null, arguments);
      return current ?
        new Hole(type, args) :
        new Tagger(type).apply(null, args);
    }
  }

  function set(node) {
    const info = {
      i: 0, length: 0,
      stack: [],
      update: false
    };
    wm.set(node, info);
    return info;
  }

  function update(reference, callback) {
    const prev = current;
    current = wm.get(reference) || set(reference);
    current.i = 0;
    const ret = callback.call(this);
    let value;
    if (ret instanceof Hole) {
      value = asNode$1(unroll(ret, 0), current.update);
      const {i, length, stack, update} = current;
      if (i < length)
        stack.splice(current.length = i);
      if (update)
        current.update = false;
    } else {
      value = asNode$1(ret, false);
    }
    current = prev;
    return value;
  }

  function unroll(hole, level) {
    const {i, length, stack} = current;
    const {type, args} = hole;
    const stacked = i < length;
    current.i++;
    if (!stacked)
      current.length = stack.push({
        l: level,
        kind: type,
        tag: null,
        tpl: args[0],
        wire: null
      });
    unrollArray(args, 1, level + 1);
    const info = stack[i];
    if (stacked) {
      const {l:control, kind, tag, tpl, wire} = info;
      if (control === level && type === kind && tpl === args[0]) {
        tag.apply(null, args);
        return wire;
      }
    }
    const tag = new Tagger(type);
    const wire = wiredContent(tag.apply(null, args));
    info.l = level;
    info.kind = type;
    info.tag = tag;
    info.tpl = args[0];
    info.wire = wire;
    if (i < 1)
      current.update = true;
    return wire;
  }

  function unrollArray(arr, i, level) {
    for (const {length} = arr; i < length; i++) {
      const value = arr[i];
      if (typeof value === 'object' && value) {
        if (value instanceof Hole) {
          arr[i] = unroll(value, level - 1);
        } else if (isArray(value)) {
          arr[i] = unrollArray(value, 0, level++);
        }
      }
    }
    return arr;
  }

  function wiredContent(node) {
    const childNodes = node.childNodes;
    const {length} = childNodes;
    return length === 1 ?
      childNodes[0] :
      (length ? new Wire(childNodes) : node);
  }

  function Hole(type, args) {
    this.type = type;
    this.args = args;
  }

  function _templateObject5() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    var data = _taggedTemplateLiteral(["<div class=", ">\n    <form method=\"dialog\" ontransitionend=", ">\n      <p class=\"title\">", "</p>\n      ", "\n      <menu class=\"dialog-menu\">\n        <button onclick=", " action=", " class=\"btn nes-btn is-primary\">", "</button>\n      </menu>\n    </form>\n  </div>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    var data = _taggedTemplateLiteral(["<div>\n  ", "</div>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    var data = _taggedTemplateLiteral(["<div class=\"visitor\"\n  spritesheet=", "\n  sprite=", ">\n</div>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    var data = _taggedTemplateLiteral(["<div\n  class=\"island\"\n  data-idx=", "\n  sprite=", "\n  onclick=", "\n  action=", "\n  style=", "\n  >\n  ", "\n</div>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }
  var FLOOR_SIZE = 5;
  var ANIMATION_DURATION = 2000;
  var ACTIONS = {
    HIDE_UNTIL_CLICK: 'HIDE_UNTIL_CLICK',
    START_GAME: 'START_GAME',
    SWAP_ISLANDS: 'SWAP_ISLANDS',
    WAIT: 'WAIT',
    NEXT_PAGE: 'NEXT_PAGE',
    GAME_OVER: 'GAME_OVER'
  };
  var elCanvas = window.canvas;
  var elDialog = window.elDialog; //
  // Game State

  var state = window.state = {
    isDialogOpen: false,
    didWin: true,
    storyIndex: 0,
    swapIndexes: [],
    islands: [],
    goal: [],
    visitors: [],
    //
    // Handle's events, updates state, and triggers re-render
    handleEvent: function handleEvent(event) {
      if (event.preventDefault) {
        event.preventDefault();
      } // console.log('event', event.type, event);


      initLevel(this, event);
      handleClick(this, event);
      updateIslandPositions(this, event);
      updateDidWin(this, event); // Render the new state
      // console.log('rendering state');

      renderLevel(elCanvas, this);
      renderDialog(elDialog, this);
    },
    //
    // Returns the the index for the island above.
    // User clicks the bottom and the island swaps with the one above it.
    getPairedIndex: function getPairedIndex(index) {
      var _indexToPoint = indexToPoint(index),
          x = _indexToPoint.x,
          y = _indexToPoint.y;

      return pointToIndex({
        x: x,
        y: y - 1
      });
    },
    //
    // Returns the visitor on island at index.
    // or null if no visitor is on that island.
    getVisitorAt: function getVisitorAt(index) {
      var _indexToPoint2 = indexToPoint(index),
          x = _indexToPoint2.x,
          y = _indexToPoint2.y;

      return this.visitors.find(function (visitor) {
        return visitor.x === x && visitor.y === y;
      });
    },
    //
    // Helper to trigger a re-render.
    triggerRender: function triggerRender() {
      this.handleEvent({
        type: "render"
      });
    }
  }; //
  // Story Phases!

  var story = window.story = [{
    title: 'Islander:',
    side: 'good',
    paragraphs: ['Oh! Hi there! I was just putting together my first island. 😁', 'It\'s not much now, but I think it has potental 🥰', 'Please, take a look around, but be careful not to poke it too hard, the dirt is still soft.'],
    next: {
      label: 'Let me take a better look',
      action: ACTIONS.HIDE_UNTIL_CLICK
    }
  }, {
    title: 'Trouble Maker:',
    side: 'evil',
    paragraphs: ['You poked me!', 'You look smart, so I\'ll poke your brain!', 'Watch as I destroy this pitiful island!', 'Bubble sort everything back into place, if you can!'],
    next: {
      label: 'I\'m on it!',
      action: ACTIONS.START_GAME
    }
  }, {
    title: 'Islander:',
    side: 'good',
    paragraphs: ['You did it! 🤩🥳', 'I knew you could do it!'],
    next: {
      label: 'Thank you!',
      action: ACTIONS.GAME_OVER
    }
  }]; //
  // Views/Render functions
  //
  //
  // An island is a sprite with optional child sprite.

  var renderIsland = function renderIsland(_ref, visitor, key) {
    var sprite = _ref.sprite;
    return html(_templateObject(), key, sprite, state, ACTIONS.SWAP_ISLANDS, "", !visitor ? '' : renderVisitor(visitor));
  }; //
  // Visitor is just a sprite.


  var renderVisitor = function renderVisitor(_ref2) {
    var sprite = _ref2.sprite,
        spritesheet = _ref2.spritesheet;
    return html(_templateObject2(), spritesheet, sprite);
  }; //
  // Render the level


  function renderLevel(elm, state) {
    var islands = state.islands,
        didWin = state.didWin,
        visitors = state.visitors; // Render the islands

    render(elm, function () {
      return html(_templateObject3(), islands.map(function (island, idx) {
        var visitor = state.getVisitorAt(idx);
        return renderIsland(island, visitor, idx);
      }));
    });
  } //
  // Dialog Box


  function renderDialog(elm, state) {
    var _this = this;

    var storyIndex = state.storyIndex;
    var _story$storyIndex = story[storyIndex],
        title = _story$storyIndex.title,
        paragraphs = _story$storyIndex.paragraphs,
        next = _story$storyIndex.next,
        side = _story$storyIndex.side;
    var classList = ['nes-dialog', 'is-rounded'];

    if ('evil' === side) {
      classList.push('is-dark');
    } else {
      classList.push('is-light');
    }

    render(elm, function () {
      return html(_templateObject4(), classList.join(' '), _this, title, paragraphs.map(function (txt) {
        return html(_templateObject5(), txt);
      }), state, next.action, next.label);
    });
  } //
  // Actions/Game Logic
  //
  //
  // updates the position of islands in the state.islands array.
  // Swaps the two islands in state.swapIndexes.


  function updateIslandPositions(state, event) {
    var type = event.type;
    var swapIndexes = state.swapIndexes,
        islands = state.islands;

    if (swapIndexes.length !== 2) {
      return state;
    }

    var bottomIsland = islands[swapIndexes[0]];
    var topIsland = islands[swapIndexes[1]]; // Swap the islands!

    islands.splice(swapIndexes[1], 1, bottomIsland);
    islands.splice(swapIndexes[0], 1, topIsland); // Swap the Visitors x,y positions

    var bottomVisitor = state.getVisitorAt(swapIndexes[0]);
    var topVisitor = state.getVisitorAt(swapIndexes[1]);

    if (bottomVisitor) {
      Object.assign(bottomVisitor, indexToPoint(swapIndexes[1]));
    }

    if (topVisitor) {
      Object.assign(topVisitor, indexToPoint(swapIndexes[0]));
    } // clear the indexes


    swapIndexes.length = 0;
    return state;
  } //
  // Check if the user won!


  function updateDidWin(state, event) {
    var islands = state.islands,
        goal = state.goal,
        visitors = state.visitors,
        didWin = state.didWin;
    state.didWin = goal.every(function (_ref3) {
      var x = _ref3.x,
          y = _ref3.y,
          spritesheet = _ref3.spritesheet,
          sprite = _ref3.sprite;
      return visitors.find(function (visitor) {
        return visitor.x === x && visitor.y === y && visitor.spritesheet === spritesheet && visitor.sprite === sprite;
      });
    }); // If we are switching to win for the first time.

    if (!didWin && state.didWin) {
      // ugly hack, we need to wait until after render to trigger the animation.
      setTimeout(function () {
        animationWin(state);
      });
    }

    return state;
  } //
  // Loads a new level


  function initLevel(state, event) {
    var type = event.type,
        level = event.level;

    if ('initLevel' !== type) {
      return state;
    }

    var mobs = level.mobs; // Mob original position is the solution to the puzzle.

    state.goal = JSON.parse(JSON.stringify(mobs)); // Mobs become visitors that are shuffled on the y-axis

    state.visitors = JSON.parse(JSON.stringify(mobs)); // Islands use random sprites.

    state.islands = Array(FLOOR_SIZE * FLOOR_SIZE).fill().map(function () {
      return {
        spritesheet: 'island',
        sprite: 0 | Math.random() * 6
      };
    });
    return state;
  }

  function handleClick(state, event) {
    var lastAction = state.lastAction,
        visitors = state.visitors,
        isDialogOpen = state.isDialogOpen,
        isAnimating = state.isAnimating;
    var currentTarget = event.currentTarget,
        type = event.type; // Only respond to clicks when not animating.

    if ('click' !== type || isAnimating) {
      return state;
    }

    var nextAction = currentTarget.getAttribute('action'); // If we are hiding until a click happend

    if (lastAction === ACTIONS.HIDE_UNTIL_CLICK && nextAction !== ACTIONS.HIDE_UNTIL_CLICK) {
      // Show the next dialog
      animationShowDialog(state).then(function () {
        state.lastAction = ACTIONS.WAIT; // re-render with the new state.

        state.triggerRender();
      });
      return state;
    } // We switch our action to the new one.


    state.lastAction = nextAction;

    if (nextAction === ACTIONS.HIDE_UNTIL_CLICK) {
      // Animate closed and then update the state.
      animationHideDialog(state).then(function () {
        // re-render with the new state.
        state.triggerRender();
      });
    }

    if (nextAction === ACTIONS.START_GAME) {
      Promise.all([animationHideDialog(state), animationExplode(state)]).then(function () {
        state.visitors = randomizeVisitors(visitors); // re-render with the new state.

        state.triggerRender();
      });
    }

    if (nextAction === ACTIONS.GAME_OVER) {
      // just close the dialog so the user can see the island.
      animationHideDialog(state);
    }

    if (nextAction === ACTIONS.SWAP_ISLANDS && !isDialogOpen) {
      var bottomIndex = parseInt(currentTarget.dataset.idx, 10);
      var topIndex = state.getPairedIndex(bottomIndex); // Skip invalid pairs (like the top islands)

      if (topIndex < 0) {
        return state;
      } // Start the animation.


      animationSwap(state, [bottomIndex, topIndex]).then(function () {
        state.swapIndexes = [bottomIndex, topIndex]; // re-render with the new state.

        state.triggerRender();
      });
    }

    return state;
  } //
  // Randomizes the visitors along the y-axis only.


  function randomizeVisitors(visitors) {
    // Create a random list of indexes for each column.
    var randomIndexes = Array(FLOOR_SIZE).fill().map(function () {
      return Array(FLOOR_SIZE).fill().map(function (_, i) {
        return i;
      }).sort(function () {
        return 0 | Math.random() * 3 - 2;
      });
    }); // Give each visitor a new random y position from the random list.

    return visitors.map(function (visitor) {
      visitor.y = randomIndexes[visitor.x].pop();
      return visitor;
    });
  } //
  // Animations
  // Island Swap


  function animationSwap(state, _ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        bottomIndex = _ref5[0],
        topIndex = _ref5[1];

    console.log('animationSwap');
    markStartAnimation(state);
    return Promise.all([anime({
      targets: ".island:nth-child(".concat(topIndex + 1, ")"),
      delay: 0,
      duration: ANIMATION_DURATION,
      easing: 'easeOutExpo',
      keyframes: [{
        translateX: '0%',
        translateY: '0%',
        'z-index': 110
      }, {
        translateX: '50%',
        translateY: '50%'
      }, {
        translateX: '0%',
        translateY: '100%',
        'z-index': 100
      }]
    }).finished, anime({
      targets: ".island:nth-child(".concat(bottomIndex + 1, ")"),
      duration: ANIMATION_DURATION,
      easing: 'easeOutCirc',
      delay: 0,
      keyframes: [{
        translateX: '0%',
        translateY: '0%',
        'z-index': 110
      }, {
        translateX: '-50%',
        translateY: '-50%'
      }, {
        translateX: '0%',
        translateY: '-100%',
        'z-index': 100
      }]
    }).finished]).then(function () {
      // remove the styles anime added for the animation. State will have the island in the new position on re-render.
      document.querySelectorAll(".island:nth-child(".concat(topIndex + 1, "), .island:nth-child(").concat(bottomIndex + 1)).forEach(function (elm) {
        return elm.removeAttribute('style');
      });
      markEndAnimation(state);
    });
  } //
  // explode the world into islands!


  function animationExplode(state) {
    markStartAnimation(state);
    var promiseList = [{
      x: 200,
      y: 108
    }, {
      x: 154,
      y: 31
    }, {
      x: 108,
      y: -46
    }, {
      x: 62,
      y: -123
    }, {
      x: 16,
      y: -200
    }].map(function (start, index) {
      var targets = Array(FLOOR_SIZE).fill().map(function (_, i) {
        return index * FLOOR_SIZE + i;
      }).reduce(function (result, num) {
        return "".concat(result, ", .island:nth-child(").concat(num + 1, ")");
      }, '').substring(1);
      return anime({
        targets: targets,
        duration: ANIMATION_DURATION,
        translateX: [anime.stagger("-54%", {
          start: start.x
        }), 0],
        translateY: [anime.stagger("23%", {
          start: start.y
        }), 0],
        easing: "easeInOutSine"
      }).finished;
    });
    return Promise.all(promiseList).then(function () {
      markEndAnimation(state);
      document.querySelectorAll('.island').forEach(function (elm) {
        return elm.style.transform = '';
      });
    });
  } //
  // Bring all the islands back together animation


  function animationRestore(state) {
    markStartAnimation(state);
    var promiseList = [{
      x: 200,
      y: 108
    }, {
      x: 154,
      y: 31
    }, {
      x: 108,
      y: -46
    }, {
      x: 62,
      y: -123
    }, {
      x: 16,
      y: -200
    }].map(function (start, index) {
      var targets = Array(FLOOR_SIZE).fill().map(function (_, i) {
        return index * FLOOR_SIZE + i;
      }).reduce(function (result, num) {
        return "".concat(result, ", .island:nth-child(").concat(num + 1, ")");
      }, '').substring(1);
      return anime({
        targets: targets,
        duration: ANIMATION_DURATION,
        translateX: [0, anime.stagger("-54%", {
          start: start.x
        })],
        translateY: [0, anime.stagger("23%", {
          start: start.y
        })],
        easing: "easeInOutSine"
      }).finished;
    });
    return Promise.all(promiseList).then(function () {
      markEndAnimation(state);
    });
  }

  function animationWin(state) {
    markStartAnimation(state);
    var promiseList = [animationRestore(state), animationShowDialog(state)];
    return Promise.all(promiseList).then(function () {
      markEndAnimation(state);
    });
  } //
  // Dialog Animations


  function animationHideDialog() {
    markStartAnimation(state);
    console.log('animationHideDialog START');
    return anime({
      targets: '#elDialog',
      easing: 'easeInQuart',
      duration: ANIMATION_DURATION / 2,
      translateX: [0, '-80vw']
    }).finished.then(function () {
      console.log('animationHideDialog END');
      markEndAnimation(state);
      state.isDialogOpen = false;
      state.storyIndex += 1;
    });
  }

  function animationShowDialog() {
    markStartAnimation(state);
    state.isDialogOpen = true;
    return anime({
      targets: '#elDialog',
      duration: ANIMATION_DURATION,
      easing: 'easeInQuart',
      translateX: ['-80vw', 0]
    }).finished.then(function () {
      markEndAnimation(state);
    });
  } //
  // Utils


  function indexToPoint(index) {
    return {
      x: 0 | index % FLOOR_SIZE,
      y: 0 | index / FLOOR_SIZE
    };
  }

  function pointToIndex(_ref6) {
    var x = _ref6.x,
        y = _ref6.y;
    return x + y * FLOOR_SIZE;
  }

  function markStartAnimation(state) {
    state.isAnimating = true;
    document.body.classList.add('is-animating');
  }

  function markEndAnimation(state) {
    state.isAnimating = false;
    document.body.classList.remove('is-animating');
  } //
  // Define some levels


  var levels = [{
    mobs: [{
      x: 4,
      y: 0,
      spritesheet: 'img-water',
      sprite: 3
    }, {
      x: 3,
      y: 0,
      spritesheet: 'img-water',
      sprite: 5
    }, {
      x: 4,
      y: 1,
      spritesheet: 'img-water',
      sprite: 1
    }, {
      x: 3,
      y: 1,
      spritesheet: 'img-water',
      sprite: 0
    }, {
      x: 4,
      y: 2,
      spritesheet: 'img-water',
      sprite: 4
    }, {
      x: 3,
      y: 2,
      spritesheet: 'img-water',
      sprite: 2
    }, {
      x: 0,
      y: 3,
      spritesheet: 'img-visitor',
      sprite: 0
    }, {
      x: 2,
      y: 0,
      spritesheet: 'img-visitor',
      sprite: 1
    }, {
      x: 1,
      y: 2,
      spritesheet: 'img-golem-1',
      sprite: 'forward'
    }]
  }]; //
  // Main
  // Update the CSS vars to match the JS CONSTS

  document.body.style.setProperty('--grid--total-columns', FLOOR_SIZE);
  document.body.style.setProperty('--grid--total-rows', FLOOR_SIZE); // Trigger loading the frist level

  state.handleEvent({
    type: 'initLevel',
    level: levels[0]
  });
  Promise.all([animationRestore(state), animationShowDialog(state)]).then(function () {
    state.triggerRender();
  });

}());
//# sourceMappingURL=bundle.js.map
