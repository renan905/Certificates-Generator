exports.up = async (knex) =>
	knex.schema.createTable("templates", (table) => {
		table.increments("id");
		table.text("name");
		table.text("filename");
		table.integer("size");
		table.text("mimetype");
		table.text("filePath");

		table.timestamp("created_at").defaultTo(knex.fn.now());

		// relacionamento
		table
			.integer("user_id")
			.references("users.id")
			.notNullable()
			.onDelete("CASCADE");
	});

exports.down = async (knex) => knex.schema.dropTable("templates");
