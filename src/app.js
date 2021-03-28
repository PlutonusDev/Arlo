const chalk = require("chalk");

const Azure = require("./struct");
const utils = require("./util");
const config = require("./data/config");

const { Logger, Error } = utils;
const { Discord, Database, Webpanel } = Azure;

const init = async () => {
    Logger.log("Initializing Azure!");

    const db = new Database(config.database);
    db.on("ready", () => Logger.log("Database connected!"));
    db.on("info", m => Logger.log(`[${chalk.blue("DATABASE")}] ${m}`));
    db.on("error", e => new Error({ name: "Database Error", info: e.message }));

    const bot = new Discord(config.discord);
    bot.on("ready", () => Logger.log("Discord bot online!"));
    bot.on("info", m => Logger.log(`[${chalk.green("DISCORD")}] ${m}`));
    bot.on("warning", m => Logger.log(`[${chalk.green("DISCORD")}] (${chalk.yellow("WARNING")}) ${m}`));
    bot.on("error", e => new Error({ name: "Discord Error", info: e }));

    db.connect();
    bot.connect();

    bot.allocDB(db.connection);
}

init();