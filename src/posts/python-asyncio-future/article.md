假设我们有这么一个异步API，它接受一个callback参数，当任务完成时会调用这个callback函数来返回结果：

```python
import threading
import time


def async_func(callback):
    def thread_func():
        time.sleep(2)
        callback(123)

    thread = threading.Thread(target=thread_func)
    thread.start()


def callback(result):
    print(f"Callback executed with result: {result}")


async_func(callback)
```

有没有办法可以将这个传统的异步API包装成一个兼容asyncio体系的API呢？答案是可以。我们可以用`asyncio.Future`来实现这个功能。`asyncio.Future`是asyncio的一个底层API，通过Future对象，我们就可以通知事件循环某个操作已经完成了。下面是一个示例：

```python
import asyncio
import threading
import time


def async_func_awaitable():
    loop = asyncio.get_running_loop()
    future = loop.create_future()

    def thread_func():
        time.sleep(2)
        loop.call_soon_threadsafe(future.set_result, 123)

    thread = threading.Thread(target=thread_func)
    thread.start()

    return future


async def main():
    result = await async_func_awaitable()
    print(f"Coroutine executed with result: {result}")


asyncio.run(main())
```

在上面的代码中，我们首先用`asyncio.get_running_loop()`获取事件循环对象，然后创建并返回一个Future对象。当操作完成后，调用`loop.call_soon_threadsafe(future.set_result, 123)`来设置Future的结果。剩下的逻辑，事件循环都会帮我们处理。

注意：这里一定要用`call_soon_threadsafe`来设置结果，不能直接调用`future.set_result`，否则会导致线程安全问题。
