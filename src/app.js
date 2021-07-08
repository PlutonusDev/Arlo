const Arlo = require("./struct/arlo");
const client = new Arlo();

client.start().then(() => console.log("Ready!"));
