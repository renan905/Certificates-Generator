exports.up = async (knex) =>
	knex.schema
		.createTable("certificates", (table) => {
			table.increments("id"); // certificared id
			table.text("owner"); // info about the onwer
			table.text("ownerEmail"); // info about the email of the onwer
			table.text("title"); // certificared title
			table.text("url");
			table.text("urlPath");
			table.text("status"); // status *success, *notready, *error
			table.text("metaData");
			table.text("emailStatus");
			table.text("error");

			table.timestamp("created_at").defaultTo(knex.fn.now());
			table.timestamp("updated_at").defaultTo(knex.fn.now());

			// relacionamento
			table
				.integer("issuedBy") // info about the user how has issued the certificated
				.references("users.id")
				.notNullable()

			table
				.integer("template")
				.references("templates.id")
				.notNullable()

		});

exports.down = async (knex) => knex.schema.dropTable("certificates");
