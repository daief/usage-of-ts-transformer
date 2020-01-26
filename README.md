# 演示仓库

关于 TypeScript 自定义 transformer 的使用。

- `src`：用于编译的示例源文件
- `index.ts`：主要文件

主要是了解一下在 `before`、`after`、`afterDeclarations` 中使用 transformer 的区别。

`index.ts` 定义了一个简单的 transformer，分别在 `before`、`after`、`afterDeclarations` 中使用，编译后查看输出的文件中不同的部分。

启动编译：

```bash
$ yarn compile
```

> 我的笔记：<https://daief.tech/2020-01-26/usage-of-ts-transformer.html>
