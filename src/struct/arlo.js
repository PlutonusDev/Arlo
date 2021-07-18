const fs = require("fs");
const path = require("path");
const { Client, Intents, Collection } = require("discord.js");

class Arlo extends Client {
	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.GUILD_VOICE_STATES
			],
			allowedMentions: {
				parse: ["users"]
			}
		});

		this.db = null;
		this.config = require(path.join(__dirname, "../config")).discord;
		this.categories = [];
		this.commands = new Collection();
		this.musicQueue = new Map();

		return this;
	}

	async start() {
		// Load modules
		await fs.readdir(path.join(__dirname, "../modules"), (e, categories) => {
			categories.forEach(async category => {
				await fs.readdir(path.join(__dirname, "../modules", category), (e, modules) => {
					modules.forEach(module => {
						try {
							require(path.join(__dirname, "../modules", category, module));
						} catch {
							// TODO: Handle module load error
						}

						const command = require(path.join(__dirname, "../modules", category, module));
						if(this.categories.indexOf(category) === -1) this.categories.push(category);
						if(this.commands.get(command.name)) return; // TODO: Handle duplicate command names.

						this.commands.set(command.name, {
							module: command,
							category: category
						});
					});
				});
			});
		});

		// Load events
		await fs.readdir(path.join(__dirname, "../events"), (e, events) => {
			events.forEach(event => {
				event = event.replace(/\.js$/i, "");
				this.on(event, (data, ...args) => require(path.join(__dirname, "../events", event))(this, data, args));
			});
		});

		await this.login(this.config.tokens.discord);
	}
}

module.exports = Arlo;
