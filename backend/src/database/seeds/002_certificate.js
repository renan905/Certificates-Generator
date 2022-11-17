require('dotenv').config()

exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("certificates")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("certificates").insert([
				{
					issuedBy: 1,
					owner: "2",
					ownerEmail: process.env.EMAIL,
					status: "Success",
					title: "Sample Certificate Title",
					url: process.env.APP_URL,
					template: 1
				},
			]);
		});
};
