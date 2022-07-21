require('dotenv').config();
const discord = require('discord.js');
const { ticketChannelId, adminChannelId, ticketPrefix } = require('./config.json');

const decx = new discord.Client({
	intents: [
		discord.GatewayIntentBits.DirectMessages,
		discord.GatewayIntentBits.Guilds,
		discord.GatewayIntentBits.GuildBans,
		discord.GatewayIntentBits.GuildMessages,
		discord.GatewayIntentBits.MessageContent,
	],
	partials: [discord.Partials.Channel],
});

decx.on('ready', () => {
	const status = [
		'🥇 Entre em nosso \n server: https://discord.com/invite/dX5RtYepjp.',
		'💌 Contato: \n decxprofissional@gmail.com.',
		'🔨 As melhores \n modificações para seu servidor estão aqui.'
	];
	i = 0;
	decx.user.setActivity(status[0]);
	decx.user.setStatus('online');
	console.log('😍 ' + decx.user.username + ' started working!');
});

decx.on('messageCreate', async (msg) => {
	if (msg.author.bot) return;
	if (!msg.member.permissions.has('ADMINISTRATOR')) return;
	if (msg.channel.type === 'dm') return;

	const prefix = ticketPrefix;

	if (!msg.content.startsWith(prefix)) return;
	const ticketChannel = decx.channels.cache.find(channel => channel.id === ticketChannelId);
	msg.delete();
	const row = new discord.ActionRowBuilder()
		.addComponents(
			new discord.ButtonBuilder()
				.setCustomId('ticket')
				.setLabel('Criar Ticket')
				.setStyle('Secondary'),
		);

	const embed = new discord.EmbedBuilder()
		.setColor('#2f3136')
		.setImage('https://cdn.discordapp.com/attachments/999055075899088908/999559700163067985/Component_4.png')
		.setAuthor({ name: 'Criar ticket de atendimento | Decx', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/999093804034445442/Logo_4.png', url: 'https://discord.com/invite/dX5RtYepjp' })
		.setURL('https://discord.com/invite/dX5RtYepjp')
		.setDescription('Para dúvidas, suporte, contato profissional, orçamentos e compras.')
		.setFooter({ text: 'Decx © 2022', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/999093804034445442/Logo_4.png' });

	ticketChannel.send({ ephemeral: true, embeds: [embed], components: [row] });
});

decx.on('interactionCreate', async interaction => {
	if (interaction.customId === 'ticket') {
		if (!interaction.isButton()) return;
		const guild = decx.guilds.cache.get(interaction.guild.id);
		const guildChannels = guild.channels.cache;
		const interactionChannelName = `ticket-${interaction.user.username}`;
		const adminAlertChannel = decx.channels.cache.find(channel => channel.id === adminChannelId);
		const errorEmbed = new discord.EmbedBuilder()
			.setDescription('❌ Você já possui um ticket aberto! Encerre o ticket atual para poder abrir um novo.')
			.setColor('#2f3136')
			.setFooter({ text: 'Decx © 2022', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/999093804034445442/Logo_4.png' });

		const sucessEmbed = new discord.EmbedBuilder()
			.setDescription('✅ Você foi mencionado no canal correspondente ao seu ticket.')
			.setColor('#2f3136')
			.setFooter({ text: 'Decx © 2022', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/999093804034445442/Logo_4.png' });

		const adminMessage = new discord.EmbedBuilder()
			.setDescription(`☄️ Um ticket foi aberto! ${interaction.user.id}`)
			.addFields([
				{
					name: '😀 Usuário:',
					value: `${interaction.user.username}`,
					inline: true
				}
			])
			.setColor('#2f3136')
			.setFooter({ text: 'Decx © 2022', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/999093804034445442/Logo_4.png' });

		for (const channel of guildChannels.values()) {
			if (channel.name === interactionChannelName.toLowerCase()) {
				return interaction.reply({ ephemeral: true, embeds: [errorEmbed] });
			}
		}

		adminAlertChannel.send({ ephemeral: true, embeds: [adminMessage] });

		guild.channels.create({
			name: interactionChannelName,
			permissionOverwrites: [
				{
					id: interaction.user.id,
					allow: [discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.ViewChannel],
				},
				{
					id: interaction.guild.roles.everyone,
					deny: [discord.PermissionFlagsBits.ViewChannel],
				}
			],
			type: discord.ChannelType.GuildText,
			//parent: 'xxx',
			//SE QUISER COLOCAR O CANAL EM CATEGORIA TROCA O XXX pelo ID DA CATEGORIA
		}).then(async channel => {
			const embed = new discord.EmbedBuilder()
				.setDescription('☄️ Você solicitou um ticket. Entraremos em contato o mais rápido possível, aguarde. Clique no botão vermelho para encerrar o ticket.')
				.setColor('#2f3136')
				.setFooter({ text: 'Decx © 2022', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/999093804034445442/Logo_4.png' });

			const deleteButton = new discord.ActionRowBuilder()
				.addComponents(
					new discord.ButtonBuilder()
						.setCustomId('delete')
						.setLabel('Cancelar Ticket')
						.setStyle('Danger'),
				);

			await channel.send({ ephemeral: true, embeds: [embed], components: [deleteButton], content: `||<@${interaction.user.id}>||` });
			interaction.reply({ ephemeral: true, embeds: [sucessEmbed] });
		})
	}
	if (interaction.customId === 'delete') {
		interaction.channel.delete();
		const adminAlertChannel = decx.channels.cache.find(channel => channel.id === adminChannelId);
		const deleteMessage = new discord.EmbedBuilder()
			.setDescription(`❌ Ticket encerrado! ${interaction.user.id}`)
			.addFields([
				{
					name: '😀 Usuário:',
					value: `${interaction.user.username}`,
					inline: true
				}
			])
			.setColor('#2f3136')
			.setFooter({ text: 'Decx © 2022', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/999093804034445442/Logo_4.png' });

		await interaction.user.send({ ephemeral: true, embeds: [deleteMessage] }).catch(() => {
			adminAlertChannel.send({ ephemeral: true, embeds: [deleteMessage] });
			return false;
		});
		adminAlertChannel.send({ ephemeral: true, embeds: [deleteMessage] });
	}
});
decx.login(process.env.TOKEN);
