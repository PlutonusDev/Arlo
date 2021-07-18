// Create a connection to the database
const Database = require("./struct/database");
const db = new Database();

// Create the discord bot, and reference the database
const Arlo = require("./struct/arlo");
const client = new Arlo();
client.db = db;

// Create the backend webservice, and reference the database
const Backend = require("./struct/backend");
const api = new Backend();
api.db = db;
api.bot = client;

client.start().then(() => console.log("Discord ready!"));
api.start().then(() => console.log("Backend ready!"));
