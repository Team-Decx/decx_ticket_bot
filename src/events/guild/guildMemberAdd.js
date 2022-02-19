module.exports = async (client, member) => {
    const guild = client.guilds.cache.get('938611908234326017');
    const role = guild.roles.cache.get('944037645590331442');
    await member.roles.add(role.id);
    const welcomeChannel = client.channels.cache.find(channel => channel.id === '944038163146485771');
    return await welcomeChannel.send(`${member.user.username} entrou no servidor!`);
};