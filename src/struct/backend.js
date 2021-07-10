const path = require("path");
const express = require("express");

module.exports = class Backend {
	constructor() {
		this.app = express();
		this.config = require(path.join(__dirname, "../config")).backend;
		this.db = null;

		return this;
	}

	async start() {
		await this.app.listen(3001);
	}
}
