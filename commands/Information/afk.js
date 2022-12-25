const Discord = require('discord.js');

module.exports = {
    name : 'afk',
    category: "utility",
    usage: "afk",

    run : async(client, message, args) => {
        const content = args.join(" ") ? args.join(' ') : "AFK"
        
        const afkEmbed = new Discord.MessageEmbed()
        .setColor("#a3eb7b")
        .setDescription(`<:approve:1053391488479940618> ${message.author}: You're now AFK with the status: **${content}**`)
        message.channel.send(afkEmbed)                
    }
}