module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    code: async (ctx) => {
        return await ctx.reply(formatter.quote(`🚀 Bot telah aktif selama ${config.bot.uptime}.`));
    }
};