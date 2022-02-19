module.exports = {
    config: {
        name: 'aboutmebt',
        customId: 'aboutme',
    },
    run: async (client, interaction) => {
        interaction.reply(`Meu nome é ...., sou desenvolvido com ...`);
    },
}