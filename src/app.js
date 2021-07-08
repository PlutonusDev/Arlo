// Create a connection to the database
const Database = require("./struct/database");
const db = new Database();

// Create the discord bot, referencing the database
const Arlo = require("./struct/arlo");
const client = new Arlo(db);

client.start().then(() => console.log("Ready!"));
