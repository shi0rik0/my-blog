题目网址：https://leetcode.cn/problems/multi-search-lcci/

## 解题思路

这题是前缀树（也叫字典树、Trie）的一个典型应用。我们可以将所有需要查询的单词插入到前缀树中，然后对字符串的每个字符进行遍历，查找以该字符为起点的所有单词。

## 参考实现

```python
class Node:
    def __init__(self, idx=-1, children=None):
        self.idx = idx
        self.children = {} if children is None else children

class Solution:
    def multiSearch(self, big: str, smalls: List[str]) -> List[List[int]]:
        # 构建前缀树
        root = Node()
        for i, s in enumerate(smalls):
            node = root
            for j, ch in enumerate(s):
                if ch not in node.children:
                    node.children[ch] = Node()
                node = node.children[ch]
                if j == len(s) - 1:
                    node.idx = i

        # 遍历大字符串，查找所有小字符串
        ans = [[] for _ in range(len(smalls))]
        for i in range(len(big)):
            node = root
            j = i
            while j < len(big) and big[j] in node.children:
                node = node.children[big[j]]
                j += 1
                if node.idx != -1:
                    ans[node.idx].append(i)
        return ans
```
