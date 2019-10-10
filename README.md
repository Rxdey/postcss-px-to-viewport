# postcss-px-to-viewport [![NPM version](https://badge.fury.io/js/postcss-px-to-viewport.svg)](http://badge.fury.io/js/postcss-px-to-viewport)

A plugin for [PostCSS](https://github.com/ai/postcss) that generates viewport units (vw, vh, vmin, vmax) from pixel units.

> 基于[evrone/postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)修改

- 增加下方配置解决第三方 ui 库转换后缩小的问题
- 增加`exclude`排除文件配置
- 增加`rules` 自定义转换规则配置
- 增加`multiple` 转换倍数
- 增加`propIgnoreList` 过滤属性列表

```javascript
# 配置参数
'postcss-px-to-viewport-rxdey': {
      viewportWidth: 750,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore'],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: ['node_modules'],
      multiple: 100,
      propIgnoreList: ['font-size'],
      rules: {
        path: 'vux',
        fn: (pixels, vw) => {
          return vw*2 + 'vw';
        },
      },
    },
```

> `exclude` 接收 文件夹名/文件名(带后缀);

> `exclude` 配置优先级大于`rules`对象中的`path`，`rules`配置会被直接排除;

> `rules` 接收对象，`path`为生效路径，不做配置或为空默认全局生效，参数同`exclude`;

> `rules.fn` 自定义转换规则，返回转换后的数值，没有返回值则不生效！，`pixels`：原始像素数值,`vw`：正常转换后的 vw 值,`opt`：上方填写的配置参数；

> `multiple` 转换时的倍数，`(pixels / viewportSize) * 100`原转换公式；

> `propIgnoreList` 过滤属性列表，数组中的样式不会被转换；
