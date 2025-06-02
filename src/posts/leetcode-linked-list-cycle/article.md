原题网址：https://leetcode.cn/problems/linked-list-cycle-lcci/

## 解题思路

这道题目就是经典的[Floyd龟兔赛跑算法](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare)。这个算法主要分为两个部分，第一个部分就是如何判定是否有环，第二个部分就是如何找到环的起点。第一个部分比较简单，很容易理解，因此也很脍炙人口。但是第二个部分就比较少人知道了，因为其推导过程相对复杂一些，具体可以参考[LeetCode官方的题解](https://leetcode.cn/problems/linked-list-cycle-lcci/solutions/531787/huan-lu-jian-ce-by-leetcode-solution-s2la/)。

## 代码实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def detectCycle(self, head: ListNode) -> ListNode:
        if head is None:
            return None
        slow = head.next
        if slow is None:
            return None
        fast = slow.next
        if fast is None:
            return None
        while slow is not fast:
            for _ in range(2):
                fast = fast.next
                if fast is None:
                    return None
            slow = slow.next
        third = head
        while third is not slow:
            slow = slow.next
            third = third.next
        return slow
```
