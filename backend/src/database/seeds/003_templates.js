exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("templates")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("templates").insert([
				{
					id: 1,
					user_id: 1,
					name: "sample",
					filename: "sample",
					size: 0,
					mimetype: "-",
				},
			]);
		});
};
