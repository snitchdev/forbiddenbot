const Discord = require('discord.js');
const moment = require('moment');
const { color } = require("../../botconfig/embed.json");
const { verifiedBotDev } = require("../../botconfig/emojis.json");
const { bugHunter } = require("../../botconfig/emojis.json");
const { bugHunterPlus } = require("../../botconfig/emojis.json");
const { discordPartner } = require("../../botconfig/emojis.json");
const { discordStaff } = require("../../botconfig/emojis.json");
const { hypeSquad } = require("../../botconfig/emojis.json");
const { hypeSquadBravery } = require("../../botconfig/emojis.json");
const { hypeSquadBril } = require("../../botconfig/emojis.json");
const { hypeSquadBal } = require("../../botconfig/emojis.json");
const { verifiedBot } = require("../../botconfig/emojis.json");
const { earlySupporter } = require("../../botconfig/emojis.json");

const flags = {
  DISCORD_EMPLOYEE: `${discordStaff}`,
  DISCORD_PARTNER: `${discordPartner}`,
  BUGHUNTER_LEVEL_1: `${bugHunter}`,
  BUGHUNTER_LEVEL_2: `${bugHunterPlus}`,
  HYPESQUAD_EVENTS: `${hypeSquad}`,
  HOUSE_BRAVERY: `${hypeSquadBravery}`,
  HOUSE_BRILLIANCE: `${hypeSquadBril}`,
  HOUSE_BALANCE: `${hypeSquadBal}`,
  EARLY_SUPPORTER: `${earlySupporter}`,
  VERIFIED_BOT: `${verifiedBot}`,
  VERIFIED_DEVELOPER: `${verifiedBotDev}`
};

module.exports = {
  name: "ui",
  aliases: ["uit", "uinfo", "info"],

  run: async (client, message, args) => {
    let mentionedMember = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || args[0] || message.member;

    const user = await client.users.fetch(client.users.resolveID(mentionedMember)).catch(() => null);
    if (!user) user = message.author;
    const userFlags = user.flags.toArray();

    let nickname = user.nickname
    if (nickname) {
      nickname = `∙ ${user.nickname}`;
    } else {
      nickname = ''
    }

    let flags2 = user.flags2
    if (flags) {
      flags2 = `∙ ${userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : ' '}`;
    } else {
      flags2 = ''
    }

    let bot;
    if (user.bot === true) {
      bot = "Discord Bot";
    } else {
      bot = "N/A";
    }

    const userPos = message.guild.members.cache
      .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
      .array();

    const position = new Promise((fui) => {
      for (let i = 1; i < userPos.length + 1; i++) {
        if (userPos[i - 1].id === user.id) fui(i);
      }
    });

    const activities = [];
    let customStatus;
    for (const activity of user.presence.activities.values()) {
      switch (activity.type) {
        case 'LISTENING':
          if (user.bot) activities.push(`Listening to **${activity.name}**`);
          else activities.push(`Listening to [**${activity.details}**](https://open.spotify.com/) by **${activity.state}**`);
          break;
        case 'CUSTOM_STATUS':
          customStatus = activity.state;
          break;
      }
    }

    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
      .setAuthor(message.author.username, message.author.avatarURL({
        dynamic: true
      }))
      .setTitle(`${user.tag} ${nickname} ${flags2}`)
      .setDescription(`${activities.join('\n')}\n\`\`${user.id}\`\` ∙ Join position:`)
      .setFooter(`${bot}`)
      .setTimestamp()
      .addFields(
        {
          name: "**Joined Discord On**",
          value: `${moment(user.createdAt).format("dddd, MMMM Do YYYY, h:mm A")}`,
          inline: true
        },
        {
          name: "**Joined Guild On**",
          value: `${user.joinedAt === 0
            ? `N/A`
            : `${moment(user.joinedAt).format("dddd, MMMM Do YYYY, h:mm A")}`
            }`,
          inline: true
        },
        {
          name: '**Boosted Guild On**',
          value: `${user.premiumSinceTimestamp === 0
            ? `N/A`
            : `${moment(user.premiumSince).format("dddd, MMMM Do YYYY, h:mm A")}`
            }`,
          inline: true,
        },
        {
          name: `**Role List [${mentionedMember.roles.size || "N/A"}]**`,
          value: `${mentionedMember.roles.cache
            .filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id}>`)
            .join(", ") || "N/A"}`,
          inline: true
        })

    message.channel.send(embed)
  }
}