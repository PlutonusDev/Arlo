const chalk = require("chalk");

const Azure = require("./struct");
const utils = require("./util");
const config = require("./data/config");

const { Logger, Error } = utils;
const { WebPanel, Discord, Database } = Azure;

const instLog = m => Logger.log(`[${chalk.magenta("INSTANCE")}] ${m}`);

const init = async () => {
    Logger.log("Initializing Azure!");

    const db = new Database(config.database);
    db.on("ready", () => instLog("Database connected!"));
    db.on("info", m => Logger.log(`[${chalk.cyan("DATABASE")}] ${m}`));
    db.on("error", e => new Error({ name: "Database Error", info: e.message }));

    const bot = new Discord(config.discord);
    bot.on("ready", () => instLog("Discord bot online!"));
    bot.on("info", m => Logger.log(`[${chalk.green("DISCORD")}] ${m}`));
    bot.on("warning", m => Logger.log(`[${chalk.green("DISCORD")}] (${chalk.yellow("WARNING")}) ${m}`));
    bot.on("error", e => new Error({ name: "Discord Error", info: e }));

    const panel = new WebPanel(config.webpanel);
    panel.on("ready", () => instLog("Panel is online!"));
    panel.on("info", m => Logger.log(`[${chalk.yellow("WEBPANEL")}] ${m}`));
    panel.on("error", e => new Error({ name: "WebPanel Error", info: e }));

    await db.connect();
    bot.allocDB(db);
    panel.allocDB(db);

    bot.connect();
    panel.start();

    db.allocBot(bot.client);
}

init();