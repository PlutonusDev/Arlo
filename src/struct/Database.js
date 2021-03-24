const EventEmitter = require("events");
const mongoose = require("mongoose");

module.exports = class Database extends EventEmitter {
    constructor(config = { host: "mongodb://localhost/Azure" }) {
        super();

        this.config = config;
        this.mongoose = mongoose;
        this.connected = false;
        this.connection = false;

        this.db = this.mongoose.connection;

        this.db.once("open", () => this.emit("ready"));
        this.db.on("error", e => this.emit("error", e));

        return this;
    }

    connect() {
        this.mongoose.connect(this.config.host, {useNewUrlParser: true, useUnifiedTopology: true});
    }
}