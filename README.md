
## 前言 

TypeScript 具有类型系统，且是 JavaScript 的超集，TypeScript 在 2018年 势头迅猛，可谓遍地开花。

Vue3.0 将使用 TS 重写，重写后的 Vue3.0 将更好的支持 TS。2019 年 TypeScript 将会更加普及，能够熟练掌握 TS，并使用 TS 开发过项目，将更加成为前端开发者的优势。

此项目是基于 Vue 全家桶 + TypeScript + Element-UI  的技术栈，且已经开源，github 地址

## 效果

效果图：

- pc 端




- 移动端



完整效果请看

## 功能

### 已经完成功能

- [x] 登录  
- [x] 注册  
- [x] 文章列表
- [x] 文章归档
- [x] 标签  
- [x] 关于  
- [x] 点赞与评论
- [x] 留言
- [x] 历程
- [x] 文章详情（支持代码语法高亮）
- [x] 文章详情目录
- [x] 移动端适配
- [x] github 授权登录

### 待优化或者实现

- [ ] 使用 vuex-class
- [ ] 更多 TypeScript 的优化技巧
- [ ] 等出了 Vue3.0，用 Vue3.0 进行重构
- [ ] 服务器渲染 SSR

## 前端主要技术 

所有技术都是当前最新的。

- vue： ^2.6.6
- typescript : ^3.2.1
- element-ui： 2.6.3
- vue-router : ^3.0.1
- webpack： 4.28.4
- vuex: ^3.0.1
- axios：0.18.0
- highlight.js： 9.15.6
- marked：0.6.1


## Build Setup 

```

```
# cd
cd  blog-vue-typescript
```

```
# install dependencies
npm install
```

```
# Compiles and hot-reloads for development
npm run serve
```

```
# Compiles and minifies for production
npm run build
```

## 项目地址与文档教程

**项目地址：**


**本博客系统的系列文章：**

## 权衡

如何更好的利用 JS 的动态性和 TS 的静态特质，我们需要结合项目的实际情况来进行综合判断。一些建议：

*   如果是中小型项目，且生命周期不是很长，那就直接用 JS 吧，不要被 TS 束缚住了手脚。
*   如果是大型应用，且生命周期比较长，那建议试试 TS。
*   如果是框架、库之类的公共模块，那更建议用 TS 了。

**至于到底用不用TS，还是要看实际项目规模、项目生命周期、团队规模、团队成员情况等实际情况综合考虑。**

其实本项目也是小项目来的，其实并不太适合加入  TypeScript ，不过这个项目是个人的项目，是为了练手用的，所以就无伤大大雅。

未来，class-compoent 也将成为主流，现在写 TypeScript 以后进行 3.0 的迁移会更加方便。
