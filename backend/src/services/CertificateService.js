require('dotenv').config()

const path = require("path");
const fs = require("fs");
const papa = require("papaparse");
const knex = require("../database");

const { v4: uuidv4 } = require('uuid');

const CertificateStatus = require("../commons/enums/CertificateStatus")
const ErrosStatus = require("../commons/enums/ErrosStatus")
const SystemPaths = require("../commons/FileSystemConstants")
const FileExtensions = require("../commons/enums/FileExtensions")

const CertificateBuilder = require("../domains/CertificateBuilder/CertificateBuilder");

class CertificateService {

	static async index(req, res, next) {
		try {
			const { id, page = 1 } = req.query;
			const results = await knex("certificate")
				.join("users", "users.id", "=", "certificate.user_id")
				.select("certificate.*", "users.username")
				.where({ user_id: id })
				.orderBy('certificate.created_at', 'DESC')
				.paginate({
					perPage: 20,
					currentPage: page,
					isLengthAware: true
				});

			return res.json({ success: true, results });
		} catch (error) {
			next(error);
		}
	};

	static async getCertificatesByOwnerId(req, res) {
		try {
			const { ownerUUID, page = 1 } = req.query;
			const ownerCertificates = await knex("certificate")
				.select("certificate.*")
				.where({ owner: ownerUUID })
				.orderBy('certificate.created_at', 'DESC')
				.paginate({
					perPage: 20,
					currentPage: page,
					isLengthAware: true
				});

			return res.json({ success: true, ownerCertificates });
		} catch (error) {
			console.log(error);
		}
	};

	static async create(req, res, next) {
		try {
			const { title, user_id } = req.body;

			await knex("certificate").insert({
				title,
				user_id,
				url,
			});

			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	};

	static async status(req, next) {
		try {
			const { status, url } = req;

			await knex("certificate").update({ status }).where({ url });
		} catch (error) {
			next(error);
		}
	};

	static async new(req, res, next) {
		try {
			const { data } = req.body;
			const { title, user_id, templateId, metaData, ownerEmail } = data;

			if (title == undefined || title == "" || user_id == undefined || user_id == "" || templateId == undefined || templateId == "" || metaData == undefined || metaData == "" || ownerEmail == undefined || ownerEmail == "") {
				res.status(400);
				res.json({ success: false });
			}

			const certificateUUID = uuidv4();
			const status = CertificateStatus.NotReady;

			const template = await knex("templates").where({
				user_id,
				id: templateId
			});

			if (template.length < 1) {
				return res.status(401).send({ mesagem: "Temaplete file not found" });
			}

			data.template_name = template[0].filename;

			const outputFileUrlPath = process.env.APP_URL + "/files/certificate/" + certificateUUID + FileExtensions.pdf;

			await knex("certificate").insert({
				title,
				user_id,
				owner,
				template_name,
				url: certificateUUID,
				urlPath: outputFileUrlPath,
				status,
				metaData,
			});

			const certificateService = new CertificateBuilder(data, certificateUUID, outputFileUrlPath);
			certificateService.new();

			return res.status(201).send();

		} catch (error) {
			next(error);
		}
	};


	static async upload(req, res, next) {
		try {
			const { title, issuedBy, templateId, emailMessage, emailTitle } = req.body;

			if (title == undefined || title == "" || issuedBy == undefined || issuedBy == "" || templateId == undefined || templateId == "") {
				res.status(400);
				res.json({ success: false });
			}

			const certificateDataFileName = req.file.filename;
			const certificateDataFilePath = path.join(
				__dirname,
				"..",
				"database",
				"raw",
				"certificates",
				"metadata",
				certificateDataFileName
			);

			const certificateDataFile = fs.readFileSync(certificateDataFilePath, "utf8");

			const parser = papa.parse(
				certificateDataFile,
				{
					header: true,
				}
			);

			fs.unlink(certificateDataFilePath, (err) => {
				if (err) {
					console.error(err);
				}
			});

			const templateFile = await knex("templates")
				.select("templates.*")
				.where({
					user_id: issuedBy,
					id: templateId,
				});

			if (templateFile.length < 1) {
				res.status(404)
				res.json({ success: false, mesagem: "Temaplete file not found" });
			}

			const templateFileName = templateFile[0].filename;

			parser.data.map(async metaData => {
				const { owner, ownerEmail } = metaData;

				const certificateUUID = uuidv4();
				const outputFileUrlPath = process.env.APP_URL + SystemPaths.Certificates + certificateUUID + FileExtensions.pdf;

				if (owner == undefined || owner == "") {
					await knex("certificates").insert({
						title,
						issuedBy,
						owner: uuidv4(),
						error: ErrosStatus.NoOwner,
						ownerEmail: ErrosStatus.NoEmail,
						template: templateId,
						url: certificateUUID,
						urlPath: outputFileUrlPath,
						status: CertificateStatus.NotReady,
						metaData: JSON.stringify(metaData),
					});
				} else {
					await knex("certificates").insert({
						title,
						issuedBy,
						owner,
						ownerEmail: (ownerEmail == undefined || ownerEmail == "") ? ErrosStatus.NoEmail : ownerEmail,
						template: templateId,
						url: certificateUUID,
						urlPath: outputFileUrlPath,
						status: CertificateStatus.NotReady,
						metaData: JSON.stringify(metaData),
					});
				}

				const certificateBuilder = new CertificateBuilder(req.body, title, metaData, templateFileName, certificateUUID, outputFileUrlPath);
				certificateBuilder.new(certificateUUID, emailMessage, emailTitle);
			})

			return res.status(201).send();

		} catch (error) {
			next(error);
		}
	};
};

module.exports = CertificateService;
