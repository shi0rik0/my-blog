## 安装Redis

在Ubuntu里，可以直接通过apt安装Redis：

```bash
sudo apt-get install lsb-release curl gpg
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update
sudo apt-get install redis
```

安装完成后，会自动启动Redis，并设置为开机启动。

可以通过`redis-cli`命令来测试Redis是否安装成功：

```bash
$ redis-cli
127.0.0.1:6379> ping
PONG
```

## 允许网络连接

默认情况下，Redis只允许本地连接。如果需要允许通过网络连接，可以修改`/etc/redis/redis.conf`文件，将`bind`属性修改为允许的IP地址。

默认情况下，如果通过网络连接，Redis会强制要求启用密码。如果是在内网环境下，不启用密码其实也可以。可以通过在配置文件中禁用`protected-mode`来允许无密码连接：

```
protected-mode no
```

修改完配置文件后，需要重启Redis使配置生效：

```bash
sudo systemctl restart redis
```

## 用Python连接Redis

可以通过`redis`库来连接Redis：

```bash
pip install redis
```

```python
import redis

r = redis.Redis(host='localhost', port=6379, db=0)

try:
    r.ping()
    print('Connected to Redis!')
except redis.ConnectionError:
    print('Could not connect to Redis.')
```

## Redis持久化

默认情况下，Redis的持久化文件会保存在`/var/lib/redis/dump.rdb`中。建议定时备份该文件。
