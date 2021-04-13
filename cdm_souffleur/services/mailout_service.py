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
    <img alt="Perseus" src="data:image/png;base64,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">
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
    <img alt="Perseus" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAAAaCAYAAADokvM0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAaxSURBVHgB7ZzvWds6FMbf5uE72aBiAsIENROUTnDdCeBOQDpBwwSECRoW4LoTABNUTHDTBbhXb3xEhCPZsq38oeT3PCKJLUuyfM6RzpHMhyzLJgDO0Y6pSd+KotDuQVOWMh//mKTQHpY3js1s6mI9GfrxIOnW1D3DnnfPwKSxSRrtyE26N0J56R4UBTntUB45N+UNsVlGKO/lBxVsC/Xv2TEGRojnKIV43u5SUHjGRoh+mZTbg45SPKAdLO8C2yMz6Qf2vGs4Qlgh/hvdUCZdG6W4lilTH6U437KVzgj2vFsG9osR4qn5uEJ3cpN+2WmUM/K0mZtve5QgGfa8Wz64P8Q601kdoR8apZM8lXL5+VfktVSkI1GoIDVOtbm0OK25jveYm/Q9kIUO9hl2BGmvQmks5qZtbUfdPS04cH9QCM0D+GK+3qN8AF1RKKdRn1AqRi4zkRilsKPEGGtAFG1i2sO2+BT/sHpAhJKRuAxxETTWQcG98gmwKe8C/sjeF+av1Jc55wuUo64tR5kPjshU4NbPazAYqLu7uyestk859ceUa+93JfIo5dE38/U1jY93RmCu4T15jZa55qiS1/ZXjm4Rzq/WeB94KtOmAvoT1+hPzmTKG4tSaJQPsAn6EpOmUaInj4gYCXuEkhcRLLn3b5Vz1uqvXCMP9xoN9Zl8I2lXUp9LBPG6Q7n2fnNzvzeVc6H7PUSY0DWvyPqF+lcY+A4m8CeqjBmNgkylIvLvgi9h6dvZYxkRYriMqU+EgFY3tTIodFMGl6ko66bgKKKQiEHohAxlKeerCmVnfzTpJiL/uY1abQuxlgr9iRkV0aKuDAmFwIHPPIWSfccGEMVL6u8d1J00SnFScepG8nlc+d2GPDIfy6UgfcX2yGrOcQR98OT3+UlDPryEDvHnmnOsI2qq+fz8/Lty6DiQVcM/snPe7hsNNjVCZDXnrF8Tg7ZfDppyyjzeFlz48oimplIYF85JvY5aAj5G5Am1fe5zBk1bZwgHDtgXsQ+Ifc6y6PDqyvG6dk1Nu/oYEBU4/midThcJlPh8zaRTuRpC9WiTTrr4oI0KEYNj+Qr+kVHFbaxPURTiOu7SlEdrrFM52RJhytAdbzskSoee5TLSVGC3+Bdvi2FXWYlWiHVFNSLIJSFS2LjY/B+68xiTaU0r2vNIZQg97FyM0bzh2p8tNzMOA/d7jO0Sus+hBHEK1F/LZ124M5BohZD4eKpw7C4TIygKpXHYFnyQZ4FzZ2jmQkLgp5HT0TMkdl4TUTcFVYjzVzXl2hqIAVog88iYsGkd1MwCfqd02+gdnK74mKL9ZswqyqQ3vcNXnlVfGVIoF5EXgYBWCiGNGKO9UmiUCsBVVq4yWudzU9GIGDScVeBdRqx6X8NEFHZnvacrDCL0NQ40CotQcWuFIKIUdWsJdhTgFIv7ko4kKsPjXFCaYNUXuULc+kRqNErhOllTNGstmLayD7nNpq+F/IQ3jAR0TtBfdugmDftEmSjgdKqsldcm3aK0/g+uly/D8iXC1ujlbTmTt5C8ypNPY2nFQ/tj2EExW9k1Sie2i3VhHW1X8gskRua9M+nfptE2hz8krNAM67nFjiKGLJcdAU39wPPehcPBYHDYWSGcjYB0tmYh6yrRibq9Oa9eHaWfIkrBY9UH+OIEmjwhQY6N1PRh7ovLbwtR6qIuT8+o2OMu3W+IyH6oO91vHUKEcwJ/xQqlImQ1RdwUnveoHY0vsBwt1rVA14VGR9RZi1mEQVO2XYSbxuJJDunKJ5ljObdWiN9+76NxETNbbrNpc798xu7i41DqohXPmi6WPqa1r+uH6u/a/x+QZGGuimkoKx2jXnCoDHnNeXe0yIsW/4BgA4yczYrECn71u4U+yhjpUIjfAtOEjsiTZ6/3lbn3qDz56ehOnd9PCBO7z8sH25AjEdzKklwhJHxFJ0cjPJ+bNSmDRSzNGNuBvkLIsiqsZ4PdpnEXIuknhCxohu7YqOIuw5n2PLlCiNef298yvI8k2ZXNbW7Ya8MUpYAo/JlovJ7y8jsFt3FK2AY6/0YMKBdNDq/LPHU7GlgESdYyZXIRB7fAG8QJHDCipfBnoVHum9L2QOKXw6qwH2PeLaEiUDipnPfYTL+/rFSvXSHWCOPOPz3HNRIiW1YY6h3jdZjZ4jqv9ruW39ZhrK4VFPATGwJehLaxfKvMdeDtW2iqpg5Ok7xvJFaifJ+xaqW15zs/f2N574WnXB4/ysp/WVQtl9exr2ZuhFCUMziqiAKfYHnvyinXBgJU4HJb58Q1Cv8DSuqmJrm8P0IAAAAASUVORK5CYII=">
  </div>
  <br>

  <div class="recovery__content"
       style="font-family: Arial,serif; font-size: 16px; line-height: 30px; color: #404040;">
    <p style="margin: 0">
      Hi {first_name},
      <br>
      we recieved a request to change your Perseus password.
      <br>
      Please <a href="http://{app.config['SERVER_HOST']}/reset-password?token={reset_pwd_key}" style="text-decoration: none; outline: none; color: #066BBB">click here to reset your password.</a>
      <br><br>
      <b>Did not request this change?</b> <a href="http://{app.config['SERVER_HOST']}/api/register_unauthorized_reset_pwd_request?token={reset_pwd_key}" style="text-decoration: none; outline: none; color: #066BBB">Let us know</a>, if it were not you.
      <br><br>
    </p>

    <span class="recovery__button" style="display: inline-block; text-align: center; background: #066BBB; border-radius: 2px">
      <span style="display: inline-block">
        <a href="http://{app.config['SERVER_HOST']}/reset-password?token={reset_pwd_key}"
           style="color: #fff; border-color: #066BBB; border-width: 9px 34px; border-style: solid; text-align: center; text-decoration: none; outline: none; font-weight: 500; font-size: 14px; line-height: 18px;">
          Reset Account
        </a>
      </span>
    </span>
  </div>
</div>
           """
    return html