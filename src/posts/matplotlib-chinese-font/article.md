Python的Matplotlib库默认是无法显示中文的，因为Matplotlib默认使用的字体不支持中文字符。为了在Matplotlib中显示中文，我们需要手动配置字体。

首先可以用以下代码查看当前系统可用的字体

```python
import matplotlib.font_manager as fm

print(fm.get_font_names())
```

如果是Windows操作系统，通常可以使用`Microsoft YaHei`（微软雅黑）字体。

选好字体之后就可以配置Matplotlib的字体了：

```python
import matplotlib.pyplot as plt

plt.rcParams['font.sans-serif'] = ['Microsoft YaHei']
```

## 参考资料

1. [Matplotlib 中文显示 | 菜鸟教程](https://www.runoob.com/matplotlib/matplotlib-zh.html)
