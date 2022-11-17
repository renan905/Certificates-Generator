require('dotenv').config()

const knex = require("../database");

const SystemPaths = require("../commons/FileSystemConstants")

class TemaplatesService {
    static async getTemplatesByUserId(req, res, next) {
        try {
            const { userId, page } = req.params;
            const results = await knex("templates")
                .where({ user_id: userId })
                .orderBy('templates.created_at', 'DESC')
                .paginate({
                    perPage: 20,
                    currentPage: page,
                    isLengthAware: true
                });

            res.status(201)
            return res.json({ success: true, results });
        } catch (error) {
            next(error);
        }
    };

    static async upload(req, res, next) {
        try {
            const { userId, templateName } = req.query;
            console.log(req.query);
            console.log(req.params);

            if (userId == undefined || userId == "" || templateName == undefined || templateName == "") {
                res.status(400);
                return res.json({ success: false });
            }

            await knex("templates").insert({
                user_id: userId,
                name: templateName,
                filename: req.file.filename,
                filePath: process.env.APP_URL + SystemPaths.Templates + req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype,
            });

            res.status(201);
            return res.json({ success: true });

        } catch (error) {
            next(error);
        }
    };
};

module.exports = TemaplatesService;
