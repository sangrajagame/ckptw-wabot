const axios = require("axios");

module.exports = {
    name: "ttsmp3",
    aliases: ["texttospeechmp3"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const availableModels = ["zeina", "nicole", "russell", "ricardo", "camila", "vitoria", "brian", "amy", "emma", "chantal", "enrique", "lucia", "conchita", "zhiyu", "naja", "mads", "ruben", "lotte", "mathieu", "celine", "lea", "vicki", "marlene", "hans", "karl", "dora", "aditi", "raveena", "giorgio", "carla", "bianca", "takumi", "mizuki", "seoyeon", "mia", "liv", "jan", "maja", "ewa", "jacek", "cristiano", "ines", "carmen", "tatyana", "maxim", "astrid", "filiz", "kimberly", "ivy", "kendra", "justin", "joey", "matthew", "salli", "joanna", "penelope", "lupe", "miguel", "gwyneth", "geraint"];

        const input = ctx.args.slice(availableModels.includes(ctx.args[0]?.toLowerCase()) ? 1 : 0).join(" ") || ctx?.quoted?.content || null;
        const model = availableModels.includes(ctx.args[0]?.toLowerCase()) ? ctx.args[0] : "zeina";

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "nicole halo, dunia!"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("ttsmp3");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/ai/tts-mp3", {
                text: input,
                model: tools.msg.ucwords(model)
            });
            const result = (await axios.get(apiUrl)).data.result.audio_url;

            return await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp3"),
                ptt: true
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};