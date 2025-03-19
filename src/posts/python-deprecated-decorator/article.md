从Python 3.13开始，`warnings`模块里新增了一个`@deprecated`装饰器，用于标记函数等已经被启用。具体可以参考[Python文档](https://docs.python.org/3/library/warnings.html#warnings.deprecated)和[PEP 702](https://peps.python.org/pep-0702/)。

下面是一个简单的例子：

```python
from warnings import deprecated

@deprecated("use new_func instead")
def old_func():
    pass
```

VS Code已经提供了对于`@deprecated`装饰器的支持，如果调用了被弃用的函数，会在函数上看到一个删除线，将鼠标悬停在上面可以看到警告信息。

![](./vscode.png)

如果你还在使用Python 3.12或者更早的版本，可以使用`typing_extensions`模块里的`@deprecated`装饰器来代替，这是标准库的一个移植。（不过这里有点奇怪：`typing_extensions`应该是`typing`模块的移植，怎么把`warnings`模块也移植过来了？）
