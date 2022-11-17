#!/usr/bin/python

## credits: http://linuxcursor.com/python-programming/06-how-to-send-pdf-ppt-attachment-with-html-body-in-python-sderFromEmailcript
import smtplib
import sys
import time

from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# The password neeed to be configured in https://myaccount.google.com/apppasswords

def send_email_pdf_figs(pathToPDF, filename, subject, message, destination_email, sender_from_email, send_from_email_password):
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()

        server.login(sender_from_email, send_from_email_password)
        
        msg = MIMEMultipart()

        msg['Subject'] = subject
        msg['From'] = sender_from_email
        msg['To'] = destination_email

        # Insert the text to the msg going by e-mail
        msg.attach(MIMEText(message, "plain"))

        # Attach the pdf to the msg going by e-mail
        with open(pathToPDF, "rb") as f:
            attach = MIMEApplication(f.read(), _subtype="pdf")

        attach.add_header('Content-Disposition','attachment', filename=str(filename))
        msg.attach(attach)
        
        server.send_message(msg)

        print("ok")
        sys.stdout.flush()
        return True

    except Exception as e:
        my_file = open('mailer-error.txt', 'w')
        print(f'{e}', file = my_file)
        my_file.close()
        return False
    

if __name__ == '__main__':
    pathToPDF = sys.argv[1]
    filename = sys.argv[2]
    subject = sys.argv[3]
    message = sys.argv[4]
    destination_email = sys.argv[5]
    sender_from_email = sys.argv[6]
    send_from_email_password = sys.argv[7]

    # Dummy Synchronization
    time.sleep(3)

    retry_counter = 0;
    while(True):
        result = send_email_pdf_figs(pathToPDF, filename, subject, message, destination_email, sender_from_email, send_from_email_password)
        if (result or retry_counter >= 5):
            break
        else:
            retry_counter += 1