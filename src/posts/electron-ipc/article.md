## Electron的进程模型

在Electron中，有两种进程：主进程和渲染进程。渲染进程本质上就是一个Chromium的进程，它只负责渲染页面，不能访问Node.js提供的操作系统相关的API。主进程是Node.js的进程，可以访问操作系统的API。主进程和渲染进程之间通过IPC（Inter-Process Communication）进行通信。

这种模型的好处就在于：

1. 不怎么需要修改Chromium的源码。
2. 保证了浏览器环境的安全性。

## 如何使用IPC

假设我们希望在渲染进程中打开操作系统的文件选择对话框，并得到用户选择的文件路径。

首先在主进程的入口`main.ts`中创建一个接口`open-file`：

```typescript
import { app, BrowserWindow, ipcMain, dialog } from 'electron'

app.on('ready', () => {
  ipcMain.handle('open-file', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
    })
    return filePaths[0]
  })
  createWindow()
})
```

这里要注意，不能在`createWindow`函数中注册API，因为`createWindow`函数可能会被调用多次。

然后在`preload.ts`中将`open-file`接口暴露给渲染进程：

```typescript
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('eAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
})
```

（`preload.ts`是渲染进程在正式运行前执行的一个脚本，它具有更多的权限。这个设计主要是为了保证运行时的安全。）

这样就可以在渲染进程中通过`window.eAPI.openFile()`来调用主进程的`open-file`接口了。例如在Vue组件中：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const filePath = ref<string>('')
const openFile = async () => {
  filePath.value = await window.eAPI.openFile()
}
</script>

<template>
  <button @click="openFile">Open File</button>
  <p>{{ filePath }}</p>
</template>
```

## TypeScript支持

Electron无法自动推导出IPC接口的类型，只能手动定义。在项目的任意位置创建一个`.d.ts`文件，例如`src/window.d.ts`，然后定义接口：

```typescript
interface API {
  openFile: () => Promise<string>
}

declare interface Window {
  eAPI: API
}
```

这样TypeScript就能正确推导出`window.eAPI.openFile()`的类型了。
