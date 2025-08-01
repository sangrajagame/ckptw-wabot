const {
    ButtonBuilder
} = require("@itsreimau/gktw");

module.exports = {
    name: "hentai",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("nirkyy", "/api/v1/image-hentai");

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: formatter.quote("Cabul!"),
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