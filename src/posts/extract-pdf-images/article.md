最近我遇到了这么一个问题：我用扫描仪扫描出来的文件是 PDF 格式的，然而我希望得到的是图片格式。从理论上说，扫描仪生成的 PDF 文件应该也只是图片的集合，因此只需要解析 PDF 文件就可以提取了。有一个名为`pypdf`的 Python 库就可以解析 PDF 文件中的对象。

```python
from pypdf import PdfReader

reader = PdfReader('test.pdf')

for p in reader.pages:
    for i in p.images:
        with open(i.name, 'wb') as f:
            f.write(i.data)
```

最后再补充说明一下 PDF 格式的大体原理。PDF 文件是由许多“对象”组成的。每个对象都有唯一的编号。可以通过编号来引用对象。对象有很多种，文字、图片乃至页都可以是对象。页对象里面记录着每一页有哪些对象，以及这些对象的位置、大小等。
