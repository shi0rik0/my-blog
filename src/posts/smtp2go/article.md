最近我想实现这么一个功能：编写一个程序监控股价，当剧烈波动时，就给我发个推送通知。仔细想了想，发现成本最低、实现最简单的推送方法是就是给我的邮箱发个邮件。但很可惜的是，现在主流的邮箱服务商都启用了2FA，因此不能直接通过用户名和密码来发送邮件了。最后我找到了一个名为[SMTP2GO](https://www.smtp2go.com/)的服务商，它们提供的SMTP服务可以直接使用用户名和密码来发送邮件。下面是利用Python和SMTP2GO来发送邮件的教程。

首先要注册一个SMTP2GO的账户。注意：SMTP2GO不支持用public domain的邮箱（例如outlook.com等）注册，必须通过企业、学校邮箱之类的注册。

注册之后，在控制台的"Sending" -> "Verified Senders" -> "Single sender emails"里添加一个发件人邮箱。这个邮箱可以是任意邮箱，不一定是你注册SMTP2GO时用的邮箱。当你发送邮件的时候，收件人看到的发件人就是这个邮箱。

然后在"Sending" -> "SMTP Users"里添加一个SMTP用户。用户名就是你刚刚添加的发件人邮箱，密码自己设置。

然后就可以用Python通过SMTP发送邮件了，下面是一段示例代码：

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

smtp_server = "mail.smtp2go.com"
smtp_port = 2525
smtp_user = "<替换为你的用户名>"
smtp_password = "<替换为你的密码>"
recipient_email = "<替换为收件人邮箱>"
subject = "邮件的标题"
body = "邮件内容"

msg = MIMEMultipart()
msg["From"] = smtp_user
msg["To"] = recipient_email
msg["Subject"] = subject
msg.attach(MIMEText(body, "plain"))

with smtplib.SMTP(smtp_server, smtp_port) as server:
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(smtp_user, recipient_email, msg.as_string())
```
