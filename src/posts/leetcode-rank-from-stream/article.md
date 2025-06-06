题目链接：https://leetcode.cn/problems/rank-from-stream-lcci/

## 解题思路

这道题目的官方提示是使用一个携带额外信息的二叉搜索树来解决问题，用二叉搜索树的优点是对于输入数据的范围没有限制，但是缺点在于：如果使用朴素的二叉搜索树，最坏时间复杂度会很差，而平衡二叉搜索树的实现会比较复杂。考虑到题目中`x`的范围是`[0, 5e4]`，我们也可以使用树状数组来解决问题。

## 树状数组

树状数组（Binary Indexed Tree），也叫Fenwick Tree，是一种数据结构，可以用来高效地维护一个固定长度数组（设长度为`N`）的区间和。它支持两种操作：

- 单点更新：将数组中的某个元素增加一个值。时间复杂度为`O(log N)`。
- 区间和查询：计算数组中某个区间的元素和。时间复杂度为`O(log N)`。

要介绍树状数组，首先要引入一个函数`lowbit(x)`，它返回`x`的二进制表示中最低位的1和其后续的0所组成的数。例如`lowbit(34)`的二进制表示为`100010`，最低位的1和其后续的0组成的数是`10`，因此`lowbit(34) = 2`。`lowbit(x)`的计算非常简单，`lowbit(x) = x & -x`。

在树状数组中，数组的下标从1开始。假设原始数组是`a`，树状数组是`b`，用`s[i, j]`表示`a[i] + a[i+1] + ... + a[j]`，则树状数组满足以下等式：`b[i] = s[i - lowbit(i) + 1, i]`。

接下来介绍如何用树状数组进行区间和查询。因为`s[i, j] = s[1, j] - s[1, i-1]`，因此我们只需要知道怎么计算前缀和`s[1, i]`。这里要用到一个性质：对于区间`(i - lowbit(i), i]`和`(j - lowbit(j), j]`，它们要么不相交，要么其中一个是另一个的子集。这样，我们可以通过不断地向前跳跃来计算前缀和：

```python
def query(b, i):
    res = 0
    while i > 0:
        res += b[i]
        i -= lowbit(i)
    return res
```

接下来介绍如何在单点修改的时候维护树状数组。假设我们要将`a[i]`增加一个值`x`，则需要将树状数组中所有与`i`相关的元素都增加`x`。也就是说，我们需要求出所有使得`i ∈ (j - lowbit(j), j]`的`j`，然后将这些`b[j]`都增加`x`。这可以通过不断地向后跳跃来实现（证明略）：

```python
def update(b, i, x):
    while i < len(b):
        b[i] += x
        i += lowbit(i)
```

## 参考答案

```python
class FenwickTree:
    def __init__(self, s):
        self._s = s
        self._t = [0] * (self._s + 1)

    def _lb(self, x):
        return x & -x

    def add(self, idx, val):
        while idx <= self._s:
            self._t[idx] += val
            idx += self._lb(idx)

    def query(self, idx):
        ans = 0
        while idx > 0:
            ans += self._t[idx]
            idx -= self._lb(idx)
        return ans


class StreamRank:

    def __init__(self):
        self.tree = FenwickTree(50001)

    def track(self, x: int) -> None:
        self.tree.add(x + 1, 1)

    def getRankOfNumber(self, x: int) -> int:
        return self.tree.query(x + 1)
```
