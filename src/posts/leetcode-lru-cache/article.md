原题网址：https://leetcode.com/problems/lru-cache/description/

## 实现思路

很显然，一个LRU缓存需要支持以下操作：

1. 将尾部的元素删除。（即淘汰最久未使用的元素）
2. 将其中一个元素移动到头部。（即将最近使用的元素标记为最新）
3. 将一个新元素插入到头部。
4. 给定key，查询对应的元素位置。

双向链表能够高效地实现操作1-3，而hash表能够高效地实现操作4，所以我们考虑同时使用双向链表和hash表来实现LRU缓存。

## 参考代码

下面的代码是在我的答案基础上，经过LLM优化后的版本。总的来说实现并不难，但是双向链表的操作有很多corner case需要小心处理。实现时可以用虚拟头节点和虚拟尾节点这个常用的技巧来简化链表操作。

```python
class Node:
    def __init__(self, key, val, next_node, prev_node):
        self.key = key
        self.val = val
        self.next = next_node
        self.prev = prev_node

class LRUCache:

    def __init__(self, capacity: int):
        self.cap = capacity
        # 使用虚拟头节点和虚拟尾节点可以简化链表操作
        # self.head -> MRU -> ... -> LRU -> self.tail
        self.head = Node(None, None, None, None) # 虚拟头节点
        self.tail = Node(None, None, None, None) # 虚拟尾节点
        self.head.next = self.tail
        self.tail.prev = self.head

        self.dict = {} # 存储 key -> Node 映射
        self.count = 0 # 记录当前缓存中的元素数量

    # 辅助函数：将节点移动到链表头部（虚拟头节点之后）
    def _move_to_front(self, node):
        # 1. 从当前位置移除节点
        node.prev.next = node.next
        node.next.prev = node.prev

        # 2. 将节点插入到头部（在self.head和self.head.next之间）
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    # 辅助函数：从链表尾部移除节点（虚拟尾节点之前）
    def _remove_tail(self):
        # 要移除的节点是 self.tail.prev
        node_to_remove = self.tail.prev

        # 从字典中删除
        del self.dict[node_to_remove.key]

        # 从链表中移除
        node_to_remove.prev.next = self.tail
        self.tail.prev = node_to_remove.prev

        self.count -= 1 # 移除后减少计数
        return node_to_remove.key # 返回被移除节点的key

    def get(self, key: int) -> int:
        if key in self.dict:
            node = self.dict[key]
            self._move_to_front(node) # 访问后移动到头部
            return node.val
        else:
            return -1


    def put(self, key: int, value: int) -> None:
        if key in self.dict:
            node = self.dict[key]
            node.val = value # 更新值
            self._move_to_front(node) # 访问后移动到头部
            return

        # 如果key不存在，创建新节点
        new_node = Node(key, value, None, None)
        self.dict[key] = new_node
        self.count += 1

        # 如果缓存已满，先淘汰最久未使用的节点
        if self.count > self.cap:
            self._remove_tail() # 移除尾部节点

        # 将新节点插入到头部
        self._move_to_front(new_node)
```
