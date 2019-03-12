const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

let dm = new Discord.RichEmbed()
    .setColor(`#409cd9`)
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .setDescription(`<a:Chest:511163406967898115> I have private messaged you a list of commands!`)
    .setTimestamp()
    message.channel.send(dm);

const pages = [`**<a:righter_arrow:518744759506960406> Click on the arrows to change the page! <a:lefter_arrow:518744793489342464>**`, `**:desktop: General Commands**\nhelp/commands - Show a list of commands & guides to your DM.\nping - Show the current bot ping/ms.\nverify/verification - Verify your discord account.\nbotinfo - Shows the information of the bot.\nserverinfo - Shows the information of the guild.\nuserinfo [user] - Shows the information of the user.\n8ball [question] - A fun command that answer your question.\nguilds/servers - Shows a list of <@482795587045949440> guilds.\nleaderboard/leaderstats - Shows a list of <@482795587045949440> guilds, from the most members to least.`, `**:tools: Moderation Commands**\nclear [amount] - Clear the given amount of messages.\nsay [text] - Force <@482795587045949440> to chat with your given text.`, `**:headphones: Music Commands**\nCurrently, the commands in this category are being edited by <@346102251632197632>\nDue to the issues with Heroku, please check back later.`]
let page = 1;

const colors = ['#2855fc', '#fcf428', '#fc2929', '#28bffc']
let color = 1;

let helpembed = new Discord.RichEmbed()
    .setColor(colors[color - 1])
    .setAuthor(`Commands & Guides`, bot.user.avatarURL)
    .setDescription(pages[page - 1])
    .setFooter(`Page ${page} of ${pages.length}`)
    .setTimestamp(new Date());
    message.author.send(helpembed).then(msg => {
      msg.react('⬅').then(() => {
        msg.react('➡');

      const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
      const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;

      const backwards = msg.createReactionCollector(backwardsFilter, { time: 0 });
      const forwards = msg.createReactionCollector(forwardsFilter, { time: 0 });


      backwards.on('collect', () => {
        if (page === 1) return;
        page--;
        color--;
        helpembed.setDescription(pages[page - 1]);
        helpembed.setColor(colors[color - 1]);
        helpembed.setFooter(`Page ${page} of 4`);
        msg.edit(helpembed);
      });

      forwards.on('collect', () => {
        if (page === 4) return;
        page++;
        color++;
        helpembed.setDescription(pages[page - 1]);
        helpembed.setColor(colors[color - 1]);
        helpembed.setFooter(`Page ${page} of 4`);
        msg.edit(helpembed);
      });
    });
  });
}
module.exports.help = {
  name: "commands"
}
