module.exports = async (client, member) => {
    const leftChannel = client.channels.cache.find(channel => channel.id === '944038174596956261');
    return await leftChannel.send(`${member.user.username} saiu do servidor!`);
};