exports.up = async (knex) =>
	knex.schema
		.createTable("users", (table) => {
			table.increments("id");
			table.text("user_type"); // 0 common, 1 admin
			table.text("username").unique().notNullable();
			table.text("email").unique();
			table.text("password").notNullable();

			table.timestamp("created_at").defaultTo(knex.fn.now());
			table.timestamp("updated_at").defaultTo(knex.fn.now());
		});

exports.down = async (knex) => knex.schema.dropTable("users");
