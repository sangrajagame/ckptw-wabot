const {
    ButtonBuilder
} = require("@itsreimau/gktw");
const axios = require("axios");
const didYouMean = require("didyoumean");

const session = new Map();

module.exports = {
    name: "tebaklagu",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(formatter.quote("🎮 Sesi permainan sedang berjalan!"));

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/Aiinne/scrape/refs/heads/main/tebaklagu.json");
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data);

            const game = {
                coin: 10,
                timeout: 60000,
                answer: result.judul.toLowerCase()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                audio: {
                    url: result.lagu
                },
                mimetype: tools.mime.lookup("mp3"),
            });
            await ctx.reply({
                text: `${formatter.quote(`Artis: ${result.artis}`)}\n` +
                    `${formatter.quote(`Bonus: ${game.coin} Koin`)}\n` +
                    formatter.quote(`Batas waktu: ${tools.msg.convertMsToDuration(game.timeout)}`),
                footer: config.msg.footer,
                buttons: new ButtonBuilder()
                    .regulerButton("Petunjuk", "hint")
                    .regulerButton("Menyerah", "surrender")
                    .build()
            });

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            const playAgain = new ButtonBuilder()
                .regulerButton("Main Lagi", ctx.used.prefix + ctx.used.command)
                .build();

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantId = ctx.getId(m.sender);

                if (participantAnswer === game.answer) {
                    session.delete(ctx.id);
                    await db.add(`user.${participantId}.coin`, game.coin);
                    await db.add(`user.${participantId}.winGame`, 1);
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.quote("💯 Benar!")}\n` +
                            formatter.quote(`+${game.coin} Koin`),
                        footer: config.msg.footer,
                        buttons: playAgain
                    }, {
                        quoted: m
                    });
                    return collector.stop();
                } else if (participantAnswer === "hint") {
                    const clue = game.answer.replace(/[aiueo]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.monospace(clue.toUpperCase())
                    }, {
                        quoted: m
                    });
                } else if (participantAnswer === "surrender") {
                    session.delete(ctx.id);
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.quote("🏳️ Kamu menyerah!")}\n` +
                            formatter.quote(`Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`),
                        footer: config.msg.footer,
                        buttons: playAgain
                    }, {
                        quoted: m
                    });
                    return collector.stop();
                } else if (didYouMean(participantAnswer, [game.answer]) === game.answer) {
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.quote("🎯 Sedikit lagi!")
                    }, {
                        quoted: m
                    });
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    return await ctx.reply({
                        text: `${formatter.quote("⏱ Waktu habis!")}\n` +
                            formatter.quote(`Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`),
                        footer: config.msg.footer,
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};