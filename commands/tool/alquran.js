const axios = require("axios");

module.exports = {
    name: "alquran",
    aliases: ["quran"],
    category: "tool",
    code: async (ctx) => {
        const [surat, ayat] = ctx.args;

        if (!surat && !ayat) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "21 35"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (surat.toLowerCase() === "list") {
            const listText = await tools.list.get("alquran");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        if (isNaN(surat) || surat < 1 || surat > 114) return await ctx.reply(formatter.quote("❎ Surah harus berupa nomor antara 1 sampai 114!"));

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/religious/nuquran-surah", {
                id: surat
            });
            const result = (await axios.get(apiUrl)).data.result;
            const verses = result.verses;

            if (ayat) {
                if (ayat.includes("-")) {
                    const [startAyat, endAyat] = ayat.split("-").map(Number);
                    const selectedVerses = verses.filter(v => v.number >= startAyat && v.number <= endAyat);

                    if (isNaN(startAyat) || isNaN(endAyat) || startAyat < 1 || endAyat < startAyat) return await ctx.reply(formatter.quote("❎ Rentang ayat tidak valid!"));
                    if (!selectedVerses.length) return await ctx.reply(formatter.quote(`❎ Ayat dalam rentang ${startAyat}-${endAyat} tidak ada!`));

                    const versesText = selectedVerses.map(v =>
                        `${formatter.quote(`Ayat ${v.number}:`)}\n` +
                        `${v.text} (${v.transliteration})\n` +
                        formatter.italic(v.translation_id)
                    ).join("\n");
                    return await ctx.reply({
                        text: `${formatter.quote(`Surat: ${result.name}`)}\n` +
                            `${formatter.quote(`Arti: ${result.translate}`)}\n` +
                            `${formatter.quote("─────")}\n` +
                            versesText,
                        footer: config.msg.footer
                    });
                }

                const singleAyat = parseInt(ayat);
                const verse = verses.find(v => v.number === singleAyat);

                if (isNaN(singleAyat) || singleAyat < 1) return await ctx.reply(formatter.quote("❎ Ayat harus berupa nomor yang valid dan lebih besar dari 0!"));
                if (!verse) return await ctx.reply(formatter.quote(`❎ Ayat ${singleAyat} tidak ada!`));

                return await ctx.reply({
                    text: `${formatter.quote(`Surat: ${result.name}`)}\n` +
                        `${formatter.quote(`Arti: ${result.translate}`)}\n` +
                        `${formatter.quote("─────")}\n` +
                        `${verse.text} (${verse.transliteration})\n` +
                        formatter.italic(verse.translation_id),
                    footer: config.msg.footer
                });
            }

            const versesText = verses.map(v =>
                `${formatter.quote(`Ayat ${v.number}:`)}\n` +
                `${v.text} (${v.transliteration})\n` +
                formatter.italic(v.translation_id)
            ).join("\n");
            return await ctx.reply({
                text: `${formatter.quote(`Surat: ${result.name}`)}\n` +
                    `${formatter.quote(`Arti: ${result.translate}`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    versesText,
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};