最近写代码的时候，发现给一个函数加了装饰器后就会报错。后来发现是因为装饰器抹去了原函数的 type hints 信息，导致后续逻辑出错。Python 的函数对象有很多 metadata，比如函数名、docstring、type hints 等，`functools.wraps`装饰器的作用就是复制这些 metadata。

请看下面的示例：

```python
from functools import wraps

def decorator(func):
    def new_func():
        func()
    return new_func

def decorator_with_wraps(func):
    @wraps(func)
    def new_func():
        func()
    return new_func

@decorator
def f():
    pass

@decorator_with_wraps
def g():
    pass

print(f.__name__)  # 输出：new_func
print(g.__name__)  # 输出：g
```
