最近在Ubuntu 24.04上安装Unity Hub的时候遇到了很多问题，下面记录一下解决的过程。

首先在官网上下载Unity Hub的deb包，安装之后就可以通过`unityhub`命令来启动Unity Hub，但是直接启动会报错，提示为找不到sandbox。

这个问题的解决办法是安装Chrome，然后将sandbox的文件复制过去：

```bash
sudo cp /opt/google/chrome/chrome-sandbox /opt/unityhub
sudo chown root:root /opt/unityhub/chrome-sandbox
sudo chmod 4755 /opt/unityhub/chrome-sandbox
```

然后启动Unity Hub就会发现一直卡在加载界面，错误提示为`Licensing SDK logging callback is not registered`，这个问题的解决办法是手动安装`libssl1.1`：

```bash
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.0g-2ubuntu4_amd64.deb
sudo dpkg -i libssl1.1_1.1.0g-2ubuntu4_amd64.deb
```

然后**重启**系统，即可正常使用Unity Hub。

## 参考

1. https://www.reddit.com/r/unity/comments/1g44vuk/linuxubuntu_2410up_to_date_how_to_install_unity/
2. https://discussions.unity.com/t/error-in-run-unity-hub/880643/20
