const express = require("express");
const router = express.Router();

module.exports = db => {
    router.get("/", (req, res) => {
        res.status(200).render("home");
    });
    
    return {
        name: "base",
        root: "/",
        controller: router
    }
}