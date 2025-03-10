最近在安装Isaac Sim的时候，遇到了提醒我关闭IOMMU的警告。下面总结一下在Linux系统中关闭IOMMU的方法。

要关闭IOMMU，最简单的办法是修改内核的启动参数。首先用文本编辑器打开`/etc/default/grub`，找到`GRUB_CMDLINE_LINUX_DEFAULT="..."`这一行（如果没有就添加这一行），然后在引号中添加以下内容：

```
GRUB_CMDLINE_LINUX_DEFAULT="intel_iommu=off amd_iommu=off"
```

保存文件后，运行以下命令更新grub配置：

```bash
sudo update-grub
```

然后重启系统就可以了。
