Hydra是Meta团队开发的一个Python库，主要是用来管理配置的。虽然我个人比较反感这种框架，因为我觉得配置本身是一个很简单的需求，没必要搞得这么复杂，但是Habitat仿真器的配置就是用Hydra加载的，所以还是不得不稍微了解一下。

Hydra配置文件都是用YAML格式编写的，下面是一个例子：

main.yaml:

```yaml
defaults:
  - _self_
  - db/engine: mysql
  - network

db:
  engine:
    name: postgresql
```

db/engine/mysql.yaml:

```yaml
name: mysql
```

network.yaml:

```yaml
host: localhost
port: 3306
```

那么，加载main.yaml后得到的配置对象是：

```json
{
  "db": {
    "engine": {
      "name": "mysql"
    }
  },
  "network": {
    "host": "localhost",
    "port": 3306
  }
}
```

接下来我将解释一下配置文件的细节。

首先是main.yaml中的`defaults`字段，这个字段会被Hydra特别处理，它的作用是加载其他配置，所以我觉得其实叫做`imports`更合适。这个字段是一个列表，列表中的元素可以是以下三种类型：

- `_self_`：表示加载当前配置文件。
- 一个键值对，例如`db/engine: mysql`，表示在`db/engine`这个group中加载`mysql.yaml`这个配置文件。（Group是Hydra的一个术语，下面会详细介绍，这里你可以理解为是配置文件所在的目录。）需要注意的是，如果指定了group，Hydra会将分隔符`/`看作是`.`，所以`db/engine/mysql.yaml`中的配置都会被放在`db.engine`这个对象中。
- 一个字符串，例如`network`，表示加载`network.yaml`这个配置文件。

优先级方面，在`defaults`列表中越靠后的配置优先级越高。

接下来要介绍一下group这个概念。Hydra的group有两种实现方法，一种是用文件夹来实现，一种是用ConfigStore来实现。用文件夹实现很好理解，比如说group是`db/engine`，那么就会在这个文件夹下面查找配置文件。而用ConfigStore实现就是用代码来添加group，下面是一个例子：

```python
from hydra.core.config_store import ConfigStore
from dataclasses import dataclass

@dataclass
class MySQLConfig:
    name: str = "mysql"

cs = ConfigStore.instance()
# 效果等同于创建一个db/engine/mysql.yaml文件
cs.store(group="db/engine", name="mysql", node=MySQLConfig)
```

所以说，当你看到一个group的时候，要么在Hydra的搜索路径下看看有没有这个文件夹，要么在代码里看看有没有注册过这个group。

还有一点，一个Hydra应用是可以通过命令行参数来覆盖或者新增配置的，如果是覆盖配置，就传入`key=value`，如果是新增配置，就传入`+key=value`（需要一个加号）。例如：

```bash
python main.py db.engine.name=sqlite +db.engine.version=3.0
```
