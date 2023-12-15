const fs = require("fs");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 5);

const helper = {
    getSessions() {
        const sessionFile = fs.readFileSync(__dirname + "/sessions.json", {
            encoding: "utf8",
            flag: "r",
        });

        const sessions = JSON.parse(sessionFile);

        return sessions;
    },

    isSessionExists(sessionId, sessions) {
        return sessionId in sessions;
    },

    getNewSessionId(sessions) {
        let sessionId = "";
        do {
            sessionId = nanoid();
        } while (this.isSessionExists(sessionId, sessions));

        return sessionId;
    },
};

module.exports = { helper };
