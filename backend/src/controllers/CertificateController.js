const express = require('express');
const router = express.Router();

const multer = require("multer");
const multerConfig = require("../middleware/multer/CertificateDataMulter");

const CertificateService = require("../services/CertificateService");

router.get("/", CertificateService.index);
router.get("/by-owner", CertificateService.getCertificatesByOwnerId);


router.post("/new", CertificateService.new);
router.post("/upload", multer(multerConfig).single("file"), CertificateService.upload);

module.exports = router;