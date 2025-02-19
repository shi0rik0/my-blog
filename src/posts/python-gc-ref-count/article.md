最近发现Python的GC机制非常地独树一帜。在常用的带GC的编程语言中，可能只有Python的GC机制采用了引用计数的机制。据说这种机制实现的GC效率并不是最高的，但是这种机制却意外地很适合神经网络的场景。

在没有循环引用的情况下，Python的GC机制可以保证对象在不再需要的时候立刻被回收。这种机制非常适合PyTorch管理tensor占用的显存。只要tensor不再被使用，它所占用的显存就会被立刻释放。至于GC的效率倒不是那么重要，毕竟神经网络的性能瓶颈在于GPU而非CPU。并且在神经网络的场景下，一般tensor是不会出现循环引用的。

参考资料：[Understanding GPU Memory 2: Finding and Removing Reference Cycles](https://pytorch.org/blog/understanding-gpu-memory-2/)

> Python will clean up non-cyclic objects immediately using reference counting. However objects in reference cycles are only cleaned up later by a cycle collector.

这篇文章也讲解了如何分析循环引用导致的显存占用过多的问题。

而Java的GC机制则是采用了标记-清除的机制。这种机制不能保证对象在不再需要的时候立刻被回收，所以可能会导致显存的浪费。
