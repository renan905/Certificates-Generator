module.exports = {
	development: {
		client: "sqlite3",
		connection: {
			filename: `${__dirname}/src/database/database.sqlite`
		},
		seeds: {
			directory: `${__dirname}/src/database/seeds`,
		},
		migrations: {
			tableName: "knex_migrations",
			directory: `${__dirname}/src/database/migrations`,
		},
	},
};
