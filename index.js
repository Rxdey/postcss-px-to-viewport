'use strict';

var postcss = require('postcss');
var objectAssign = require('object-assign');
// postcss-px2vw-exclude 添加排除文件夹配置
// excluding regex trick: http://www.rexegg.com/regex-best-trick.html
// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by px
// !singlequotes|!doublequotes|!url()|pixelunit
var pxRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)px/gi;

var defaults = {
  viewportWidth: 720,
  // viewportHeight: 568, // not now used; TODO: need for different units and math for different properties
  unitPrecision: 5,
  viewportUnit: 'vw',
  selectorBlackList: [],
  minPixelValue: 1,
  mediaQuery: false,
  exclude: [],
  multiple: 100, // 转换倍数
  rules: {path:'',fn:()=>{}},
};

module.exports = postcss.plugin('postcss-px-to-viewport-rxdey', function(options) {
  var opts = objectAssign({}, defaults, options);
  var pxReplace = createPxReplace(opts.viewportWidth, opts.minPixelValue, opts.unitPrecision, opts.viewportUnit, opts.rules, opts.multiple);
  return function(css) {
    var path = css.source.input.file;
    var rulesPath =opts.rules.path?blacklistedPath(opts.rules.path,path):true;  // 指定了路径 只对路径下生效
    var r = pxReplace(rulesPath)
    css.walkDecls(function(decl, i) {
      if (decl.value.indexOf('px') === -1) return;
      if (blacklistedSelector(opts.selectorBlackList, decl.parent.selector))
        return;
      if (blacklistedPath(opts.exclude, path)) return;
      decl.value = decl.value.replace(pxRegex, r);
    });
    if (opts.mediaQuery) {
      css.walkAtRules('media', function(rule) {
        if (rule.params.indexOf('px') === -1) return;
        rule.params = rule.params.replace(pxRegex, r);
      });
    }
  };
});

function createPxReplace(viewportSize, minPixelValue, unitPrecision, viewportUnit, rules, multiple ) {
  return function(rulesPath){
    return function(m, $1) {
      if (!$1) return m;
      var pixels = parseFloat($1);
      if (pixels <= minPixelValue) return m;
      var opt = { viewportSize, minPixelValue, unitPrecision, viewportUnit, multiple };
      if (JSON.stringify(rules.fn(pixels, opt))&&rulesPath) {   // 是否自定义规则 自定义规则必须带有返回值
        return rules.fn(pixels, toFixed((pixels / viewportSize) * multiple, unitPrecision));
      }
      return toFixed((pixels / viewportSize) * multiple, unitPrecision) + viewportUnit;
    };
  }
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

function blacklistedSelector(blacklist, selector) {
  if (typeof selector !== 'string') return;
  return blacklist.some(function(regex) {
    if (typeof regex === 'string') return selector.indexOf(regex) !== -1;
    return selector.match(regex);
  });
}

function blacklistedPath(blacklist, path) {
  if (typeof blacklist === 'string') {
    blacklist = [blacklist];
  }
  if (!blacklist.length) return false;
  var pathArray = path.split('\\'); // Get filepath
  var isBlack = blacklist.some(item => {
    return pathArray.includes(item);
  });
  return isBlack;
}
