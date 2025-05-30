题目链接：https://leetcode.cn/problems/shortest-supersequence-lcci/

## 解题思路

这个题目属于一类很典型的问题：给定一个数组，要找到满足某个性质的**最短子数组**。这类问题往往可以用滑动窗口的方式来解决。

下面是滑动窗口的模板代码：

```python
arr = get_input_arr()
status = init_status()
left = 0
right = 0
min_len = float('inf')
ans = []
while True:
    if right < len(arr) and not is_condition_met(status):
        right += 1
        status.update(left, right)
    else:
        if left == len(arr):
            break
        # 如果有多个相同长度的最短子数组，会保留左侧索引最小的
        if is_condition_met(status) and right - left < min_len:
            min_len = right - left
            ans = [left, right - 1]
        left += 1
        status.update(left, right)
return ans
```

## 实现代码

```python
class Solution:
    def shortestSeq(self, big: List[int], small: List[int]) -> List[int]:
        memo = {i: 0 for i in small}
        count = 0  # 记录memo中有多少个元素的值大于0
        left = 0
        right = 0
        min_len = float('inf')
        ans = []
        while True:
            if right < len(big) and count < len(small):
                if big[right] in memo:
                    if memo[big[right]] == 0:
                        count += 1
                    memo[big[right]] += 1
                right += 1
            else:
                if left == len(big):
                    break
                if count == len(small) and right - left < min_len:
                    min_len = right - left
                    ans = [left, right - 1]
                if big[left] in memo:
                    memo[big[left]] -= 1
                    if memo[big[left]] == 0:
                        count -= 1
                left += 1
        return ans
```
