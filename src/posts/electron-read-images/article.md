最近需要在Electron应用程序中实现读取并显示本地图片的功能。这个功能看起来简单，但实现起来还是会遇到很多坑。这里就总结一下我遇到的问题，并给出一个完整的解决方案。

## 两种方案

首先，Electron是不支持在渲染进程中直接读取本地文件的，所以必须要通过主进程来读取文件。这里有两种方案：

1. 利用Electron的[Protocol API](https://www.electronjs.org/docs/latest/api/protocol)，将本地文件映射到一个自定义的协议，然后在渲染进程中通过这个协议来读取文件。
2. 直接在主进程中提供一个读取文件的接口，然后在渲染进程中调用这个接口来读取文件。

第一种方案看起来更优雅，因为这样就可以直接通过修改img标签的src属性来显示图片，但实际上这种方案会导致一个问题：修改src属性之后图片不会自动刷新，所以最终我放弃了这种方案。

## 序列化问题

如果采用第二种方案，就会遇到一个问题：如何在主进程和渲染进程之间传递文件数据。最直接的方法是将文件数据序列化为Base64字符串，但是这样势必会降低性能，所以我希望能够直接传递二进制数据。但是Electron的序列化机制似乎无法正确传递Buffer对象，所以要将Buffer对象转换为Uint8Array对象。

```typescript
ipcMain.handle('load-file', async (_, filePath: string) => {
  const content = await fs.readFile(filePath, { encoding: null })
  return Uint8Array.from(content)
})
```

## 让img标签显示图片

最后的问题就是如何让img标签显示二进制数据的图片。一种简单的办法是将二进制数据转换为Base64字符串，然后将这个字符串赋值给img标签的src属性，比如说`<img src="data:image/png;base64,{base64_str}">`。但这里又有个麻烦的地方：我们必须指定图片的MIME类型。当然我们可以通过图片扩展名或者元数据来判断图片类型，但是我嫌麻烦，所以后来发现一个更简单的方法，直接指定MIME类型为`image/unknown`，这样浏览器会自动识别图片类型（当然这不是符合标准的）。
