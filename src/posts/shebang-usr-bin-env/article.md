假设我们要编写一个 bash 脚本，很多人会这么写 shebang：

```
#!/bin/bash
```

这么做相当于是指定了绝对路径，但有时候，我们希望操作系统在 PATH 中寻找程序，这时候就可以利用`/usr/bin/env`：

```
#!/usr/bin/env bash
```
