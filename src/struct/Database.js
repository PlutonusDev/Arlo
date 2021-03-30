const EventEmitter = require("events");
const mongoose = require("mongoose");
const crypto = require("crypto");

module.exports = class Database extends EventEmitter {
    constructor(config = { host: "mongodb://localhost/Azure" }) {
        super();

        this.config = config;
        this.mongoose = mongoose;
        this.connected = false;
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
                icon: String
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
            userObj.security.token = makeToken();
            const user = new this.models.User(userObj);
            await user.save();
            res(user);
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

    assignGuilds(guildsObj, userId) {
        return new Promise(async res => {
            const user = await this.fetchUser(userId);
            guildsObj.forEach(async guild => {
                if(this.guildExists(guild.id)) {
                    const known = this.fetchGuild(guild.id);
                    if(guild.name !== known.name) known.name = guild.name;
                    if(guild.icon !== known.icon) known.icon = guild.icon;
                    await known.save();
                    user.guilds.push({
                        id: guild.id,
                        permissions: guild.permissions
                    });
                    await user.save();
                }
            });
        });
    }

    makeToken() {
        return `Azure-V1-${crypto.randomBytes(12).toString("hex")}-${crypto.randomBytes(4).toString("hex")}`;
    }
}