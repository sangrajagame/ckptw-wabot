const {
    ButtonBuilder
} = require("@itsreimau/gktw");

module.exports = {
    name: "picre",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("nekorinn", "/random/picre");

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: formatter.quote("Untukmu, tuan!"),
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