我们知道，A\*算法的伪代码如下：

```python
start_point = Point(pos=start_pos, g=0, h=heuristic(start_pos, end_pos))
open_list = {start_point}
closed_list = {}

while not open_list.is_empty():
    # 从open_list中取出f值最小的点
    current = open_list.pop_point_with_lowest_f()
    # 如果当前点是目标点，说明找到最短路径了
    if current == end_point:
        return reconstruct_path(current)
    # 否则，处理当前点的邻居
    for neighbor in get_neighbors(current):
        # 已经在closed_list中的点无需处理
        if neighbor in closed_list:
            continue
        tentative_g = current.g + cost(current, neighbor)
        tentative_h = heuristic(neighbor, end_pos)
        tentative_neighbor = Point(pos=neighbor, g=tentative_g, h=tentative_h)
        # 如果邻居点是新发现的点，直接加入open_list
        if neighbor not in open_list:
            open_list.add(tentative_neighbor)
        # 否则，检查能否更新邻居点的g值
        elif tentative_neighbor.g < open_list.get(neighbor).g:
            open_list.update(tentative_neighbor)
    # 当前点处理完毕，加入closed_list
    closed_list.add(current)
```

假如令`heuristic(start, end)`永远返回0，那么A\*算法就会退化为Dijkstra算法。

这里实现上最困难的步骤是`open_list.update(tentative_neighbor)`这个分支，因为更改g值会影响到f值，而open_list是一个按照f值排序的优先队列，因此需要重新调整这个点在open_list中的位置，这种操作叫做“decrease-key”操作。基于二叉堆的优先队列实现并不能高效地支持这种操作，因此有两种解决方案：

1. 使用一个hash表来降低decrease-key操作的时间复杂度：
   - 使用一个hash表来存储点到其在open_list中的位置的映射。
   - 当需要更新g值时，先在hash表中找到点在open_list中的位置，然后降低其g值，并进行冒泡操作来调整其位置。
2. 不使用decrease-key操作：
   - 不更新open_list中的点，而是无论如何都将新的点加入open_list中，然后在处理节点时忽略那些已经在closed_list中的点。

第一种方法是教科书和大多数实现采用的方法，但是它的实现比较复杂。也有研究认为，第二种方法的性能在稀疏图上会更好。

## 参考资料

1. https://stackoverflow.com/questions/9255620/why-does-dijkstras-algorithm-use-decrease-key
2. [Priority Queues and Dijkstra’s Algorithm (UTCS Technical Report TR-07-54)](https://www3.cs.stonybrook.edu/~rezaul/papers/TR-07-54.pdf)
