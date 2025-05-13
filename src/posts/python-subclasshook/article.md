最近在查阅Python标准库`collections.abc`的源代码时，发现一个有趣的“魔法方法”`__subclasshook__`。这个方法其实是一个假的魔法方法，因为它并没有任何特殊性。如果一个类继承了`abc.ABC`，那么对这个类调用`issubclass`，或者对这个类的对象调用`isinstance`时，Python就会自动调用这个类的`__subclasshook__`方法。

举个例子，下面的类`Addable`用来描述可以进行加法运算的接口。

```python
from abc import ABC

class Addable(ABC):
    @classmethod
    def __subclasshook__(cls, subclass):
        if cls is Addable:
            if any("__add__" in B.__dict__ for B in subclass.__mro__):
                return True
        return NotImplemented

assert issubclass(int, Addable)
assert isinstance([], Addable)
assert not isinstance(None, Addable)
```

这里有一些值得注意的地方：

1. `__subclasshook__`必须是一个class method。
2. 在判断之前，必须先判断`cls`是否是自身。具体原因我不是很清楚，这里是照抄了官方的例子。
3. 可以利用`__mro__`和`__dict__`来判断一个类是否实现了某个方法。这里的判断其实很粗糙，只能检测是否存在某个属性，连该属性是否可调用都没有判断，更别说参数和返回值类型了。不过官方的例子也没有做这些检查。
4. 如果发现不符合接口要求，应该返回`NotImplemented`，而不是`False`。这里的`NotImplemented`是Python内置的一个特殊常量，不要和`NotImplementedError`搞混了。
