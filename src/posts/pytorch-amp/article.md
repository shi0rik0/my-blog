最近尝试了用混合精度的方法来加速模型训练。要用PyTorch进行混合精度训练非常简单，因为PyTorch已经封装好了这个功能，API也很便捷，要import的东西只有下面这些：

```python
from torch.amp import autocast, GradScaler
```

要启用混合精度训练，对原有代码的改动也很少。首先是把前向传播的代码用`autocast`包裹起来：

```python
with autocast('cuda'):
    outputs = model(inputs)
    loss = criterion(outputs, targets)
```

然后在反向传播的时候，用`GradScaler`来缩放梯度：

```python
scaler = GradScaler()

# In the training loop:
scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()
optimizer.zero_grad()
```

## 实验结果

我在一台配备RTX 4090的机器上进行了实验，发现对于GPT-2，混合精度训练确实能够大幅提升训练速度，但是对于普通的全连接层或者卷积层，提升效果并不明显。我的解释是：Transformer模型的计算量远大于全连接层或者卷积层，这样才能体现出混合精度训练的优势。
