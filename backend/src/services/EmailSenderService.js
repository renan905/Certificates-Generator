require('dotenv').config()

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { spawn } = require('child_process');
const { setTimeout } = require('timers/promises');

const knex = require("../database");
const CertificateStatus = require("../commons/enums/CertificateStatus")

// This class need to became a Singleton
class EmailSender {

	sendEmailPython = async (destinationEmail, certificateFilePath, certificateUUID, emailMessage, emailSubject) => {
		try {

			const inputDocFilePath = path.join(
				__dirname,
				"mailer.py"
			);
			const pythonProcess = spawn(
				'python3',
				[
					inputDocFilePath,
					certificateFilePath,
					`${certificateUUID}.pdf`,
					emailSubject,
					emailMessage,
					destinationEmail,
					process.env.EMAIL,
					process.env.EMAIL_PASSWORD
				]);

			pythonProcess.stdout.on('data', (data) => {
				console.log("Success")
				console.log(data)
				this.updateCertificateStatus(CertificateStatus.EmailSended, certificateUUID)
			});

		} catch (error) {
			console.error(error)
			this.updateCertificateStatus(CertificateStatus.FailureToSendEmail, certificateUUID)
		}

	}

	sendEmail = async (destinationEmail, certificateUUID, emailMessage, emailSubject) => {

		const oAuth2Client = new google.auth.OAuth2(process.env.SMTP_CLIENT_ID, process.env.SMTP_CLIENT_SECRET, process.env.SMTP_REDIRECT_URL);
		oAuth2Client.setCredentials({ refresh_token: process.env.SMTP_REFRESH_TOKEN });

		const accessToken = await oAuth2Client.getAccessToken();

		// Configure email client
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: process.env.EMAIL,
				clientId: process.env.SMTP_CLIENT_ID,
				clientSecret: process.env.SMTP_CLIENT_SECRET,
				refreshToken: process.env.SMTP_REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});


		const outputPDFFilePath2 = path.join(
			__dirname,
			"..",
			"database",
			"raw",
			"certificates",
			certificateUUID + ".pdf"
		);

		console.log(certificateUUID)
		console.log(outputPDFFilePath2)

		let retryCounter = 0;
		let success = false;

		while (true) {
			await transporter
				.sendMail({
					from: `Seu Certificado <${process.env.EMAIL}>`,
					to: destinationEmail,
					subject: emailSubject,
					text: emailMessage,
					attachments: [
						{
							filename: certificateUUID + ".pdf",
							content: outputPDFFilePath2,
							contentType: 'application/pdf',
						},
					],
				})
				.then((message) => {
					console.log(message);
					success = true;
				})
				.catch((err) => {
					console.error(err);
					retryCounter += 1;
				});

			if (success || retryCounter >= 5) {
				break;
			} else {
				sleep(3000).then(() => console.log('I waited'));
			}
		}

		if (success) {
			this.updateCertificateStatus(CertificateStatus.EmailSended, certificateUUID)
		} else {
			this.updateCertificateStatus(CertificateStatus.FailureToSendEmail, certificateUUID)
		}
	}

	updateCertificateStatus = async (certificateStatus, certificateUUID) => {
		await knex("certificates")
			.update({
				emailStatus: certificateStatus
			})
			.where({ url: certificateUUID });
	}
}


module.exports = EmailSender;
