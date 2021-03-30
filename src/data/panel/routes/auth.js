const path = require("path");
const express = require("express");
const router = express.Router();

const btoa = require("btoa");
const qs = require("querystring");
const { get, post } = require("axios");

const config = require(path.join(__dirname, "..", "..", "config")).discord;

module.exports = db => {
    router.get("/login", (req, res) => {
        res.status(200).redirect(`https://discord.com/api/oauth2/authorize?scope=identify%20guilds&response_type=code&client_id=${config.clientId}&redirectUri=${encodeURIComponent(config.redirectUri)}&prompt=none`);
    });
    
    router.get("/callback", (req, res) => {
        post("https://discord.com/api/v8/oauth2/token",
        qs.stringify({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: encodeURI(config.redirectUri),
            scope: "identify guilds"
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bot ${btoa(`${config.clientId}:${config.clientSecret}`)}`
            },
        }).then((resp) => {
            get("https://discord.com/api/v8/users/@me", {
				headers: {
					Authorization: `Bearer ${resp.data.access_token}`,
				},
			}).then(user => {
                get("https://discord.com/api/v8/users/@me/guilds", {
                    headers: {
                        Authorization: `Bearer ${resp.data.access_token}`,
                    },
                }).then(async guilds => {
                    if(db.userExists(user.data.id)) {
                        req.session.auth = db.fetchUser(user.data.id);
                        res.status(200).redirect("/dashboard");
                    } else {
                        req.session.auth = db.createUser(user.data);
                        res.status(200).redirect("/welcome");
                    }
                    db.assignGuilds(guilds.data, user.data.id);
                    //res.status(200).json({msg: "bro look it's totally you!", internal: db.newUser(), you: user.data, guilds: guilds.data});
                });
            });
        });
    });

    return {
        name: "auth",
        root: "/auth",
        controller: router
    }
}