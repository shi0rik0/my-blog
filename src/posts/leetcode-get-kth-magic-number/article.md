题目链接：https://leetcode.cn/problems/get-kth-magic-number-lcci/

## 解题思路

这道题有时间复杂度为O(k)的解法，但是这里介绍一个更通用且更容易理解的算法，其时间复杂度为O(k log k)。

给出集合$\{f(a, b, c) | a, b, c \in \mathbb{N}^+\}$，其中$f(a, b, c) = 3^a \cdot 5^b \cdot 7^c$。我们需要找到这个集合中的第k个最小值。注意到$f(a, b, c)$是单调递增的，也就是说如果$a_1 \leq a_2$，$b_1 \leq b_2$，$c_1 \leq c_2$，那么$f(a_1, b_1, c_1) \leq f(a_2, b_2, c_2)$。因此，假如我们把这个问题看作一个按照大小顺序进行搜索的问题，那么下一个要搜索的(a, b, c)一定会和已搜索过的(a, b, c)相邻，所以我们只需要用一个优先队列来存储已搜索过的(a, b, c)的邻居，从中获取下一个要搜索的(a, b, c)即可。我们还需要一个哈希表来记录已搜索过的(a, b, c)，以避免重复搜索。

## 代码实现

```python
import heapq

class Solution:
    def getKthMagicNumber(self, k: int) -> int:
        seen = set()
        queue = [1]
        i = 0
        while True:
            n = heapq.heappop(queue)
            if n in seen:
                continue
            seen.add(n)
            i += 1
            if i == k:
                return n
            heapq.heappush(queue, n * 3)
            heapq.heappush(queue, n * 5)
            heapq.heappush(queue, n * 7)
```
