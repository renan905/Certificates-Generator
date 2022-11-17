const knexfile = require("../../knexfile");
const knex = require("knex")(knexfile["development"]);

const { attachPaginate } = require('knex-paginate');
attachPaginate();

module.exports = knex;
