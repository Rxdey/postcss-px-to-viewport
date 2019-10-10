'use strict';

var fs = require('fs');
var postcss = require('postcss');
var pxToViewport = require('..');
var path = require('path');
var css = fs.readFileSync(path.resolve(__dirname, 'main.css'), 'utf8');
// var options = {
//   replace: false
// };
var options = {
  viewportWidth: 750,
  unitPrecision: 3,
  viewportUnit: 'rem',
  selectorBlackList: ['.ignore'],
  propIgnoreList: ['font-size'],
  minPixelValue: 1,
  multiple: 10,
  exclude: ['xxx'],
  rules: {
    path: ['vant', 'vux'],
    fn: function (pixels, vw) {
      return vw * 2 + 'rem';
    }
  }
};
var processedCss = postcss(pxToViewport(options)).process(css).css;

fs.writeFile(path.resolve(__dirname, 'main-viewport.css'), processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('File with viewport units written.');
});
