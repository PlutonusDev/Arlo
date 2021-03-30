const fs = require("fs");
const path = require("path");

const EventEmitter = require("events");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");

module.exports = class WebPanel extends EventEmitter {
    constructor(config) {
        super();

        this.app = express();
        this.config = config;
        this.database = false;

        return this;
    }

    async load() {
        return new Promise(async res => {
            this.emit("info", "Setting up routers...");
            if (!fs.existsSync(path.join(__dirname, "..", "data", "panel"))) return this.emit("error", "The panel folder does not exist. '/data/panel/'");
            if (!fs.existsSync(path.join(__dirname, "..", "data", "panel", "routes"))) return this.emit("error", "The routes folder does not exist. '/data/panel/routes/'");
            if (!fs.existsSync(path.join(__dirname, "..", "data", "panel", "views"))) return this.emit("error", "The views folder does not exist. '/data/panel/views/'");
            await fs.readdir(path.join(__dirname, "..", "data", "panel", "routes"), (err, routes) => {
                if (err) return this.emit("error", "Error reading routes folder. '/data/panel/routes/'");
                routes.forEach(route => {
                    const router = require(path.join(__dirname, "..", "data", "panel", "routes", route))(this.database);
                    this.app.use(router.root, router.controller);
                    this.emit("info", `Bound route '${router.name}' to '${router.root}'`);
                });
            });

            this.app.use("/assets", express.static(path.join(__dirname, "..", "data", "panel", "assets")));
            this.app.engine("hbs", exphbs({
                extname: ".hbs",
                defaultLayout: "main",

                helpers: {
                    startsWith: (str, prefix, truthy, falsy) => str.startsWith(prefix) ? truthy: falsy,
                    stringify: obj => JSON.stringify(obj),
                    count: obj => obj.length,
                    caps: str => {
                        str = str.split("");
                        const uc = str[0].toUpperCase();
                        str.shift();
                        return uc+str.join("");
                    }
                }
            }));

            this.app.set("view engine", "hbs");
            this.app.set("views", path.join(__dirname, "..", "data", "panel", "views"));

            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }));

            this.app.use(session({
                secret: this.config.sessionSecret,
                resave: false,
                saveUninitialized: true
            }));

            this.app.enable("trust proxy");
            this.app.set("x-powered-by", false);

            res();
        });
    }

    async start() {
        this.emit("info", "Preparing to start Webpanel...");
        await this.load();
        await this.app.listen(this.config.port);
        this.emit("ready");
    }

    allocDB(connection) {
        this.database = connection;
        this.emit("info", "Reference to database received.")
    }
}