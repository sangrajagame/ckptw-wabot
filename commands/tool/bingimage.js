const {
    ButtonBuilder
} = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "bingimage",
    aliases: ["bimg"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "rei ayanami"))
        );

        try {
            const apiUrl = tools.api.createUrl("siputzx", "/api/s/bimg", {
                query: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpeg"),
                caption: formatter.quote(`Kueri: ${input}`),
                footer: config.msg.footer,
                buttons: new ButtonBuilder()
                    .regulerButton("Ambil Lagi", `${ctx.used.prefix + ctx.used.command} ${input}`)
                    .build()
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};