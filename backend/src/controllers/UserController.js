require('dotenv').config()
const knex = require("../database/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config()


module.exports = {
	async index(req, res, next) {
		try {
			const results = await knex("users");
			return res.json(results);
		} catch (error) {
			next(error);
		}
	},
	async login(req, res, next) {
		try {
			const { username, password } = req.body;

			const check = await knex("users").where({ username });

			if (check.length < 1) {
				return res.status(401).send();
			}
			bcrypt.compare(password, check[0].password, (err, result) => {
				if (err) {
					return res.status(401).send();
				}
				if (result) {
					const token = jwt.sign(
						{
							id: check[0].id,
							username: check[0].username,
						},
						process.env.JWT_KEY,
						{
							expiresIn: "12h",
						}
					);
					return res.status(200).send({
						token: token,
						id: check[0].id,
						username: check[0].username,
					});
				}
				return res.status(401).send();
			});
		} catch (error) {
			next(error);
		}
	},
	async create(req, res, next) {
		try {
			const { username, password, user_type } = req.body;
			const check = await knex("users").where({ username });

			if (check.length > 0) {
				return res.status(401).send();
			} else {
				await knex("users").insert({
					username,
					password: bcrypt.hashSync(password, 10),
					user_type,
				});
				return res.status(201).send();
			}
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const { username, password } = req.body;
			const { id } = req.params;

			const check = await knex("users").where({ username });

			if (check.length > 0 && check[0].id.toString() !== id) {
				return res.status(401).send();
			} else {
				await knex("users")
					.update({
						username,
						password: bcrypt.hashSync(password, 10),
						// user_type,
					})
					.where({ id });

				return res.send();
			}
		} catch (error) {
			next(error);
		}
	},
	async delete(req, res, next) {
		try {
			const { id } = req.params;

			await knex("users").where({ id }).del();

			return res.send();
		} catch (error) {
			next(error);
		}
	},
};
