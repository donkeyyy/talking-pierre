const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Interaction } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const discordVoice = require("@discordjs/voice");
const config = require("./config.json");

//VOICE STUFF

    const sounds = [];

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    }
    
    /**
     * 
     * @param {discord.VoiceChannel} voiceChannel
     */
    async function runBen(voiceChannel) {
      if (voiceChannel == null || voiceChannel.guild.me.voice.channel) return;
      const connection = discordVoice.joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false,
      });
      const player = discordVoice.createAudioPlayer({
        behaviors: {
          noSubscriber: discordVoice.NoSubscriberBehavior.Play,
        },
      });
    
    
      connection.subscribe(player);
      if (config.RESPOND_ON_MEMBER_VOICE_STATE) {
        const speakingMap = connection.receiver.speaking;
        speakingMap.on("start", (userId) => {
          player.stop(true);
        });
        speakingMap.on("end", (userId) => {
          player.play(
            discordVoice.createAudioResource(sounds[getRandomInt(0, sounds.length)]),
            voiceChannel.id,
            voiceChannel.guild.id
          );
        });
      } else {
        player.play(
          discordVoice.createAudioResource(sounds[getRandomInt(0, sounds.length)]),
          voiceChannel.id,
          voiceChannel.guild.id
        );
    
        player.on("stateChange", (oldState, newState) => {
          if (
            newState.status === discordVoice.AudioPlayerStatus.Idle &&
            oldState.status !== discordVoice.AudioPlayerStatus.Idle
          ) {
            setTimeout(() => {
              player.play(
                discordVoice.createAudioResource(sounds[getRandomInt(0, sounds.length)]),
                voiceChannel.id,
                voiceChannel.guild.id
              );
            }, getRandomInt(1, 4) * 1000);
          }
        });
      }
    }
    
    client.on("voiceStateUpdate", (oldState, newState) => {
      if (newState.member.user.bot) return;
      if (config.JOIN_AUTOMATICALLY && oldState.channel == null && newState.channel != null) {
        runBen(newState.channel);
      if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
        return;
      }
    });
    
    client.on("ready", (bot) => {
      console.log(`Logged in as ${bot.user.username}`);
    
      fs.readdir("./sounds", (err, files) => {
        if (err) return console.error(err);
        files.forEach((file) => {
          sounds.push("./sounds/" + file);
        });
      });
    });

//SLASH STUFF

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'help') {
    const support = new MessageActionRow()
  .addComponents(
    new MessageButton()
    .setURL('https://discord.gg/ws7HjWNEM5')
    .setLabel('Join the Support Server')
    .setStyle('LINK'),
  ); 
  const helpEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Invite me to your server!')
	.setURL('https://discord.com/api/oauth2/authorize?client_id=970275589804130304&permissions=412320394304&redirect_uri=https%3A%2F%2Fdiscord.gg%2FHVca9FXXNu&response_type=code&scope=bot%20guilds.join')
	.setAuthor({ name: 'Talking Pierre', iconURL: 'https://cdn.discordapp.com/attachments/967871341875302512/972825562156523530/OIP.jpeg' })
	.setDescription('Increase the fun in your server with this pretty cute pet, Pierre the parrot! You can even talk with him! You can see the full commands list below!')
	.setThumbnail('https://cdn.discordapp.com/attachments/967871341875302512/972825562156523530/OIP.jpeg')
	.addFields(
		{ name: 'Chat Stuff', value: '/stuff - Makes Pierre do stuff! \n/touch - Makes you do stuff with Pierre! \n/throw - Makes Pierre throw out stuff of the sink! \n/tomato - Makes you shoot Pierre with tomatoes! \n/ask <your question> - Asks the all known Pierre a question! \n/say <your message> - Makes Pierre repeat your message!' },
		{ name: 'Voice Stuff', value: '/voice - Makes Pierre join the voice channel you are in so you can talk with him!' },
    { name: 'Help Command', value: '/help - Opens this menu!' },
	)
	.setTimestamp()
	.setFooter({ text: 'Talking Pierre', iconURL: 'https://cdn.discordapp.com/attachments/967871341875302512/972825562156523530/OIP.jpeg' });
		await interaction.reply({ embeds: [helpEmbed], components: [support] });
	}
  if (commandName === 'stuff') {
    const rowpierre = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('pierrestuff')
            .setLabel('Turn On Tap')
            .setStyle('PRIMARY')
        )
        .addComponents(
          new MessageButton()
            .setCustomId('pierreidk')
            .setLabel('Turn On Blender')
            .setStyle('PRIMARY')
        )
        .addComponents(
          new MessageButton()
            .setCustomId('pierresth')
            .setLabel('Play on Guitar')
            .setStyle('PRIMARY')
        ).addComponents(
          new MessageButton()
            .setCustomId('pierreshoot')
            .setLabel('Shoot')
            .setStyle('PRIMARY')
        );
      const embedidk = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription('Select what you want pierre to do!')
            .setImage(
            "https://cdn.discordapp.com/attachments/969639455948439602/969958922293248080/ezgif.com-gif-maker-min.gif"
            )
            .setTimestamp(new Date());
		await interaction.reply({ embeds: [embedidk], components: [rowpierre] });
    const embedtap = new MessageEmbed()
    .setColor(0x6ce600)
    .setDescription('woohooo')
    .setImage(
    "https://cdn.discordapp.com/attachments/969609052554428497/969959668044681227/ezgif.com-gif-maker-water-min.gif"
    )
    .setTimestamp(new Date());
    const embedblender = new MessageEmbed()
    .setColor(0x6ce600)
    .setDescription('damn, pierre broke the blender')
    .setImage(
    "https://cdn.discordapp.com/attachments/969601539251519519/969960318350528582/ezgif.com-gif-maker-blender-min.gif"
    )
    .setTimestamp(new Date());
    const embedguitar = new MessageEmbed()
    .setColor(0x6ce600)
    .setDescription('TOO LOUD!!!')
    .setImage(
    "https://cdn.discordapp.com/attachments/969607866333929482/969960871587610674/guitar-min.gif"
    )
    .setTimestamp(new Date());
    const embedpaw = new MessageEmbed()
    .setColor(0x6ce600)
    .setDescription('paw paw')
    .setImage(
    "https://cdn.discordapp.com/attachments/969904904506310676/970344451664928808/talking-pierre.gif"
    )
    .setTimestamp(new Date());
    const collector = interaction.channel.createMessageComponentCollector();
  
    collector.on('collect', async i => {
    if (i.customId === 'pierrestuff') {
  
    await i.reply({ embeds: [embedtap], components: []  }).catch(() => {})
  }
  if (i.customId === 'pierreidk') {
  
    await i.reply({ embeds: [embedblender], components: []  }).catch(() => {}).catch(() => {})
  }
  if (i.customId === 'pierresth') {
  
    await i.reply({ embeds: [embedguitar], components: []  }).catch(() => {}).catch(() => {})
  }
  if (i.customId === 'pierreshoot') {
  
    await i.reply({ embeds: [embedpaw], components: []  }).catch(() => {}).catch(() => {})
  }
    });
  }
  if (commandName === 'touch') {
    const rowbot = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('noname')
            .setPlaceholder('Select An Option')
            .addOptions([
              {
                label: 'Pet',
                description: 'Makes you pet Pierre!',
                emoji: '<:pierre:970344993451544666>',
                value: 'pierreone',
              },
              {
                label: 'Bonk (Normal)',
                description: 'Makes you bonk Pierre!',
                emoji: '<:pierrebonk:970345442011410462>',
                value: 'pierretwo',
              },
              {
                label: 'Bonk (Hard)',
                description: 'Makes Tom the cat bonk Pierre!',
                emoji: '<:pierrehard:970345517374636072>',
                value: 'pierrethree',
              },
              {
                label: 'Shoot',
                description: 'Makes you shoot Pierre!',
                emoji: '<:black_pistola:970345915472810014>',
                value: 'pierrefour',
              },
            ]),
        );
  
        const embedsth = new MessageEmbed()
        .setColor(0x6ce600)
        .setDescription("How do you want to touch Pierre?")
        .setImage(
          "https://cdn.discordapp.com/attachments/969639455948439602/969958922293248080/ezgif.com-gif-maker-min.gif"
        )
        .setTimestamp(new Date());
		await interaction.reply({ embeds: [embedsth], components: [rowbot] });
    const filter = (interaction) => {
      return interaction.customId === "noname";
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60 * 1000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "noname") {
        const selectedValue = interaction.values[0];
        if (selectedValue === "pierreone") {
          const embedpet = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("<3")
            .setImage(
              "https://cdn.discordapp.com/attachments/969903573167116308/970346774558572605/YouCut_20220430_131449958.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedpet] }).catch(() => {})
        }
        if (selectedValue === "pierretwo") {
          const embedbonk = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("ouch")
            .setImage(
              "https://cdn.discordapp.com/attachments/969904751179358278/970347257029353482/YouCut_20220430_133243025.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedbonk] }).catch(() => {})
        }
        if (selectedValue === "pierrethree") {
          const embedbonktwo = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("OUCH")
            .setImage(
              "https://cdn.discordapp.com/attachments/969904751179358278/970347705547255888/YouCut_20220430_162737215.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedbonktwo] }).catch(() => {})
        }
        if (selectedValue === "pierrefour") {
          const embedfour = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("oh that was too close!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969904751179358278/970342051575111831/YouCut_20220430_132151988.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedfour] }).catch(() => {})
        }

        }
    });
	}
  if (commandName === 'throw') {
        const rowpierre = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId('idkwhattonamethis')
              .setPlaceholder('Select An Option')
              .addOptions([
                {
                  label: 'Kettle',
                  emoji: '<:uwukettle:969965088687657041>',
                  value: 'first_option',
                },
                {
                  label: 'Knife',
                  emoji: '<:knifedarkest:969965656227319918>',
                  value: 'second_option',
                },
                {
                  label: 'Saucer',
                  emoji: '<:PZcuteplate:969966313546080317>',
                  value: 'third_option',
                },
                {
                  label: 'Tomato',
                  emoji: '<:tomatoreal:969966641062486016>',
                  value: 'fourth_option',
                },
                {
                  label: 'Banana',
                  emoji: '<:no_banana:969966912903737417>',
                  value: 'fiveth_option',
                },
                {
                  label: 'Spoon',
                  emoji: '<:bigspoon:969967222934102027>',
                  value: 'sixth_option',
                },
                {
                  label: 'Sponge',
                  emoji: '<:epicsponge:969967817539584030>',
                  value: 'seventh_option',
                },
                {
                  label: 'Apple',
                  emoji: '<:foodapple:969968234700865607>',
                  value: 'eighth_option',
                },
                {
                  label: 'Tea Cup',
                  emoji: '<:teacup:969968588624625674>',
                  value: 'nineth_option',
                },
                {
                  label: 'Frying Pan',
                  emoji: '<:fryingpan:969969204344266871>',
                  value: 'tenth_option',
                },
              ]),
          );
    
          const embed = new MessageEmbed()
          .setColor(0x6ce600)
          .setDescription("Pick what you want Pierre to throw out of the sink!")
          .setImage(
            "https://cdn.discordapp.com/attachments/969639455948439602/969958922293248080/ezgif.com-gif-maker-min.gif"
          )
          .setTimestamp(new Date());
		await interaction.reply({ embeds: [embed], components: [rowpierre] });
    const filter = (interaction) => {
      return interaction.customId === "idkwhattonamethis";
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60 * 1000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "idkwhattonamethis") {
        const selectedValue = interaction.values[0];
        if (selectedValue === "first_option") {
          const embedkettle = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a kettle!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969971188635942972/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedkettle] }).catch(() => {})
        }
        if (selectedValue === "second_option") {
          const embedknife = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a knife!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969971762899071036/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedknife] }).catch(() => {})
        }
        if (selectedValue === "third_option") {
          const embedsaucer = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a saucer!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969972311258193970/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedsaucer] }).catch(() => {})
        }
        if (selectedValue === "fourth_option") {
          const embedtomato = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a tomato!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969972942085697576/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedtomato] }).catch(() => {})
        }
        if (selectedValue === "fiveth_option") {
          const embedbanana = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a banana!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969973369489465365/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedbanana] }).catch(() => {})
        }
        if (selectedValue === "sixth_option") {
          const embedspoon = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a spoon!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969973874424971354/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedspoon] }).catch(() => {})
        }
        if (selectedValue === "seventh_option") {
          const embedsponge = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a sponge!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969974323634901013/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedsponge] }).catch(() => {})
        }
        if (selectedValue === "eighth_option") {
          const embedapple = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out an apple!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969974736253771796/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedapple] }).catch(() => {})
        }
        if (selectedValue === "nineth_option") {
          const embedcup = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a tea cup!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969975150118309888/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedcup] }).catch(() => {})
        }
        if (selectedValue === "tenth_option") {
          const embedpan = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Throwing out a frying pan!")
            .setImage(
              "https://cdn.discordapp.com/attachments/969609052554428497/969975507863105536/ezgif.com-gif-maker.gif"
            )
            .setTimestamp(new Date());
            await interaction.reply({ embeds: [embedpan] }).catch(() => {})
        }
      
        }
    });
	}
  if (commandName === 'tomato') {
    const rowtomato = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('tomato')
            .setLabel('Shoot')
            .setStyle('PRIMARY')
        );
        const rowtomatotwo = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('tomatotwo')
            .setLabel('Try Again')
            .setStyle('PRIMARY')
        );
        const rowtomatothree = new MessageActionRow()
        .addComponents(  
        new MessageButton()
            .setCustomId('tomatothree')
            .setLabel('Try Again')
            .setStyle('PRIMARY')
        );
        const rowtomatofour = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('tomatofour')
            .setLabel('Try Again')
            .setStyle('PRIMARY')
        );
      const embedtomato = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription('Hmm, will you succeed to shoot Pierre with a tomato?')
            .setImage(
            "https://cdn.discordapp.com/attachments/969639455948439602/969958922293248080/ezgif.com-gif-maker-min.gif"
            )
            .setTimestamp(new Date());
		await interaction.reply({ embeds: [embedtomato], components: [rowtomato] });
    const embedloser = new MessageEmbed()
    .setColor(0x6ce600)
    .setDescription('loser')
    .setImage(
    "https://cdn.discordapp.com/attachments/969909466948591666/970349470380326912/YouCut_20220430_133500506.gif"
    )
    .setTimestamp(new Date());
    const embedlosertwo = new MessageEmbed()
    .setColor(0x6ce600)
    .setDescription('loser')
    .setImage(
    "https://cdn.discordapp.com/attachments/969909466948591666/970349881543761950/YouCut_20220430_133809347.gif"
    )
    .setTimestamp(new Date());
    const embedloserthree = new MessageEmbed()
    .setColor(0x6ce600)
    .setDescription('loser')
    .setImage(
    "https://cdn.discordapp.com/attachments/969909466948591666/970350257051435008/YouCut_20220430_134001542.gif"
    )
    .setTimestamp(new Date());
    const embedrip = new MessageEmbed()
    .setColor(0x6ce600)
    .setDescription('rip pierre')
    .setImage(
    "https://cdn.discordapp.com/attachments/969909466948591666/970350675861073931/YouCut_20220430_134402626.gif"
    )
    .setTimestamp(new Date());
    const collector = interaction.channel.createMessageComponentCollector();
  
    collector.on('collect', async i => {
    if (i.customId === 'tomato') {
  
    await i.reply({ embeds: [embedloser], components: [rowtomatotwo]  }).catch(() => {})
  }
  if (i.customId === 'tomatotwo') {
  
    await i.reply({ embeds: [embedlosertwo], components: [rowtomatothree]  }).catch(() => {}).catch(() => {})
  }
  if (i.customId === 'tomatothree') {
  
    await i.reply({ embeds: [embedloserthree], components: [rowtomatofour]  }).catch(() => {}).catch(() => {})
  }
  if (i.customId === 'tomatofour') {
  
    await i.reply({ embeds: [embedrip], components: []  }).catch(() => {}).catch(() => {})
  }
    });
	}
  if (commandName === 'ask') {
    const SayMessage = interaction.options.getString('question'); //undercs
    const embedrandomno = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("No")
            .setImage(
              "https://cdn.discordapp.com/attachments/969904904506310676/970344451664928808/talking-pierre.gif"
            )
            .setFooter({ text: `Question: ${(SayMessage)}` })
            .setTimestamp(new Date());
            const embedrandomyes = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription("Yes")
            .setImage(
              "https://cdn.discordapp.com/attachments/969903573167116308/970346774558572605/YouCut_20220430_131449958.gif"
            )
            .setFooter({ text: `Question: ${(SayMessage)}` })
            .setTimestamp(new Date());
   const randomsyesno = [
    ({ embeds: [embedrandomyes] }),
    ({ embeds: [embedrandomno] }),
   ];
   const response = randomsyesno[Math.floor(Math.random() * randomsyesno.length)];
		await interaction.reply(response);
	}
  if (commandName === 'say') {
    const SayMessageTwo = interaction.options.getString('message');
      const embedrandomsay = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription(SayMessageTwo)
            .setImage(
              "https://cdn.discordapp.com/attachments/969639455948439602/970354966046842930/YouCut_20220429_194224443.gif"
            )
            .setTimestamp(new Date());
      const embedrandomsaytwo = new MessageEmbed()
            .setColor(0x6ce600)
            .setDescription(SayMessageTwo)
            .setImage(
              "https://cdn.discordapp.com/attachments/969904904506310676/970344451664928808/talking-pierre.gif"
            )
            .setTimestamp(new Date());
            const randomssay = [
              ({ embeds: [embedrandomsay] }),
              ({ embeds: [embedrandomsaytwo] }),
             ];
             const responsesay = randomssay[Math.floor(Math.random() * randomssay.length)];
    await interaction.reply(responsesay); 
  }
  if (commandName === 'voice') {
    const voiceChannel = interaction?.member?.voice?.channel;
    if (!voiceChannel) return interaction.reply("You are not in a voice channel!");
    runBen(voiceChannel)
    interaction.reply(":white_check_mark:");
  }    
});

//MORE VOICE STUFF

client.on('voiceStateUpdate', (oldState, newState) => {
  const { getVoiceConnection } = require('@discordjs/voice')
  const connection = getVoiceConnection(oldState.guild.id)
  
      
      if (oldState.channelId !==  oldState.guild.me.voice.channelId || newState.channel)
        return;

      
      if (oldState.channel == null) return;
      if (!oldState.channel.members.size - 1) 
        setTimeout(() => {
          try {
          if (connection) connection.destroy()
          } catch (error) {
            console.log(error);
          }
         }, 1000); 

}); 


client.login("lostilostilostilostilostilostilosti")

client.on('ready', () => {
  client.user.setActivity(`Phelp`, { type: 'WATCHING' });
  });
  client.on("warn", console.warn);
  client.on("error", console.error);
