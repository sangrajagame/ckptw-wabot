const {
    ButtonBuilder
} = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "shinobu",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("https://api.waifu.pics", "/sfw/shinobu");
            const result = (await axios.get(apiUrl)).data.url;

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpeg"),
                caption: formatter.quote("Yoo-hoo!"),
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