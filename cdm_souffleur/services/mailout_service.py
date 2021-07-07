from cdm_souffleur import app
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import request
from cdm_souffleur.utils.constants import SMTP_PORT_STL


def send_email(receiver_email, first_name, type, request_parameter = ''):
    print(app.config['SMTP_SERVER'])
    print(app.config['SMTP_PORT'])
    message = create_message(receiver_email, first_name, type, request_parameter)

    context = ssl.create_default_context()
    try:
        server = smtplib.SMTP(app.config['SMTP_SERVER'], app.config['SMTP_PORT'])
        if app.config['SMTP_PORT'] == SMTP_PORT_STL:
            start_tls(server, context)
        server.login(app.config['SMTP_USER'], app.config['SMTP_PWD'])
        server.sendmail(app.config['SMTP_EMAIL'], receiver_email, message.as_string())
    except Exception as e:
        raise e
    finally:
        server.quit()


def start_tls(server, context):
    server.ehlo()
    server.starttls(context=context)
    server.ehlo()


def create_message(receiver_email, first_name, type, request_parameter):
    message = MIMEMultipart("alternative")
    message["From"] = app.config['SMTP_EMAIL']
    message["To"] = receiver_email

    if type == 'registration':
        html = get_registration_html(first_name, request_parameter)
        message["Subject"] = "Perseus account activation"
    else:
        message["Subject"] = "Perseus account recovery"
        html = get_reset_password_html(first_name, request_parameter)

    message.attach(MIMEText(html, "html"))
    return message


def get_registration_html(first_name, registration_key):

    html = f"""\
<div class="registration"
     style="width: 509px; height: 314px; padding: 10px; box-sizing: border-box">
  <div class="registration__header"
       style="padding-bottom: 15px; border-bottom: 1px solid #e5e5e5">
    <img alt="Perseus" src="http://{app.config['SERVER_HOST']}/img/logo.png">
  </div>
  <br>

  <div class="registration__content"
       style="font-family: Arial,serif; font-size: 16px; line-height: 30px; color: #404040">
    <p style="margin: 0">
      Dear {first_name},
      <br>
      thank you for registering to Perseus.
      <br><br>
      Please <a href="http://{app.config['SERVER_HOST']}/api/confirm_registration?token={registration_key}" style="text-decoration: none; outline: none; color: #066BBB">click here to activate your account</a> and confirm your E-mail.
      <br><br>
    </p>

    <span class="registration__button" style="display: inline-block; text-align: center; background: #066BBB; border-radius: 2px">
      <span style="display: inline-block">
        <a href="http://{app.config['SERVER_HOST']}/api/confirm_registration?token={registration_key}"
           style="color: #fff; border-color: #066BBB; border-width: 9px 29px; border-style: solid; text-align: center; text-decoration: none; outline: none; font-weight: 500; font-size: 14px; line-height: 18px;">
          Activate Account
        </a>
      </span>
    </span>
  </div>
</div>
            """
    return html


def get_reset_password_html(first_name, reset_pwd_key):

    html = f"""\
        <div class="recovery" style="width: 509px; height: 314px; padding: 10px; box-sizing: border-box">
  <div class="recovery__header"
       style="padding-bottom: 15px; border-bottom: 1px solid #e5e5e5">
    <img alt="Perseus" src="http://{app.config['SERVER_HOST']}/img/logo.png">
  </div>
  <br>

  <div class="recovery__content"
       style="font-family: Arial,serif; font-size: 16px; line-height: 30px; color: #404040;">
    <p style="margin: 0">
      Hi {first_name},
      <br>
      we recieved a request to change your Perseus password.
      <br>
      Please <a href="http://{app.config['SERVER_HOST']}/api/check_password_link?token={reset_pwd_key}" style="text-decoration: none; outline: none; color: #066BBB">click here to reset your password.</a>
      <br><br>
      <b>Did not request this change?</b> <a href="http://{app.config['SERVER_HOST']}/api/register_unauthorized_reset_pwd_request?token={reset_pwd_key}" style="text-decoration: none; outline: none; color: #066BBB">Let us know</a>, if it were not you.
      <br><br>
    </p>

    <span class="recovery__button" style="display: inline-block; text-align: center; background: #066BBB; border-radius: 2px">
      <span style="display: inline-block">
        <a href="http://{app.config['SERVER_HOST']}/api/check_password_link?token={reset_pwd_key}"
           style="color: #fff; border-color: #066BBB; border-width: 9px 34px; border-style: solid; text-align: center; text-decoration: none; outline: none; font-weight: 500; font-size: 14px; line-height: 18px;">
          Reset Account
        </a>
      </span>
    </span>
  </div>
</div>
           """
    return html