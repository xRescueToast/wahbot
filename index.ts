import DiscordJS, { Intents, Message, VoiceChannel } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()
const fs = require('fs')
var wahcounter = 0
fs.readFile('counter.txt', 'utf8' , (err: any, data: String) => {
    if (err) {
      console.error(err)
      return
    }
    wahcounter = Number(data)
  })

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
})

    const guildID = '943285541561041017'
    const guild = client.guilds.cache.get(guildID)


client.on('ready', () => {
    console.log('the bot is ready')
    const guildID = '943285541561041017'
    const guild = client.guilds.cache.get(guildID)
    let commands

    if(guild){
        commands = guild.commands
    }
    else{
        commands = client.application?.commands
    }

    commands?.create({
        name: 'add',
        description: 'adds two numnbers',
        options: [
            {
                name: 'num1',
                description: 'the first number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: 'num2',
                description: 'the second number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    })
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()){
        return
    }
    const {commandName, options} = interaction
    if(commandName === 'add'){
        const num1 = options.getNumber('num1') || 0
        const num2 = options.getNumber('num2') || 0
        await interaction.deferReply({
            ephemeral: true
        })
        interaction.editReply({
            content: `the sum is ${num1 + num2}`,
        })
    }
})

client.on('messageCreate', (message) => {

    if(message.channel.type == "DM"){
        return
    }
    if(message.author.bot){
        return
    }
    else{
        var split = message.content.split(" ")
        if(message.content.startsWith("!")){
            if(split[0] === '!purge'){
                if(message.member && message.member.roles.cache.some(role => role.name === 'wah')){
                    var amount = Number(split[1])
                    message.channel.bulkDelete(amount + 1)
                }
            }
            if(split[0] === 'banish'){
                //var mmbr = (message.mentions.users.first())
                //guild.member(id).voice.setChannel("channelID");
    
                //message.channel.send(":right_facing_fist: " + mmbr)
            }

        }
    
        else{
                if(message.content.toLowerCase().includes('wah')){
                wahcounter = wahcounter + 1
                //message.reply({
                //    content:  message.author + ' said wah! wah counter:' + wahcounter
                //})
                message.channel.send(message.author.toString() + ' said wah, wah counter: ' + wahcounter)
                fs.writeFile('counter.txt', String(wahcounter), (err: any) => {
            
                    // In case of a error throw err.
                    if (err) throw err;
                })
            }
        }
    }
})



client.login(process.env.TOKEN)