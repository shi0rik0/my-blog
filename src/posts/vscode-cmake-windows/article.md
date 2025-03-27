这篇指南会教你如何在Windows下给VS Code配置一个舒服的CMake开发环境。

首先要安装VS Build Tools，可以在[VS官网](https://visualstudio.microsoft.com/visual-cpp-build-tools/)下载。

然后给VS Code安装CMake Tools和clangd扩展。

然后在VS Code的配置文件里加入以下设置：

```
"cmake.generator": "Ninja"
```

之所以要使用Ninja，是因为默认的VS生成器无法生成clangd需要的`compile_commands.json`文件。

这样就配置完成了。

如果发现编译器输出的信息有乱码，可以在VS Code的配置文件里加入以下设置：

```
"cmake.outputLogEncoding": "utf-8"
```

如果`utf-8`不行就改成`gbk`。
