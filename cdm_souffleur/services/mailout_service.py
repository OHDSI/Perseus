import smtplib
import ssl

def send_reset_password_email(email):
    try:
        port = 587  # For SSL
        smtp_server = "mail.arcadialab.ru"
        sender_email = "tt311449@gmail.com"  # Enter your address
        receiver_email = email  # Enter receiver address
        password = "test1234!"
        message = """\
        Subject: Hi there

        This message is sent from Python."""

        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server) as server:
            server.login('maria.dolotova@arcadia.spb.ru', "")
            server.sendmail(sender_email, receiver_email, message)
    except Exception as error:
        raise error