const EventEmitter = require("events");
const mongoose = require("mongoose");
const crypto = require("crypto");

module.exports = class Database extends EventEmitter {
    constructor(config = { host: "mongodb://localhost/Azure" }) {
        super();

        this.config = config;
        this.mongoose = mongoose;
        this.connected = false;
        this.bot = false;
        this.schemas = {
            User: new mongoose.Schema({
                username: String,
                discriminator: String,
                id: String,
                avatar: String,
                security: {
                    oAuth_Access: String,
                    oAuth_Refresh: String,
                    token: String
                },
                guilds: [{
                    id: String,
                    permissions: String
                }]
            }),
            Guild: new mongoose.Schema({
                name: String,
                id: String,
                icon: String,
                editable: Boolean,

                settings: {
                    prefix: String
                }
            })
        }
        this.models = {
            User: mongoose.model("User", this.schemas.User, "users"),
            Guild: mongoose.model("Guild", this.schemas.Guild, "guilds")
        }
        this.refs = {};

        this.connection = this.mongoose.connection;

        this.connection.once("open", () => this.emit("ready"));
        this.connection.on("error", e => this.emit("error", e));

        return this;
    }

    async connect() {
        await this.mongoose.connect(this.config.host, {useNewUrlParser: true, useUnifiedTopology: true});
        this.refs = {
            users: this.connection.db.collection("users"),
            guilds: this.connection.db.collection("guilds")
        }
        this.emit("info", "Database connection established.")
    }

    allocBot(conn) {
        this.bot = conn;
        this.emit("info", "Reference to bot received.")
    }

    userExists(id) {
        return new Promise(res => {
            this.refs.users.findOne({ id: id }, (e, user) => {
                if(user) return res(true);
                res(false);
            });
        });
    }

    createUser(userObj) {
        return new Promise(async res => {
            userObj.security.token = this.makeToken();
            const user = new this.models.User(userObj);
            await user.save();
            res(user);
            this.emit("info", `Created user '${user.username}'`);
        })
    }

    fetchUser(id) {
        return new Promise(res => {
            this.refs.users.findOne({ id: id }, (e, user) => {
                if(user) return res(user);
                res(false);
            });
        });
    }

    guildExists(id) {
        return new Promise(res => {
            this.refs.guilds.findOne({ id: id }, (e, guild) => {
                if(guild) return res(true);
                res(false);
            });
        });
    }

    createGuild(guildObj) {
        return new Promise(async res => {
            const guild = new this.models.Guild(guildObj);
            await guild.save();
            res(guild);
            this.emit("info", `Created guild '${guild.name}'`);
        })
    }

    fetchGuild(id) {
        return new Promise(res => {
            this.refs.guilds.findOne({ id: id }, (e, guild) => {
                if(guild) return res(guild);
                res(false);
            });
        });
    }

    updateGuildSettings(guildId, settings) {
        return new Promise(async res => {
            if(!this.guildExists(guildId)) return res(false);
            for(setting of settings) {
                await this.refs.guilds.updateOne({ id: guildId }, {
                    $set: {
                        settings: {
                            [settings[setting].name]: settings[setting].value
                        }
                    }
                });
            }
            res(true);
        });
    }

    fetchUserGuilds(userId) {
        return new Promise(async res => {
            const user = await this.fetchUser(userId);
            if(!user) return false;
            const guilds = [];
            for(guild of Object.keys(user.guilds)) {
                const fetchedGuild = await this.fetchGuild(user.guilds[guild].id);
                //console.log(fetchedGuild);
                guilds.push({
                    id: fetchedGuild.id,
                    name: fetchedGuild.name,
                    icon: fetchedGuild.icon,
                    editable: fetchedGuild.editable
                });
            }
            res(guilds);
        });
    }

    assignGuilds(guildsObj, userId) {
        return new Promise(async res => {
            const user = await this.fetchUser(userId);
            user.guilds = [];
            guildsObj.forEach(async guild => {
                const known = await this.fetchGuild(guild.id);
                const dg = await this.bot.guilds.cache.get(guild.id);
                if(known) {
                    if(guild.name !== known.name || guild.icon !== known.icon || (dg === undefined && known.editable) || (dg !== undefined && !known.editable)) {
                        await this.refs.guilds.updateOne({ id: known.id }, { $set: { name: guild.name, icon: guild.icon, editable: dg !== undefined ? true : false } })
                    }
                } else {
                    await this.createGuild({
                        name: guild.name,
                        id: guild.id,
                        icon: guild.icon,
                        editable: dg !== undefined ? true : false
                    });
                }
                user.guilds.push({
                    id: guild.id,
                    permissions: guild.permissions
                });
                await this.refs.users.updateOne({ id: user.id }, { $set: { guilds: user.guilds } });
            });
            this.emit("info", `Updated guilds for user '${userId}'`)
        });
    }

    makeToken() {
        return `Azure-V1-${crypto.randomBytes(12).toString("hex")}-${crypto.randomBytes(4).toString("hex")}`;
    }
}