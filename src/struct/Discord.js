const fs = require("fs");
const path = require("path");

const EventEmitter = require("events");
const discord = require("discord.js");
const { Module } = require("module");

module.exports = class client extends EventEmitter {
    constructor(config) {
        super();

        this.discord = discord;
        this.config = config;
        this.client = new this.discord.Client();

        this.categories = [];
        this.commands = new this.discord.Collection();
        this.cooldowns = new this.discord.Collection();

        this.client.once("ready", () => this.emit("ready"));

        return this;
    }

    async load() {
        return new Promise(async res => {
            // First, load commands.
            this.emit("info", "Loading modules...");
            if (!fs.existsSync(path.join(__dirname, "..", "data", "modules"))) return this.emit("error", { message: "The modules folder does not exist. '/data/modules/'" })
            await fs.readdir(path.join(__dirname, "..", "data", "modules"), (err, categories) => {
                if (err) return this.emit("error", "Error reading modules folder. '/data/modules/'");
                categories.forEach(async category => {
                    await fs.readdir(path.join(__dirname, "..", "data", "modules", category), (err, modules) => {
                        if (err) return this.emit("error", `Error reading a category folder. '/data/modules/${category}'`);
                        modules.forEach(module => {
                            try {
                                require(path.join(__dirname, "..", "data", "modules", category, module));
                            } catch {
                                this.emit("error", `Error in command '${category}/${module}'`);
                            }
                            const command = require(path.join(__dirname, "..", "data", "modules", category, module));
                            if (this.categories.indexOf(category) === -1) this.categories.push(category);
                            if (this.commands.get(command.name)) return this.emit("warn", `A command already exists with the name ${module}. Skipping ${category}/${module}`);

                            try {
                                const commandStructure = {
                                    file: command,
                                    category: category || "other"
                                };

                                this.commands.set(command.name, commandStructure);
                                this.emit("info", `Loaded command: '${category}/${command.name}' - Aliases: ${command.aliases ? command.aliases.join(", ") : "No Aliases"}`);
                            } catch (e) {
                                this.emit("error", `${category}/${module}: ${e.message}`);
                            }
                        });
                    });
                });
            });

            if (!fs.existsSync(path.join(__dirname, "..", "data", "events"))) return this.emit("error", { message: "The events folder does not exist. '/data/events/'" })
            await fs.readdir(path.join(__dirname, "..", "data", "events"), (err, events) => {
                events.forEach(event => {
                    event = event.replace(/\.js$/i, "");
                    this.client.on(event, (data) => require(path.join(__dirname, "..", "data", "events", event))(this, data));
                    this.emit("info", `Bound event '${event}'`);
                })
            });
            return res();
        });
    }

    async connect() {
        this.emit("info", "Preparing to connect to Discord...");
        await this.load();
        await this.client.login(this.config.token).catch(e => this.emit("error", e));
        this.emit("info", `Took ~${process.uptime().toFixed(2)}s to start.`)
    }
}