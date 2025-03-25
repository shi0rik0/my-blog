废话不多说，先直接上代码：

```python
import asyncio
from concurrent.futures import ProcessPoolExecutor
import multiprocessing
import os

var_per_process = None


def initialize_process():
    global var_per_process
    var_per_process = os.getpid()


def add(arg1, arg2):
    print(f"Process {var_per_process} received {arg1} and {arg2}")
    return arg1 + arg2


async def main():
    loop = asyncio.get_event_loop()
    with ProcessPoolExecutor(
        max_workers=multiprocessing.cpu_count(), initializer=initialize_process
    ) as executor:
        inputs = [(1, 2), (3, 4), (5, 6)]
        results = await asyncio.gather(
            *[loop.run_in_executor(executor, add, i, j) for i, j in inputs]
        )
        print(results)


if __name__ == "__main__":
    asyncio.run(main())
```

`ProcessPoolExecutor`的构造函数有一个`initializer`参数，可以传入一个函数，这个函数会在每个进程启动的时候被调用。这个函数可以用来初始化每个进程的状态，比如连接数据库等。

`loop.run_in_executor`的返回值是一个`Future`对象。将多个`Future`对象传入`asyncio.gather`，就可以异步执行多个任务，并等待所有任务完成。

执行这段代码，会看到类似下面的输出：

```
Process 4088441 received 1 and 2
Process 4088442 received 3 and 4
Process 4088443 received 5 and 6
[3, 7, 11]
```
