const {
    ButtonBuilder
} = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/HasamiAini/Bot_Takagisan/refs/heads/main/faktanya.txt");
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.trim().split("\n").filter(Boolean));

            return await ctx.reply({
                text: result,
                footer: config.msg.footer,
                buttons: new ButtonBuilder()
                    .regulerButton("Ambil Lagi", ctx.used.prefix + ctx.used.command)
                    .build()
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};