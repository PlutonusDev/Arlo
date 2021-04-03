const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

module.exports = db => {
    router.get("/", (req, res) => {
        res.status(200).render("home", { auth: req.session.auth });
    });

    router.get("/welcome", (req, res) => {
        res.status(200).render("welcome", { auth: req.session.auth });
    });

    router.get("/commands", async (req, res) => {
        const commands = {};
        await fs.readdir(path.join(__dirname, "..", "..", "modules"), (err, categories) => {
            categories.forEach(async category => {
                await fs.readdir(path.join(__dirname, "..", "..", "modules", category), (err, modules) => {
                    modules.forEach(module => {
                        const cmd = require(path.join(__dirname, "..", "..", "modules", category, module));
                        if(!commands[category]) commands[category] = {name: category, cmds: []};
                        commands[category].cmds.push({
                            name: cmd.name,
                            category: category,
                            aliases: cmd.aliases || false,
                            usage: cmd.usage || false,
                            description: cmd.description || "None provided.",
                            disabled: cmd.disabled,
                            guildOnly: cmd.guildOnly,
                            botPerms: cmd.botPerms,
                            userPerms: cmd.userPerms
                        });
                    });
                });
            });
        });
        res.status(200).render("commands", { auth: req.session.auth, commands });
    });

    router.get("/dashboard", async (req, res) => {
        if(!req.session.auth) return res.status(401).redirect("/auth/login");
        // This is not a good way of fetching the user's guilds. We should load them after the page is rendered.
        const guilds = await db.fetchUserGuilds(req.session.auth.id);
        //guilds.sort((a,b) => (a.editable && !b.editable) ? -1 : ((b.editable && !a.editable) ? 1 : 0));
        const filteredGuilds = {
            available: guilds.filter(guild => guild.editable),
            unavailable: guilds.filter(guild => !guild.editable)
        }

        res.status(200).render("dashboard", { auth: req.session.auth, guilds: filteredGuilds })
    });

    router.get("/dashboard/:id", async (req, res) => {
        const guild = await db.fetchGuild(req.params.id);
        if(req.headers["user-agent"].toLowerCase().includes("discord")) {
            return res.status(200).send(`<head>\
                <meta property="og:title" content="Azure Dashboard | ${guild ? guild.name : "Unknown Guild"}" />\
                <meta property="og:description" content="Azure is a powerful Discord bot bundled with a fully-featured webpanel." />\
                <meta property="og:image" content="${guild.icon ?
                    `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith("a_") ? "gif" : "webp"}` :
                    `https://azure.plutonus.co/assets/img/azurelogo.png`}\
                "/>`)
        }
        if(!req.session.auth) return res.status(401).redirect("/auth/login");
        if(!guild || !guild.editable) return res.redirect("/dashboard");
        res.status(200).render("dashboard-edit", { auth: req.session.auth, guild });
    });
    
    return {
        name: "base",
        root: "/",
        controller: router
    }
}