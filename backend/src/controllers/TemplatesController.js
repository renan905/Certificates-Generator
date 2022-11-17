const express = require('express');
const router = express.Router();

const multer = require("multer");
const multerConfig = require("../middleware/multer/TemplateMulter");

const TemplatesService = require("../services/TemplatesService");

router.get("/:userId", TemplatesService.getTemplatesByUserId);

router.post("/upload", multer(multerConfig).single("file"), TemplatesService.upload);

module.exports = router;