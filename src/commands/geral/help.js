const discord = require('discord.js');

module.exports = {
    name: 'help',
    type: 'CHAT_INPUT',
    description: 'Comandos do bot.',
    run: async (client, interaction) => {
        let commands = client.commands;
        const embed = new discord.MessageEmbed()
            .setTitle('Comandos do Bot.')
            .setColor('#0000ff')

        commands.forEach(command => {
            embed.addField(`Comando: ${command.name}`, `Descrição: ${command.description}`, true)
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};