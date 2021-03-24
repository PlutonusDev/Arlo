const Azure = require("./struct");
const utils = require("./util");
const config = require("./data/config");

const { Logger, Error } = utils;
const { Discord, Database, Webpanel } = Azure;

const init = async () => {
    Logger.log("Initializing Azure!");

    const db = new Database(config.database);
    db.on("ready", () => Logger.log("Database connected!"));
    db.on("error", e => new Error({ name: "Database Error", info: e.message }));

    const bot = new Discord(config.discord);
    bot.on("ready", () => Logger.log("Discord bot online!"));
    bot.on("error", e => new Error({ name: "Discord Error", info: e.message }));

    db.connect();
    bot.connect();
}

init();
//throw new AzureError({name: "lol rip", info: "well fuck, what the hell happened, sam?"});