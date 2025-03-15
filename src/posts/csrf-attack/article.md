## 什么是CSRF攻击

CSRF 攻击是利用了浏览器的一个安全漏洞。假设用户在 a.com 上登入，浏览器获得了 cookie，接下来如果用户访问 b.com，而 b.com 访问了 a.com，则浏览器会将 cookie 附加在请求上，从而可能在用户不知情的情况下以登入权限进行了 a.com 的操作。尽管较新的浏览器修复了部分漏洞，但是由于要保持互联网的兼容性，因此并没有完全修复这个问题，并且我们不能假设用户使用的都是较新的浏览器，因此对 CSRF 攻击进行防御还是有必要的。

## 如何防御CSRF攻击

### 浏览器发起请求的两种分类

要防御 CSRF 攻击，首先要知道在什么情况下，访问 b.com 的时候浏览器会对 a.com 发起请求。主要有两种情况：

1. 浏览器内置的行为：b.com的页面中有一个`<img>`标签，`src`属性指向a.com，这样浏览器会向a.com发起请求，或者有一个`<form>`表单，`action`属性指向a.com，这样如果用户提交了表单，则浏览器会向a.com发起请求。可能还有其他情况，这里只列出了最常见的情况。

2. JavaScript脚本发起的请求：b.com执行了一个JavaScript脚本，脚本中向a.com发起了请求。

对于第二种情况，这些请求会受到CORS机制的限制，而第一种情况则不会。这里我们还要补充一个概念：简单请求（Simple Request，其定义参见[这里](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)）。简单来说，所有第一种情况下可能发出的请求都是简单请求。

然后我们还要解释一下CORS机制的一个细节：CORS 机制对于简单请求和复杂请求的处理是不同的。对于复杂请求，它会先给服务器发送一个 OPTIONS 请求，只有服务器返回一个允许的响应，浏览器才会发起真正的请求。而对于简单请求，浏览器会**直接发送真正的请求**，只不过如果服务器的响应没有说允许请求，那么浏览器将不会允许脚本获得响应的值。此时服务器还是收到了请求。这意味着什么呢？设想一下，如果一个 API 的功能是修改密码，那么只要服务器执行了该请求，攻击就已经成功了，这与浏览器脚本能否获得响应值无关。

### 防御方法

最简单的防御方法自然是完全不使用Cookie来认证，但是这样未免有点因噎废食。还有一种常用的方法是利用CSRF token，但是这种方法不适合于前后端分离的架构。这里我要介绍一种更简单的防御方法：添加自定义请求header。

我们只需要自定义一个请求header，例如`X-CSRF-TOKEN`，然后在服务端拒绝所有不包含这个header的请求即可（当然OPTIONS请求还是要按正常逻辑处理）。这样一来就拒绝了所有简单请求，而复杂请求只可能是由JavaScript脚本发起的，受到CORS的限制会先发送一个OPTIONS请求，这样就保证了只有同源的情况下才能发起真正的请求。

## 参考资料

1. https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

2. https://owasp.org/www-community/attacks/csrf

3. https://danielw.cn/web-security-xss-csrf-cn#csrf

4. https://security.stackexchange.com/a/58308
