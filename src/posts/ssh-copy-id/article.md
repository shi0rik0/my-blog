用密码进行 SSH 登入麻烦又不安全。这篇文章将会教你如何将本地机器的 SSH 密钥添加到远程机器，用密钥快速登入 SSH。

首先，如果是 Windows 系统，建议安装下 Git for Windows，哪怕你不用 Git。因为 Git for Windows 附带了 SSH 客户端工具，以及兼容 Linux 的 Git Bash。

如果你的电脑上还没有 SSH 密钥，就输入下面的命令生成一个：

```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
```

然后运行下面的命令将本机密钥复制到远程机器上（Widnows 下面要在 Git Bash 中运行，因为`ssh-copy-id`不是 Windows 可执行文件）：

```sh
ssh-copy-id username@remote_host
```

运行命令的时候，会让你输入密码登入远程机器。

`ssh-copy-id`命令还有两个常用的参数：

- `-i`：可以用来指定密钥文件的路径。
- `-f`：默认情况下，`ssh-copy-id`需要同时提供私钥和公钥。如果只有公钥，就需要加上这个参数。

例如：

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub -f username@remote_host
```
