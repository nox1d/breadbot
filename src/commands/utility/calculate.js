const { SlashCommandBuilder } = require("discord.js");
const { evaluate } = require("mathjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Performs calculation")
    .addStringOption((option) =>
      option
        .setName("expression")
        .setDescription("The mathematical expression to evaluate")
        .setRequired(true)
    ),
  async execute(interaction) {
    let expression = interaction.options.getString("expression");

    try {
      const result = evaluate(expression);
      await interaction.reply(`The result is \`${result}\``);
    } catch (error) {
      await interaction.reply(`Error: invalid expression`);
    }
  },
};
