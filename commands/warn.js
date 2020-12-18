const Discord = require('discord.js');
const fs = require("fs");
const ms = require("ms");
//const mysql = require('mysql');
//const file = require('../mysql.json');

exports.run = async (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
  //let logchannel = message.guild.channels.cache.find(x => x.name = 'logs');
  if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("❌**Error:** You don't have the **Kick Members** permission!");
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.').catch(console.error);
  if (message.mentions.users.first().id === message.author.id) return message.reply('You cannot warn yourself');
  //if (!logchannel) return message.channel.send('I cannot find a logs channel');
  if (reason.length < 1) reason = 'No reason supplied.';
  
  if(!warns[`${user.id}, ${message.guild.id}`]) warns[`${user.id}, ${message.guild.id}`] = {
    warns: 0
  };

  warns[`${user.id}, ${message.guild.id}`].warns++;

  fs.writeFile("./warnings.json", JSON.stringify(warns), err => {
    if(err) throw err;
  });

  const embed = new Discord.MessageEmbed()
  .setColor(0xFFFF00)
  .setTimestamp()
  .addField('Action:', 'Warning')
  .addField('User:', `${user.username}#${user.discriminator}`)
  .addField('Warned by:', `${message.author.username}#${message.author.discriminator}`)
  .addField('Number of warnings:', warns[`${user.id}, ${message.guild.id}`].warns)
  .addField('Reason', reason)
  let logchannel = message.guild.channels.cache.find(x => x.name = 'logs');
  let test1 = new Discord.MessageEmbed()
   .setDescription(`<:tick:702386031361523723> **Muted <@${user.id}> For 1 Hour** | **Reached Two Warnings**`)
   .setColor('GREEN')
   let bsuembed = new Discord.MessageEmbed()
   .setDescription(`<:tick:702386031361523723> **Warned** ${user.username}#${user.discriminator} | **${reason}**`)
   .setColor('GREEN')
   message.delete()
  message.channel.send(bsuembed)
  if(user.bot) return;
  message.mentions.users.first().send(`You are warned by ${message.author.username}#${message.author.discriminator}, ${reason}`).catch(e =>{
    if(e) return 
  });

     
     let test2 = new Discord.MessageEmbed()
   .setDescription(`<:tick:702386031361523723> **Kicked ${user.username}#${user.discriminator}** | **Reached Warnings 3**`)
   .setColor('GREEN')
     let test3 = new Discord.MessageEmbed()
   .setDescription(`<:tick:702386031361523723> **Banned ${user.username}#${user.discriminator}** | **Reached 5 Warnings**`)
   .setColor('GREEN')



  if(warns[`${user.id}, ${message.guild.id}`].warns == 2){
      let muteRole = client.guilds.cache.get(message.guild.id).roles.cache.find(val => val.name === 'Muted');

    let mutetime = "60s";
    message.guild.members.get(user.id).addRole(muteRole.id);
    message.channel.send(test1)

    setTimeout(function(){
      message.guild.members.get(user.id).removeRole(muteRole.id)
    }, ms(mutetime))
  }

  if(warns[`${user.id}, ${message.guild.id}`].warns == 3){
    message.guild.member(user).kick(reason);
    message.channel.send(test2)
  }

  if(warns[`${user.id}, ${message.guild.id}`].warns == 5){
    message.guild.member(user).ban(reason);
    message.channel.send(test3);
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["smolyeet"],
  permLevel: 0
};

exports.help = {
  name: 'warn',
  description: 'Issues a warning to the mentioned user.',
  usage: 'warn [mention] [reason]'
};