const express = require("express");
const router = express.Router();
const exampleSchema = require("../validators/exampleSchema");
const db = require("../../database/database");
const fs = require("fs");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 5);

router.get("/", (req, res) => {
    res.json({
        message: "You're on api route!",
    });
});

router.get("/session/:sessionId", async (req, res) => {
    let { sessionId } = req.params;

    const sessionFile = fs.readFileSync(__dirname + "/sessions.json", {
        encoding: "utf8",
        flag: "r",
    });

    sessionId = sessionId.toLowerCase();

    const sessions = JSON.parse(sessionFile);

    const sessionData = sessions[sessionId] || null;

    return res.json({
        sessionId,
        sessionData,
    });
});

router.delete("/session/:sessionId", async (req, res) => {
    let { sessionId } = req.params;

    const sessionFile = fs.readFileSync(__dirname + "/sessions.json", {
        encoding: "utf8",
        flag: "r",
    });

    sessionId = sessionId.toLowerCase();

    const sessions = JSON.parse(sessionFile);

    if (sessions[sessionId]) {
        const fd = fs.openSync(__dirname + "/sessions.json", "w");

        delete sessions[sessionId];

        fs.writeSync(fd, JSON.stringify(sessions));
    }

    return res.json({
        sessionId,
    });
});

router.post("/session", async (req, res) => {
    let { sessionId, sessionData } = req.body;

    if (!sessionId) {
        sessionId = nanoid().toLowerCase();
    }

    const sessionFile = fs.readFileSync(__dirname + "/sessions.json", {
        encoding: "utf8",
        flag: "r",
    });

    const sessions = JSON.parse(sessionFile);

    sessions[sessionId] = sessionData;

    console.log(sessions);

    const fd = fs.openSync(__dirname + "/sessions.json", "w");

    sessionId = sessionId.toLowerCase();

    fs.writeSync(fd, JSON.stringify(sessions));

    return res.json({
        sessionId,
        sessionData: sessions[sessionId],
    });
});

router.post("/example", async (req, res, next) => {
    const { name, age } = req.body;
    try {
        const user = {
            name,
            age,
            createdAt: Date(),
            updatedAt: Date(),
        };
        await exampleSchema.validate(user);
        res.json({
            message: "post request success",
            user,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
