const path = require("path");
const mongoose = require("mongoose");

class DatabaseConnection {
	constructor() {
		this.config = require(path.join(__dirname, "../config")).database;
		this.schemas = require(path.join(__dirname, "../util")).database.schemas;

		this.connection = mongoose.connection;
		mongoose.connect(this.config.address, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	}
}

module.exports = DatabaseConnection;
