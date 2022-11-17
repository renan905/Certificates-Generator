const bcrypt = require("bcrypt");

exports.seed = function (knex) {
	return knex("users")
		.del()
		.then(function () {
			const pass = "12345";
			return knex("users").insert([
				{
					id: 1,
					username: "admin",
					email: "admin@admin.com",
					password: bcrypt.hashSync(pass, 10),
					user_type: 'SystemAdministrator',
				},
				{
					id: 2,
					username: "user",
					email: "user@user.com",
					password: bcrypt.hashSync(pass, 10),
					user_type: 'SystemManager',
				},
			]);
		});
};
