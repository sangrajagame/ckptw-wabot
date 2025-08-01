const axios = require("axios");

module.exports = {
    name: "youtubesummarizer",
    aliases: ["ytsummarizer"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://youtube.com/watch?v=v18fHSc813k"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/tools/yt-summarizer", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.keyPoints.map(r =>
                `${formatter.quote(`Poin: ${r.point}`)}\n` +
                formatter.quote(r.summary)
            ).join(
                "\n" +
                `${formatter.quote("─────")}\n`
            );
            return await ctx.reply({
                text: `${formatter.quote(result.summary)}\n` +
                    `${formatter.quote("─────")}\n` +
                    resultText,
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};