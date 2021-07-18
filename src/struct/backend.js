const path = require("path");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

module.exports = class Backend {
	constructor() {
		this.app = express();
		this.config = require(path.join(__dirname, "../config")).backend;
		this.bot = null;
		this.db = null;

		this.app.use(cors({ origin: "https://arlo.gg" }));

		this.app.get("/test", (req, res) => {
			res.status(200).send("Hello");
		});

		this.app.get("/users/:userId/guilds", (req, res) => {
			this.db.getUserById(req.params.userId).then(async user => {
				if(!user) return res.status(404).json({err:true,msg:"Unknown user."});
				const guilds = await axios({
					url: "https://discord.com/api/users/@me/guilds",
					method: "GET",
					headers: {
						Authorization: `Bearer ${user.accessToken}`
					}
				});

				if(!guilds) return res.status(500).json({err:true,msg:"Internal server error."});

				let requests = [];
				let available = [];
				let unavailable = [];
				guilds.data.forEach(guild => {
					requests.push(new Promise(async res => {
						const g = await this.bot.guilds.fetch(guild.id).catch(()=>{});
						guild.isAdmin = false;
						if((guild.permissions_new & 0x20) == 0x20) guild.isAdmin = true;
						if(g) {
							available.push(guild);
						} else {
							unavailable.push(guild);
						}
						res();
					}));
				});

				await Promise.all(requests);
				res.status(200).json({ available, unavailable });
			});
		});

		this.app.get("/users/:userId/guilds/:guildId", (req, res) => {
			this.db.getUserById(req.params.userId).then(async user => {
				if(!user) return res.status(404).json({err:true,msg:"Unknown user."});
				const guild = await this.bot.guilds.fetch(req.params.guildId).catch(()=>{});
				if(!guild) return res.status(404).json({err:true,msg:"Bot is not in guild."});
				const member = await guild.members.fetch(user.providerAccountId).catch(()=>{});
				guild.isAdmin = member ? member.permissions.has("MANAGE_GUILD") ? true : false : false;
				res.status(200).send(guild);
			});
		});

		return this;
	}

	async start() {
		await this.app.listen(3001);
	}
}
