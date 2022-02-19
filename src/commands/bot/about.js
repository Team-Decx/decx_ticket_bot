const discord = require('discord.js');

module.exports = {
    name: 'about',
    type: 'CHAT_INPUT',
    description: 'Ver informações sobre o bot.',
    run: async (client, interaction) => {
        const embed = new discord.MessageEmbed()
            .setTitle('Informações sobre o bot')
            .setDescription(`Meu nome é ${client.user.tag}`)

        const row = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('ping')
                    .setLabel('Ver meu ping')
                    .setStyle('PRIMARY')
            )
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('aboutme')
                    .setLabel('Sobre mim')
                    .setStyle('SUCCESS')
            )

        const row2 = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('delete')
                    .setLabel('DELETAR ALGO')
                    .setStyle('DANGER')
            )

        interaction.reply({ embeds: [embed], components: [row, row2] })
    },
};