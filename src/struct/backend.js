const path = require("path");
const express = require("express");
const cors = require("cors");

module.exports = class Backend {
	constructor() {
		this.app = express();
		this.config = require(path.join(__dirname, "../config")).backend;
		this.db = null;

		this.app.use(cors({ origin: true, credentials: true }));

		console.log("BACKEND UP");
		this.app.get("/", (req, res) => {
			console.log("RESPONSE GOT");
			console.log(req.body);
			res.status(200).json([{hello:"world"}]);
		});

		this.app.get("/userGuilds", (req, res) => {
			console.log(req.body);
			res.status(200).json({hello:"world"})
		});

		return this;
	}

	async start() {
		await this.app.listen(3001);
	}
}
