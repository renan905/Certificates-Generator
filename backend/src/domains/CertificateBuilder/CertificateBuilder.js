require('dotenv').config()

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");
const fs = require("fs");
const path = require("path");

const knex = require("../../database");
const EmailSender = require("../../services/EmailSenderService")

const CertificateStatus = require("../../commons/enums/CertificateStatus")
const FileExtensions = require("../../commons/enums/FileExtensions")

class CertificateBuilder {

	emailSender = new EmailSender();

	data = {};

	constructor(data, title, metaData, templateFileName, certificateUUID, outputFileUrlPath) {
		this.data.metaData = metaData;
		this.data.issuedBy = data.issuedBy;
		this.data.title = title;
		this.data.templateId = data.templateId;
		this.data.templateName = templateFileName;
		this.data.url = certificateUUID;
		this.owner = metaData.owner;
		this.ownerEmail = metaData.ownerEmail;
		this.urlPath = outputFileUrlPath;
	}

	// Get the temaplete file and load the metadata
	generateNewDocFile = () => {
		const templateFile = fs.readFileSync(
			path.resolve(
				__dirname,
				"..",
				"..",
				"database",
				"raw",
				"templates",
				this.data.templateName
			),
			"binary"
		);

		const zip = new PizZip(templateFile);
		let doc = new Docxtemplater(zip);

		doc.setData(this.data.metaData);
		doc.render();

		let buffer = doc.getZip().generate({ type: "nodebuffer" });
		fs.writeFileSync(
			path.resolve(
				__dirname,
				"..",
				"..",
				"database",
				"raw",
				"certificates",
				this.data.url + FileExtensions.docx
			),
			buffer
		);
	}

	// Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
	convertToPdf = (inputDocFile, outputPDFFilePath) => {
		libre.convert(inputDocFile, ".pdf", undefined, (err, done) => {
			if (err) {
				console.log(`Error converting file: ${err}`);
			}

			// Here in done you have pdf file which you can save or transfer in another stream
			fs.writeFileSync(outputPDFFilePath, done);
		});
	};

	updateCertificateStatus = async (certificateStatus) => {
		await knex("certificates")
			.update({
				status: certificateStatus,
			})
			.where({ url: this.data.url });
	}

	// Convert a doc/docx to pdf
	convertDocToPDF = async () => {
		// Input Doc file path
		const inputDocFilePath = path.join(
			__dirname,
			"..",
			"..",
			"database",
			"raw",
			"certificates",
			this.data.url + FileExtensions.docx
		);

		// Output PDF file path
		const outputPDFFilePath = path.join(
			__dirname,
			"..",
			"..",
			"database",
			"raw",
			"certificates",
			this.data.url + FileExtensions.pdf
		);

		// Read file
		const inputDocFile = fs.readFileSync(inputDocFilePath);

		this.convertToPdf(inputDocFile, outputPDFFilePath);
		await this.updateCertificateStatus(CertificateStatus.Success)

		this.deleteDocFile(FileExtensions.docx);

		return outputPDFFilePath;
	}

	deleteDocFile = (fileExtention) => {
		const enterPath = path.join(
			__dirname,
			"..",
			"..",
			"database",
			"raw",
			"certificates",
			this.data.url + fileExtention
		);

		fs.unlink(enterPath, (err) => {
			if (err) {
				console.error(err);
				return;
			}
		});
	}

	async new(certificateUUID, emailMessage, emailTitle) {
		let outputPDFFilePath;
		try {
			this.generateNewDocFile();
			outputPDFFilePath = await this.convertDocToPDF();

		} catch (error) {
			console.error(error)
			await this.updateCertificateStatus(CertificateStatus.Error);
			this.deleteDocFile(FileExtensions.docx);
			return;
		}

		try {
			await this.emailSender.sendEmailPython(this.ownerEmail, outputPDFFilePath, certificateUUID, emailMessage, emailTitle);
			console.log("Email enviado");
		} catch (error) {
			console.error(error);
			await this.updateCertificateStatus(CertificateStatus.Error);
			return;
		}

		await this.updateCertificateStatus(CertificateStatus.Success);
	}
}

module.exports = CertificateBuilder;
