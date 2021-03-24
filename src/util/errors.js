const logger = require("./logger");
const chalk = require("chalk");
const captureCaller = require("get-caller-file");

module.exports = class AzureError {
	constructor(data = {name: "Unknown Error", info: "???"}) {
		this.data = data;
		console.log();
		logger.error(`Azure encountered an error!\n\n\t${chalk.green(captureCaller())}: "${chalk.yellow(this.data.name)}"\n\t> ${chalk.yellow(this.data.info)}`);
		return process.exit(0);
	}
}
