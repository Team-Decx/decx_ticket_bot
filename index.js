const discord = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { ticketChannelId, adminChannelId, ticketPrefix } = require('./config.json');

const decx = new discord.Client({
	intents: [
		"GUILDS",
		"GUILD_MESSAGES"
	]
});

decx.on("ready", () => {
	const status = [
		'🥇 Entre em nosso \n server: https://discord.com/invite/dX5RtYepjp.',
		'💌 Contato: \n decxprofissional@gmail.com.',
		'🔨 As melhores \n modificações para seu servidor estão aqui.'
	];
	i = 0;
	setInterval(() => decx.user.setActivity(`${status[i++ % status.length]}`, {
		type: 'PLAYING',
	}), 6000 * 15);
	decx.user.setStatus('dnd')
	console.log("😍 " + decx.user.username + " started working!");
});

decx.on("messageCreate", async (msg) => {
	if (msg.author.bot) return;
	if (!msg.member.permissions.has('ADMINISTRATOR')) return;
	if (msg.channel.type === "dm") return;

	const prefix = ticketPrefix;

	if (!msg.content.startsWith(prefix)) return;
	const args = msg.content.toLowerCase().split(" ");

	const ticketChannel = decx.channels.cache.find(channel => channel.id === ticketChannelId);

	const row = new discord.MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('ticket')
				.setLabel('Criar Ticket')
				.setEmoji('932520038030770196')
				.setStyle('SECONDARY'),
		);

	const embed = new discord.MessageEmbed()
		.setColor('0000ff')
		.setTitle('Criar ticket de atendimento')
		.addField('☄️ Detalhes', 'Ao criar um ticket você deve especificar o motivo do chamado, seja para dúvidas, compras ou suporte.', true)
		.setImage('https://cdn.discordapp.com/attachments/747447582984503320/932760994663510076/Component_2.png')
		.setAuthor({ name: 'Decx', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/929820602779435078/Component_1.png', url: 'https://discord.com/invite/dX5RtYepjp' })
		.setURL('https://discord.com/invite/dX5RtYepjp')
		.setDescription('Para dúvidas, suporte, contato profissional, orçamentos e compras.')
		.setFooter({ text: 'Decx Team - All Copyright reserved for © Decx ', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/929820602779435078/Component_1.png' });

	await ticketChannel.send({ ephemeral: true, embeds: [embed], components: [row] });
});

decx.on('interactionCreate', interaction => {
	const protocol = new Date().getTime();
	if (interaction.customId === "ticket") {
		if (!interaction.isButton()) return;
		const interactionUser = decx.users.cache.get(interaction.member.user.id);
		const interactionChannelName = `ticket-${interaction.user.username}`;
		const guild = decx.guilds.cache.get(interaction.guild.id);
		const adminAlertChannel = decx.channels.cache.find(channel => channel.id === adminChannelId);
		const guildChannels = guild.channels.cache;
		const errorEmbed = new discord.MessageEmbed()
			.setTitle("❌ Você já possui um ticket aberto!")
			.setDescription('👉 Encerre o ticket atual para poder abrir um novo.')
			.setColor("0000ff")
			.setFooter({ text: 'Decx Team - All Copyright reserved for © Decx ', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/929820602779435078/Component_1.png' });

		const sucessEmbed = new discord.MessageEmbed()
			.setTitle("✅ Ticket criado com sucesso!")
			.setDescription('👉 Você foi mencionado no canal correspondente ao seu ticket.')
			.setColor("0000ff")
			.setFooter({ text: 'Decx Team - All Copyright reserved for © Decx ', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/929820602779435078/Component_1.png' });

		for (const channel of guildChannels.values()) {
			if (channel.name === interactionChannelName.toLowerCase()) {
				interaction.reply({ ephemeral: true, embeds: [errorEmbed] });
				return;
			}
		}

		const adminMessage = new discord.MessageEmbed()
			.setTitle("☄️ Um ticket foi aberto!")
			.setDescription(`💾PROTOCOLO: ${interaction.user.id}/${protocol}`)
			.addField('😀 Usuário:', `${interaction.user.username}`, true)
			.setColor("0000ff")
			.setFooter({ text: 'Decx Team - All Copyright reserved for © Decx ', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/929820602779435078/Component_1.png' });

		adminAlertChannel.send({ ephemeral: true, embeds: [adminMessage] });

		guild.channels.create(`ticket-${interaction.user.username}`, {
			permissionOverwrites: [
				{
					id: interaction.user.id,
					allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
				},
				{
					id: interaction.guild.roles.everyone,
					deny: ["VIEW_CHANNEL"]
				}
			],
			type: 'text'
		}).then(async channel => {
			channel.send(`<@${interaction.user.id}>`);
			const embed = new discord.MessageEmbed()
				.setTitle("☄️ Você solicitou um ticket.")
				.setDescription("Entraremos em contato o mais rápido possível, aguarde. Clique no botão vermelho para encerrar o ticket.")
				.setColor("0000ff")
				.setFooter({ text: 'Decx Team - All Copyright reserved for © Decx ', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/929820602779435078/Component_1.png' });

			const deleteButton = new discord.MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('delete')
						.setLabel('Cancelar Ticket')
						.setEmoji('✖️')
						.setStyle('DANGER'),
				);

			const sent = await channel.send({ ephemeral: true, embeds: [embed], components: [deleteButton] });
			interaction.reply({ ephemeral: true, embeds: [sucessEmbed] });
		})
	}
	if (interaction.customId === "delete") {
		interaction.channel.delete();

		const deleteMessage = new discord.MessageEmbed()
			.setTitle("❌ Ticket foi encerrado!")
			.setDescription(`💾PROTOCOLO: ${interaction.user.id}/${protocol}`)
			.setColor("0000ff")
			.setFooter({ text: 'Decx Team - All Copyright reserved for © Decx ', iconURL: 'https://cdn.discordapp.com/attachments/929573302098362399/929820602779435078/Component_1.png' });

		try {
			interaction.user.send({ ephemeral: true, embeds: [deleteMessage] });
		} catch (err) {
			adminAlertChannel.send({ ephemeral: true, embeds: [deleteMessage] });
		}
	}
});

decx.login(process.env.token);
