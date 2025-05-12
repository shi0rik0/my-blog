## 基本概念

在Python的协程体系中有两个基本概念：coroutine和coroutine function。

coroutine对象拥有一个`__await__`函数，调用这个函数会返回一个生成器。而调用一个coroutine function则会返回一个coroutine对象。

```python
import asyncio
from collections.abc import Generator

async def f():
    pass

# 都会返回 True
print(asyncio.iscoroutinefunction(f))
print(asyncio.iscoroutine(f()))
print(isinstance(f().__await__(), Generator))
```

这样我们就明白Python协程的工作原理了。当我们await一个协程对象的时候，实际上是调用了这个对象的`__await__`方法，得到一个生成器对象。这个生成器对象会被调度器调度执行。协程通过`yield`语句来暂停执行，将控制权交还给调度器。

## 实现一个简单的协程

要实现一个简单的协程，只需要定义一个能返回生成器的的`__await__`方法，即可，下面是一个简单的例子：

```python
import asyncio
import time
import logging


logging.basicConfig(
    level=logging.DEBUG,
    format="[%(asctime)s.%(msecs)03d] %(message)s",
    datefmt="%H:%M:%S",
)


class MyAsyncSleep:
    def __init__(self, seconds):
        self.seconds = seconds

    def __await__(self):
        start = time.time()
        while time.time() - start < self.seconds:
            yield
        logging.debug(f"Slept for {self.seconds} seconds")


async def main():
    logging.debug("Starting sleep...")
    await asyncio.gather(
        MyAsyncSleep(1),
        MyAsyncSleep(2),
        MyAsyncSleep(3),
    )
    logging.debug("Finished sleep!")


if __name__ == "__main__":
    asyncio.run(main())
```

## 参考资料

[浅谈Python协程与\_\_await\_\_属性](https://aureliano90.github.io/blog/2022/04/28/A_Brief_Introduction_of_Python_Coroutines_and__await__Attribute.html)
