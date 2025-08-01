// Impor modul dan dependensi yang diperlukan
const mime = require("mime-types");

// Ekspor modul atau fungsi yang diperlukan
const tools = {
    api: require("./api.js"),
    cmd: require("./cmd.js"),
    list: require("./list.js"),
    mime,
    msg: require("./msg.js")
};

module.exports = tools;