const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const path = require("node:path");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows every available commands of this bot."),

  async execute(interaction) {
    let helpEmbed = new EmbedBuilder()
      .setTitle("Help Menu")
      .setDescription(
        "I'm bread bot the discord bot. The followings are all the available commands."
      );

    const foldersPath = path.dirname(__dirname);
    const commandsFolder = fs.readdirSync(foldersPath);

    try {
      for (folder of commandsFolder) {
        let commandsPath = path.join(foldersPath, folder);
        let commandFiles = fs
          .readdirSync(commandsPath)
          .filter((file) => file.endsWith(".js"));
        let noExtFileName = commandFiles.map((file) => file.slice(0, -3));
        console.log(`${folder}: ${noExtFileName}`);

        let fieldTitle = folder;
        let fieldValue = "";

        for (file of noExtFileName) {
          fieldValue += `\`${file}\`, `;
        }
        let field = { name: fieldTitle, value: fieldValue.slice(0, -2) };
        helpEmbed.addFields(field);
      }
      interaction.reply({ embeds: [helpEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
