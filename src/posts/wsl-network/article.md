## 主机到WSL

在WSL中，执行以下命令可以获得WSL的IP地址：

```bash
hostname -I
```

主机可以通过这个IP地址连接到WSL。

## WSL到主机

在WSL中，执行以下命令可以获得主机的IP地址：

```bash
ip route
```

主机的IP地址在`default via`后面，也就是默认路由的下一跳地址。

也可以通过以下命令直接将结果提取出来：

```bash
ip route | grep default | awk '{print $3}'
```

WSL中可以通过这个IP地址连接到主机。
