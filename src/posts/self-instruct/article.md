最近看到一篇比较有意思的论文：[Self-Instruct: Aligning Language Models with Self-Generated Instructions](https://arxiv.org/abs/2212.10560)。这篇论文的思路就是让LLM自己生成指令微调数据集，然后用它反过来训练自己。这么做有点左脚踩右脚的感觉。基于这个思路，斯坦福大学的团队训练了一个名为Alpaca的模型，模型的权重、数据集和代码都在GitHub上开源了：[tatsu-lab/stanford_alpaca](https://github.com/tatsu-lab/stanford_alpaca)。下面就简单介绍一下这个方法。

## 总体流程

Self-Instruct的总体流程可以用下面的伪代码来表示：

```
初始化数据集

while True:
    从数据集中随机采样instruction，生成新的instruction
    判断instruction是否为分类任务
    if 是:
        用输出优先（output-first）的方法生成input和output
    else:
        用输入优先（input-first）的方法生成input和output
    评估生成的数据质量，过滤掉质量差的数据
    将生成的新数据加入数据集
```

这里需要详细解释的步骤有以下几个：

1. 如何用采样的instruction生成新的instruction。
2. 如何判断instruction是否为分类任务。
3. 如何生成input和output。

## 生成instruction

这个步骤首先是要从数据集中随机采用一些instruction，然后构造以下的prompt：

```
请给出一系列的任务：

任务1：{任务1的描述}
任务2：{任务2的描述}
...
任务n：{任务n的描述}
任务n+1：
```

例如：

```
请给出一系列的任务：

任务1：给出一个句子，判断这个句子的情感是正面还是负面。
任务2：将下面的段落翻译成中文。
...
任务n：给出一个一元一次方程，求解这个方程。
任务n+1：
```

## 判断是否为分类任务

这个步骤比较简单，直接构造prompt询问LLM即可：

```
下面的任务是分类任务吗？

任务：{任务1的描述}
答案：{是/否}

任务：{任务2的描述}
答案：{是/否}

...

任务：{任务n的描述}
答案：{是/否}

任务：{任务n+1的描述}
答案：
```

## 生成input和output

Self-Instruct会根据instruction是否为分类任务来采取不同的方式。如果是分类任务，就用output-first的方式生成input和output；如果不是分类任务，就用input-first的方式生成input和output。

### Output-first

Output-first的方式是先让LLM给出可能的output，然后再让LLM生成input。这个过程可以用下面的prompt来表示：

```
给出一个分类任务，生成所有可能的标签及其对应的输入：

任务：{任务1的描述}
输出：{任务1的标签1}
输入：{任务1的标签1对应的输入}
输出：{任务1的标签2}
输入：{任务1的标签2对应的输入}
...
输出：{任务1的标签n}
输入：{任务1的标签n对应的输入}

...

任务：{任务n的描述}
```

### Input-first

Input-first的方式就很直接了，直接给出instruction，然后让LLM生成input和output：

```
给出一个任务，生成尽可能多的输入和输出：

任务：{任务1的描述}
输入：{任务1的输入1}
输出：{任务1的输出1}
输入：{任务1的输入2}
输出：{任务1的输出2}
...
输入：{任务1的输入n}
输出：{任务1的输出n}

...

任务：{任务n的描述}
```

其实input-first和output-first没什么本质的区别，只是prompt模板给LLM的引导不同。
