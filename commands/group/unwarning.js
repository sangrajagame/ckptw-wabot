module.exports = {
    name: "unwarning",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const accountJid = ctx?.quoted?.senderJid || ctx.getMentioned()[0] || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
        });

        if (accountId === config.bot.id) return await ctx.reply(formatter.quote(`❎ Tidak bisa mengubah warning bot!`));
        if (accountJid === await ctx.group().owner()) return await ctx.reply(formatter.quote("❎ Tidak bisa mengubah warning admin grup!"));

        try {
            const groupId = ctx.getId(ctx.id);
            const groupDb = await db.get(`group.${groupId}`) || {};
            const warnings = groupDb?.warnings || [];

            const userWarning = warnings.find(w => w.userId === accountId);
            let currentWarnings = userWarning ? userWarning.count : 0;

            if (currentWarnings <= 0) return await ctx.reply(formatter.quote("✅ Pengguna itu tidak memiliki warning."));

            const newWarning = currentWarnings - 1;

            if (userWarning) {
                if (newWarning <= 0) {
                    const updatedWarnings = warnings.filter(w => w.userId !== accountId);
                    await db.set(`group.${groupId}.warnings`, updatedWarnings);
                } else {
                    userWarning.count = newWarning;
                    await db.set(`group.${groupId}.warnings`, warnings);
                }
            }

            return await ctx.reply(formatter.quote(`✅ Berhasil mengurangi warning pengguna itu menjadi ${newWarning}/${groupDb?.maxwarnings || 3}.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};