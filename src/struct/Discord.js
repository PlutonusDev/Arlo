const EventEmitter = require("events");
const discord = require("discord.js");

module.exports = class client extends EventEmitter {
    constructor(config) {
        super();

        this.discord = discord;
        this.config = config;
        this.client = new this.discord.Client();

        this.client.once("ready", () => this.emit("ready"));

        return this;
    }

    connect() {
        this.client.login(this.config.token).catch(e => this.emit("error", e));
    }
}