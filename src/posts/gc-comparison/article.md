## Java & C#

Java和C#都采用了“分代”的思想，将对象分为不同的“代”，对于不同的“代”采用不同的GC策略。具体采用的GC策略包括：复制、标记-清除、标记-整理等。这种方式的优点是吞吐量高，缺点则是STW（Stop The World）时间较长。

## Go

Go使用了三色标记法，这种方式的GC中断次数较多，但是每次的中断时间较短，可以说是一种牺牲吞吐量来换取较低STW时间的GC策略。

参考资料：

- https://www.zhihu.com/question/326191221
- https://medium.com/servicetitan-engineering/go-vs-c-part-2-garbage-collection-9384677f86f1

## Python

Python采取了引用计数和循环引用检测的双重机制。引用计数就和C++的shared_ptr类似，当对象的引用计数为0时就会被回收。引用计数无法处理循环引用的问题，所以需要定期进行循环引用检测。

Python的GC机制非常地独树一帜。在常用的带GC的编程语言中，可能只有Python的GC机制采用了引用计数的机制。这种机制实现的GC效率并不是最高的，特别是STW时间较长，但是这种机制却很适合神经网络的场景。

在没有循环引用的情况下，Python的GC机制可以保证对象在不再需要的时候立刻被回收。这种机制非常适合PyTorch管理tensor占用的显存。只要tensor不再被使用，它所占用的显存就会被立刻释放。至于GC的效率倒不是那么重要，毕竟神经网络的性能瓶颈在于GPU而非CPU。并且在神经网络的场景下，一般tensor是不会出现循环引用的。

参考资料：[Understanding GPU Memory 2: Finding and Removing Reference Cycles](https://pytorch.org/blog/understanding-gpu-memory-2/)

> Python will clean up non-cyclic objects immediately using reference counting. However objects in reference cycles are only cleaned up later by a cycle collector.

这篇文章也讲解了如何分析循环引用导致的显存占用过多的问题。
