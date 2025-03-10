最近强迫症发作，突然想到一个很无聊的问题：软件的第一个版本应该是什么？0.0.1？0.1.0？还是0.0.0？

这种情况我一般会选择随大流或者相信权威。语义化版本（Semantic Versioning）是一个被广泛采用的标准。在[Semantic Versioning 2.0.0](https://semver.org/)中，有这样一段话：

How should I deal with revisions in the 0.y.z initial development phase?

The simplest thing to do is start your initial development release at 0.1.0 and then increment the minor version for each subsequent release.

How do I know when to release 1.0.0?

If your software is being used in production, it should probably already be 1.0.0. If you have a stable API on which users have come to depend, you should be 1.0.0. If you’re worrying a lot about backward compatibility, you should probably already be 1.0.0.

根据以上内容，一个软件的版本号最初应该是**0.1.0**，然后正式版的第一个版本号是1.0.0。
