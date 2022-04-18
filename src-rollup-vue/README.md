# rollup-vue

## 概述

编译.vue 单文件组件为 js 的简单例子，使用了 rollup 插件 rollup-plugin-vue

参考完整项目：[vuejs/rollup-plugin-vue: Roll .vue files](https://github.com/vuejs/rollup-plugin-vue)

## 构建

安装依赖

```
pnpm add -D @vue/compiler-sfc rollup rollup-plugin-vue
```

解释：

- 安装 rollup
- 安装 rollup-plugin-vue
- 注意安装依赖@vue/compiler-sfc

## 运行

添加运行脚本

```
"dev": "rollup -c rollup.config.js"
```

运行

```
pnpm run dev
```

## 总结

看到了编译后的代码，从 vue 文件打包成 js 的效果

## Reference

1. [vuejs/rollup-plugin-vue: Roll .vue files](https://github.com/vuejs/rollup-plugin-vue)
