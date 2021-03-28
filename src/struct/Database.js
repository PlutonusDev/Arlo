const EventEmitter = require("events");
const mongoose = require("mongoose");

module.exports = class Database extends EventEmitter {
    constructor(config = { host: "mongodb://localhost/Azure" }) {
        super();

        this.config = config;
        this.mongoose = mongoose;
        this.connected = false;

        this.connection = this.mongoose.connection;

        this.connection.once("open", () => this.emit("ready"));
        this.connection.on("error", e => this.emit("error", e));

        return this;
    }

    connect() {
        this.mongoose.connect(this.config.host, {useNewUrlParser: true, useUnifiedTopology: true});
        this.emit("info", "Database connection established.")
    }
}