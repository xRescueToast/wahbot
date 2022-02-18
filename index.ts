import DiscordJS, { Intents, Message, SystemChannelFlags, VoiceChannel } from 'discord.js'
import { MembershipStates } from 'discord.js/typings/enums';
import DisTube, { Queue, Song } from 'distube';
import dotenv from 'dotenv'
import fetch from 'node-fetch';
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
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})
const distube = new DisTube(client, {searchSongs: 0, emitNewSongOnly: true})
const guildID = '943285541561041017'
const guild = client.guilds.cache.get(guildID)


client.on('ready', () => {
    console.log('the bot is ready')
    const guildID = '943285541561041017'
    const guild = client.guilds.cache.get(guildID)
    let commands

    if(client.user){
        client.user.setActivity('ur mom', { type: 'WATCHING'});
    }

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

client.on('messageCreate', async (message) => {
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
                    var amount = await Number(split[1])
                    message.channel.bulkDelete(amount + 1)
                }
            }
            if(split[0] === '!play'){
                var music = ""
                for(var x = 1; x < split.length; x++){
                    music += split[x]
                }
                inVoiceChannel: true
                if(message.member && message.member.voice.channel){
                    distube.play(message.member.voice?.channel, music, {
                        member: message.member,
                        textChannel: message.channel,
                        message
                    });
                    //console.log(distube.getQueue(message))

                    if(distube.getQueue(message) == undefined){
                        distube.on("playSong", (queue, song) => message.channel.send(`playing song:  \`${song.name}\` - \`(${song.formattedDuration})\`\nrequested by: ${song.user}`))
                    }
                    else{
                        distube.on("addSong", (queue, song) => message.channel.send(`added song to queue:  \`${song.name}\` - \`(${song.formattedDuration})\`\nrequested by: ${song.user}`))

                    }
                }
                else{
                    message.channel.send(message.author.toString() + ' you need to be in a voice channel to use this command')
                }
            }
            if(split[0] === '!stop'){
                if(distube.getQueue(message) != undefined){
                    distube.stop(message)
                    message.channel.send(message.author.toString() + ' has requested the song to stop')
                }
                else{
                    message.channel.send(message.author.toString() + ' there is no music playing :c')
                }
            }
            if(split[0] === '!queue' || split [0] === '!q'){
                const queue = distube.getQueue(message)
                if(queue != undefined){
                    message.channel.send('Current queue:\n' + queue.songs.map((song, id) => `**${id+1}**. \`${song.name}\` (<${song.url}>) - \`${song.formattedDuration}\``).join("\n"));
                }
                else{
                    message.channel.send(message.author.toString() + ' there is no queue!')
                }
            }
            if(split[0] === 'skip'){
                if(message.member && message.member.voice.channel){
                    distube.skip(message)
                }
                else{
                    message.channel.send(message.author.toString() + ' you must be in the vc to skip a song!')
                }
            }

            if(split[0] === '!foob'){
                if(message.member && message.member.id.toString() == '264583320275386369'){
                    message.channel.send(message.author.toString() + ' since kywa is so cute this meal is on the house! :heart:')
                }
                else{
                    message.channel.send(message.author.toString() + ' here is some food for you to eat')
                }
                const response = await fetch('https://foodish-api.herokuapp.com/api/')
                const data = await response.json()
                //console.log(data);
                var image = data.image;
                //console.log(image)
                message.channel.send(image)
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
            if(message.content.toLowerCase().includes('bunger')){
                message.channel.send(message.author.toString() + ' here is a bunger for you :D')
                const response = await fetch('https://foodish-api.herokuapp.com/api/images/burger')
                const data = await response.json()
                //console.log(data);
                var image = data.image;
                //console.log(image)
                message.channel.send(image)
            }
        }
    }
})



client.login(process.env.TOKEN)