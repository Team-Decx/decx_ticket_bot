const fs = require('fs');

async function initInteractionButtons(client, interaction) {
    if (interaction.isButton()) {
        const buttons = fs.readdirSync(`./src/events/interactions/buttons`).filter(f => f.endsWith('.js'));
        buttons.forEach(file => {
            const button = require(`./buttons/${file}`);
            if (button.config.customId === interaction.customId ) {
                button.run(client, interaction);
                console.log(button.config.customId + ' foi carregado com sucesso.');
            }

            if(!button.config) {
                console.log('Algum botão não foi corretamente configurado.');
            }
        });
    }
}

async function initCommands(client, interaction) {
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    const args = interaction.options;
    if(!command) return;
    try {
        await command.run(client, interaction);
    } catch (err) { 
        console.error(err);
        await interaction.reply({content: 'Ops.. Me deparei com um erro, tente novamente mais tarde.'})
    }
}

module.exports = async (client, interaction) => {
    await initInteractionButtons(client, interaction);
    await initCommands(client, interaction);
};