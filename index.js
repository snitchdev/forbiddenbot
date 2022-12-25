//Importing all needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const fs = require("fs"); //this package is for reading files and getting their inputs
const nekoclient = require('nekos.life');
const neko = new nekoclient();
//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

//Client variables to use everywhere
client.commands = new Discord.Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Discord.Collection(); //an collection for all your command-aliases
client.categories = fs.readdirSync("./commands/"); //categories
client.cooldowns = new Discord.Collection(); //an collection for cooldown commands of each user

//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

const { VERIFICATION_CHANNEL, VERIFIED_ROLE, VERIFICATION_MESSAGE } = require("./botconfig/config.json");
const ERROR_MESSAGE_TIMEOUT = parseInt(process.env.ERROR_MESSAGE_TIMEOUT);
const SUCCESS_MESSAGE_TIMEOUT = parseInt(process.env.SUCCESS_MESSAGE_TIMEOUT);

client.on("messageCreate", message => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.content === VERIFICATION_MESSAGE && message.channel.id === VERIFICATION_CHANNEL) {
    if (!message.channel.permissionsFor(message.guild.me).serialize().SEND_MESSAGES) return console.error("The bot doesn't have the permission to send messages.\nRequired permission: SEND_MESSAGES");
    if (!message.channel.permissionsFor(message.guild.me).serialize().ADD_REACTIONS) {
      console.error("The bot doesn't have the permission to add reactions.\nRequired permission: `ADD_REACTIONS`");
      message.channel.send({ content: "The bot doesn't have the permission to add reactions.\nRequired permission: `ADD_REACTIONS`" })
        .then(m => setTimeout(() => m.delete(), ERROR_MESSAGE_TIMEOUT));
      return;
    }
    if (!message.channel.permissionsFor(message.guild.me).serialize().MANAGE_MESSAGES) {
      console.error("The bot doesn't have the permission to delete messages.\nRequired permission: `MANAGE_MESSAGES`");
      message.channel.send({ content: "The bot doesn't have the permission to delete messages.\nRequired permission: `MANAGE_MESSAGES`" })
        .then(m => setTimeout(() => m.delete(), ERROR_MESSAGE_TIMEOUT));
      return;
    }
    const messageRole = message.guild.roles.cache.get(VERIFIED_ROLE) ||
	message.guild.roles.cache.find(role => role.name === VERIFIED_ROLE);
    if (messageRole == null) return console.error('Role ' + VERIFIED_ROLE + ' not found.');
    if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
      message.channel.send({ content: "The bot doesn't have the permission required to assign roles.\nRequired permission: `MANAGE_ROLES`" })
        .then(m => setTimeout(() => m.delete(), ERROR_MESSAGE_TIMEOUT));
      return;
    }
    if (message.guild.me.roles.highest.comparePositionTo(messageRole) < 1) {
      message.channel.send({ content: "The position of this role is higher than the bot's highest role, it cannot be assigned by the bot." })
        .then(m => setTimeout(() => m.delete(), ERROR_MESSAGE_TIMEOUT));
      return;
    }
    if (messageRole.managed == true) {
      message.channel.send({ content: "This is an auto managed role, it cannot be assigned." })
        .then(m => setTimeout(() => m.delete(), ERROR_MESSAGE_TIMEOUT));
      return;
    }
    if (message.member.roles.cache.has(messageRole.id)) return;
    message.react("✅");
    message.member.roles.add(messageRole)
      .then(() => setTimeout(() => message.delete() ,SUCCESS_MESSAGE_TIMEOUT))
      .catch(error => {
      console.error(error);
      message.channel.send({ content: error.stack })
        .then(m => setTimeout(() => m.delete(), ERROR_MESSAGE_TIMEOUT));
    
        if (!message.channel.nsfw) {
          let embed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }), 'https://discordapp.com/oauth2/authorize?client_id=648959516016377896&scope=bot&permissions=66321471')
          .setTimestamp()
          .setColor('#D15252')
          .setTitle('📛 Error: Denied')
          .setDescription('This command is only allowed in **NSFW** channels.')
          .setFooter(message.author.tag)
          message.channel.send(embed);
        }
        
          if (nsfw_channel_only === 'true') {
          let file_name = `${message.content.split(' ')[0].replace(prefix, '')}.js`;
          if(!fs.existsSync('../../commands/information/' + file_name)) return undefined;
          if(fs.existsSync('../../commands/information/' + file_name)) {
          client.commands.get(file_name.replace('.js', '')).execute(client, message);
        }
        }
    
      });
  }
});





//login into the bot
client.login(require("./botconfig/config.json").token);

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
