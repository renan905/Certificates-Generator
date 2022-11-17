const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    dest: path.resolve(__dirname, "..", "..", "database", "raw", "certificates", "metadata"),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(
                null,
                path.resolve(
                    __dirname,
                    "..",
                    "..",
                    "database",
                    "raw",
                    "certificates",
                    "metadata"
                )
            );
        },
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname);
            const filename = uuidv4() + fileExtension;
            cb(null, filename);
        },
    }),

    limits: {
        fileSize: 10 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "application/vnd.ms-excel",
            "text/csv",
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."));
        }
    },
};
