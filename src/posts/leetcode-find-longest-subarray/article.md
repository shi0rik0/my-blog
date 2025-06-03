题目链接：https://leetcode.cn/problems/find-longest-subarray-lcci/

## 解题思路

这道题可以转化为一个经典的问题：在一个数组中找到和为k的最长子数组。我们只要将数组中的字母替换成1，数字替换成-1，那么原题就变成了在一个数组中找到和为0的最长子数组。

要解决这个问题，我们需要用到一个叫做“前缀和”的技巧。我们用`sum(i, j)`表示数组在区间`[i, j)`上的和（`sum(i, i) = 0`），如果令数组`prefix[i] = sum(0, i)`，那么就可以快速计算出`sum(i, j) = prefix[j] - prefix[i]`。

在一个数组中找到和为k的最长子数组，就等价于找到满足`j - i`最大的`i`和`j`，使得`prefix[j] - prefix[i] = k`。这是一个双变量的优化问题，我们可以先固定`j`，然后优化`i`，这时候就要最小化`i`，使得`prefix[i] = prefix[j] - k`。我们可以用一个哈希表来存储每个前缀和第一次出现的位置，这样就可以在O(1)的时间内找到满足条件的`i`。

## 代码实现

```python
def find_longest_array_with_sum_k(arr, k):
    # 计算前缀和
    prefix_sum = [0]
    for i in arr:
        prefix_sum.append(prefix_sum[-1] + i)
    sum_dict = {} # 存储前缀和第一次出现的位置
    max_len = 0
    i_max = 0
    j_max = 0
    # 先固定j，然后优化i
    for j in range(len(arr) + 1):
        n = prefix_sum[j] - k
        if n in sum_dict:
            i = sum_dict[n] # 最小的i
            if j - i > max_len:
                max_len = j - i
                i_max = i
                j_max = j
        if prefix_sum[j] not in sum_dict:
            sum_dict[prefix_sum[j]] = j
    return i_max, j_max


class Solution:
    def findLongestSubarray(self, array: List[str]) -> List[str]:
        arr = [1 if i.isalpha() else -1 for i in array]
        i, j = find_longest_array_with_sum_k(arr, 0)
        return array[i:j]
```
