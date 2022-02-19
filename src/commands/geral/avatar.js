const discord = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Veja o avatar de um usuário',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'usuário',
            type: 'USER',
            description: 'Usuário para ver avatar.',
            require: false,
        }
    ],
    run: async (client, interaction) => {
        let userMention = interaction.options.getUser('usuário');
        let person;

        if(!userMention) {
            person = interaction.user;
        } else {
            person = userMention;
        }

        const embed = new discord.MessageEmbed()
            .setTitle(`Imagem de ${person.username}`)
            .setImage(person.displayAvatarURL())
            .setURL(person.avatarURL({format: 'png', dynamic: true, size: 1024}))

        interaction.reply({embeds: [embed]});
    },
}