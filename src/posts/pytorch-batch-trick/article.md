最近在阅读PyTorch的源码的时候，发现`torch.utils.data.sampler.BatchSampler`的实现非常有意思：

```python
    def __iter__(self) -> Iterator[List[int]]:
        # Implemented based on the benchmarking in https://github.com/pytorch/pytorch/pull/76951
        sampler_iter = iter(self.sampler)
        if self.drop_last:
            # Create multiple references to the same iterator
            args = [sampler_iter] * self.batch_size
            for batch_droplast in zip(*args):
                yield [*batch_droplast]
        else:
            batch = [*itertools.islice(sampler_iter, self.batch_size)]
            while batch:
                yield batch
                batch = [*itertools.islice(sampler_iter, self.batch_size)]
```

这段代码运用了`zip`和`itertools.islice`来实现批量采样的功能。我将其中的核心思想提取出来，写了一个简单的benchmark：

```python
import time
import itertools

sampler = range(320000)
batch_size = 32


def batch_iter_naive(sampler, batch_size):
    batch = []
    for i in sampler:
        batch.append(i)
        if len(batch) == batch_size:
            yield batch
            batch = []


def batch_iter_faster_1(sampler, batch_size):
    sampler_iter = iter(sampler)
    iters = [sampler_iter] * batch_size
    for batch in zip(*iters):
        yield list(batch)


def batch_iter_faster_2(sampler, batch_size):
    sampler_iter = iter(sampler)
    batch = [*itertools.islice(sampler_iter, batch_size)]
    while batch:
        yield batch
        batch = [*itertools.islice(sampler_iter, batch_size)]


start = time.time()
list(batch_iter_naive(sampler, batch_size))
print("Naive method time:", time.time() - start)

start = time.time()
list(batch_iter_faster_1(sampler, batch_size))
print("Faster method 1 time:", time.time() - start)

start = time.time()
list(batch_iter_faster_2(sampler, batch_size))
print("Faster method 2 time:", time.time() - start)
```

结果发现改进后的方法确实比普通方法快了不少。

至于速度变快的原因，我猜测是因为Python的for循环迭代开销太大，而`zip`和`itertools.islice`都是C实现的，迭代速度更快。从中可以总结出一个Python优化的技巧：用C实现的函数减少for循环的次数。
