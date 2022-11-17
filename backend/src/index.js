require("dotenv").config();

const express = require("express");
const morgan = require('morgan')
const cors = require("cors");
const path = require("path");

const router = require("./router");
const Message = require('./commons/utils/Message');

const server = express();

server.use(express.json());
server.use(cors());
server.use(morgan('combined'))

server.use(
	"/files/certificates",
	express.static(path.resolve(__dirname, "database", "raw", "certificates"))
);

server.use(
	"/files/template",
	express.static(path.resolve(__dirname, "database", "raw", "template"))
);

server.use(router);

server.listen(process.env.APP_PORT || 3000, error => {
	Message.release(`\nAPI Version: ${process.env.APP_VERSION}`)
	Message.success(`Server is running on port: ${process.env.APP_PORT || 3000}\n`)
	if (error) Message.error('Server off!(\n')
});
