const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('dictionary')
    .setDescription('Get definitions of an english word.')
    .addStringOption((option) =>
        option
        .setName("word")
        .setDescription("The word you want to get the definition of")
        .setRequired(true)),
    async execute(interaction) {
            const dictURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
            let word = interaction.options.getString("word");
            word = word.toLowerCase();

            try {
                const response = await fetch(dictURL + word);
                if (!response.ok) {
                    interaction.reply("**No definitions found**");
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                let fields = [];
                for (let data of json) {
                    for (let meaning of data["meanings"]) {
                        let field = { name: `${meaning["partOfSpeech"]}`, value: `${meaning["definitions"][0]["definition"]}` };
                        fields.push(field);
                    }
                }

                let definitionEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(word)
                    .addFields(fields)
                    .setTimestamp();
                
                interaction.reply({embeds: [definitionEmbed]});
                
            } catch (error) {
                console.error(error.message);
            }

        }
}