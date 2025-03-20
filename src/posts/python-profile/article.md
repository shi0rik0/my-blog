Python标准库里面有两个可以用于性能分析的模块：`cProfile` 和 `profile`。`cProfile`是用C编写的，而`profile`是用纯Python实现的。它们的接口类似，但是并不完全相同，比如说它们的输出文件格式不同。有一个知名的库`snakeviz`可以用来可视化`cProfile`的输出文件，但是它不支持`profile`的输出文件。`cProfile`不仅更快，还被`snakeviz`所支持，所以大多数时候还是推荐使用`cProfile`。

`cProfile`有很多接口，但是最简单的用法就是使用`python -m cProfile`命令直接测试一个脚本：

```bash
python -m cProfile -o out_file src.py
```

然后就可以用`snakeviz`来可视化`out_file`的内容了：

```bash
pip install snakeviz
snakeviz out_file
```
