const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
	new SlashCommandBuilder().setName('help').setDescription('Sends the commands list and some info!'),
	new SlashCommandBuilder().setName('stuff').setDescription('Makes Pierre do stuff!'),
	new SlashCommandBuilder().setName('touch').setDescription('Makes you do stuff with Pierre!'),
    new SlashCommandBuilder().setName('throw').setDescription('Makes Pierre throw stuff out of the sink!'),
    new SlashCommandBuilder().setName('tomato').setDescription('Makes you shoot Pierre with tomatoes!'),
    new SlashCommandBuilder().setName('ask').setDescription('Asks the all known Pierre a question!').addStringOption(option =>
		option.setName('question')
			.setDescription('Your question')
			.setRequired(true)),
    new SlashCommandBuilder().setName('say').setDescription('Makes Pierre repeat your message!').addStringOption(option =>
		option.setName('message')
			.setDescription('Your message')
			.setRequired(true)),
    new SlashCommandBuilder().setName('voice').setDescription('Makes Pierre join the voice channel you are in so you can talk with him!'),
    
]
.map(command => command.toJSON());

const clientId = ("lostilostilosti")
const token = ("lostilostilostilostilosti")
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
