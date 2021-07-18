const path = require("path");
const mongoose = require("mongoose");

class DatabaseConnection {
	constructor() {
		this.config = require(path.join(__dirname, "../config")).database;
		this.schemas = require(path.join(__dirname, "../util")).database.schemas;
		this.models = require(path.join(__dirname, "../util")).database.models;

		this.connection = mongoose.connection;
		mongoose.connect(this.config.address, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}).then(() => {
			// TODO: Refs should be dynamically added from models
			this.refs = {
				users: this.connection.db.collection("users"),
				guilds: this.connection.db.collection("guilds"),
				accounts: this.connection.db.collection("accounts"),
				sessions: this.connection.db.collection("sessions")
			}
		});
	}

	getUserById(id) {
		return new Promise(async res => {
			const user = await this.refs.accounts.findOne({ userId: new mongoose.Types.ObjectId(id), providerId: "discord" });
			/*	if(e) res({ failed: true, err: e.message });
				res(user || { failed: true, err: "Unknown user." });
			});*/
			res(user || { failed: true });
		});
	}
}

module.exports = DatabaseConnection;
