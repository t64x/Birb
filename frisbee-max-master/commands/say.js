const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  message.delete();
  if(!message.member.hasPermission(`MANAGE_MESSAGES`)) return message.reply(`:no_entry: \`Insufficient Permissions!\``);
  let botmessage = args.join(" ");
  message.channel.send(botmessage);
}

module.exports.help = {
  name: "say"
}
