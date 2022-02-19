module.exports = {
    config: {
        name: 'pingbt',
        customId: 'ping',
    },
    run: async (client, interaction) => {
        interaction.reply(`Meu ping é de estimados ${client.ws.ping} ms.`)
    },
}