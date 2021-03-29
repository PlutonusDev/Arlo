const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("Hello");
});

module.exports = {
    name: "base",
    root: "/",
    controller: router
}