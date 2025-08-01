module.exports = {
    name: "oadd",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, ctx.getId(ctx.sender.jid)))
        );

        const accountJid = `${input.replace(/[^\d]/g, "")}@s.whatsapp.net`;

        const isOnWhatsApp = await ctx.core.onWhatsApp(accountJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(formatter.quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await ctx.group().add([accountJid]);

            return await ctx.reply(formatter.quote("✅ Berhasil ditambahkan!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};