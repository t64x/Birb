const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const ownerID = '304517461083029504'
const swearWords = //["fuck", "shit", "fag", "faggot", "nigga", "nigger", "pussy", "rape", "dick", "pussi", "whore", "FUCK", "SHIT", "DICK", "porn", "PORN", "fuq", "faq", "fuc", "fac", "FUC", "FUQ", "FAQ", "dildo", "DILDO", "PUSSI", "PUSSY", "NIGGA", "NIGGER", "nazi", "NAZI", "hitler", "HITLER", "adolf", "ADOLF", "WHORE", "ARSE", "kuy", "KUY", "RAPE", "penis", "PENIS", "boob", "BOOB", "FAG", "cunt", "CUNT", "cum", "CUM", "bitch", "BITCH", "fuk", "FUK", "Bitch", "Cyka", "cyka", "CYKA", "blyat", "Blyat", "BLYAT", "butt", "Butt", "BUTT", "Fag", "Fuck", "Shit", "Nigga", "Nigger", "Pussy", "Pussi", "Rape", "Dick", "Whore"];
bot.commands = new Discord.Collection();
let coins = require("./coins.json");
let xp = require("./xp.json");
let purple = botconfig.purple;
let cooldown = new Set();
let cdseconds = 3;

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

function changing_status() {
    let status = ['and watching on 5 servers, type --help for commands!', 'with puppers!, type --help for commands!', 'on NuaZaKung PC, type --help for commands!']
    let random = status[Math.floor(Math.random() * status.length)]
    bot.user.setActivity(random)
}

bot.on("ready", async () => {

  console.log(`${bot.user.username} is loaded and online on ${bot.guilds.size} servers!`);
  setInterval(changing_status, 8500);

});


bot.on("message", async message => {

  if(message.channel.type === "dm") return;
  if( swearWords.some(word => message.content.includes(word)) ) {
        message.delete();
        let badword = new Discord.RichEmbed()
        .setDescription("Message deleted!")
        .setColor("#f44242")
        .addField(":warning: \`Your message contains inappropriate letters or words, deleted.\` :thinking:", message.author)
        message.channel.send(badword).then(msg => {msg.delete(7850)});
      }

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  if(!coins[message.author.id]){
    coins[message.author.id] = {
      coins: 0
    };
  }

  let coinAmt = Math.floor(Math.random() * 10000) + 1;
  let baseAmt = Math.floor(Math.random() * 10000) + 1;
  console.log(`${coinAmt} ; ${baseAmt}`);

  if(coinAmt === baseAmt){
    coins[message.author.id] = {
      coins: coins[message.author.id].coins + coinAmt
    };
  fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
    if (err) console.log(err)
  });
  let coinEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#0000FF")
  .addField("💸", `${coinAmt} coins added!`);

  message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
  }

  let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);

  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 300;
  xp[message.author.id].xp =  curxp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
    let lvlup = new Discord.RichEmbed()
    .setTitle("Level Up!")
    .setColor(purple)
    .addField("New Level", curlvl + 1);

    message.channel.send(lvlup).then(msg => {msg.delete(5000)});
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
  });
  let prefix = prefixes[message.guild.id].prefixes;
  if(!message.content.startsWith(prefix)) return;
  if(cooldown.has(message.author.id)){
    message.delete();
    let cooldownbotsystem = new Discord.RichEmbed()
    .setDescription("Error!")
    .setColor("#f44242")
    .addField(":warning: \`You have to wait 3 seconds between commands.\` :stopwatch:", message.author)
    message.channel.send(cooldownbotsystem).then(msg => {msg.delete(6850)});
  }
  if(!message.member.hasPermission("MANAGE_MESSAGES")){
    cooldown.add(message.author.id);
  }

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cdseconds * 1000)

});

bot.login(tokenfile.token);
