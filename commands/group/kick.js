module.exports = {
    name: "kick",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const accountJid = ctx?.quoted?.senderJid || ctx.getMentioned()[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
        });

        if (accountJid === await ctx.group().owner()) return await ctx.reply(formatter.quote("❎ Dia adalah owner grup!"));

        try {
            await ctx.group().kick([accountJid]);

            return await ctx.reply(formatter.quote("✅ Berhasil dikeluarkan!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};