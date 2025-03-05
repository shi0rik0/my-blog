首先要在[npmjs.com](https://www.npmjs.com/)上注册一个账号。

在发布包之前，要检查`package.json`中的`name`字段是否正确，这个字段就决定了在npm上的包名。

如果没问题，就可以发布了，首先要登录npm账号：

```bash
npm login
```

然后发布：

```bash
npm publish --access public
```

就是这么简单！
