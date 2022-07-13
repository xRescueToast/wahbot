import DiscordJS, { Intents, Message, SystemChannelFlags, VoiceChannel } from 'discord.js'
import { ExplicitContentFilterLevels, MembershipStates } from 'discord.js/typings/enums';
import DisTube, { DisTubeVoice, Options, Queue, Song } from 'distube';
import dotenv from 'dotenv'
import fetch from 'node-fetch';
import { isElementAccessExpression } from 'typescript';
const { YtDlpPlugin } = require("@distube/yt-dlp")
const { SpotifyPlugin } = require("@distube/spotify");
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
//const distube = new DisTube(client, {searchSongs: 5, emitNewSongOnly: true, youtubeDL: false})
const distube = new DisTube(client, {searchSongs: 5, emitNewSongOnly: true, youtubeDL: false, plugins: [new YtDlpPlugin(), new SpotifyPlugin()] })
const guildID = '943285541561041017'
const guild = client.guilds.cache.get(guildID)
distube.options.youtubeDL = false
distube.options.leaveOnFinish = true




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

            if(split[0] === '!play' || split[0] === '!p'){
                var music = ""
                for(var x = 1; x < split.length; x++){
                    music += split[x]
                }
                if(music != ""){
                    play(message, music)
                }
                else{
                    message.channel.send(message.author.toString() + ' you need to enter the name of a song!')
                }
            }


            if(split[0] === '!stop'){
                stop(message)
            }
            if(split[0] === '!queue' || split [0] === '!q'){
                queue(message)
            }
            if(split[0] === '!skip'){
                skip(message)
            }
            if(split[0] === '!pause'){
                pause(message)
            }
            if(split[0] === '!resume'){
                resume(message)
            }
            if(split[0] === '!autoplay'){
                autoplay(message)
            }
            if(split[0] === '!filter'){
                if(split.length == 2){
                    filter(message, split[1])
                }
                else{
                    message.channel.send(message.author.toString() + ' invalid format')
                }
            }

            if(split[0] === '!foob'){
                foob(message)
            }

            if(split[0] === '!img'){
                if(split.length == 2){
                    imgGet(message, split[1])
                }
                else{
                    message.channel.send(message.author.toString() + ' invalid format')
                }
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
                bunger(message)
            }
        }

    }
})

async function play(message: any, music: any){
    try{
        inVoiceChannel: true
        var found = await distube.search(music);
        var length = found.length
        console.log(length)
        if(message.member && message.member.voice.channel){
            distube.play(message.member.voice?.channel, music, {
                member: message.member,
                textChannel: message.channel,
                message
            });
        }
        else{
            message.channel.send(message.author.toString() + ' you need to be in a voice channel to use this command >:(')
        }
    }
    catch(err){
        message.channel.send(message.author.toString() + ' no song found, try again!')
        //distube.on("searchNoResult", (message, query) => message.channel.send(`No result found for ${query}!`))
    }

}

async function imgGet(message: any, tag: any){
    if(tag == "list"){
        message.channel.send('**available tags:**\n'
                + '*IMAGE:*\n'
                + '`kitsune, '
                + 'neko, '
                + 'waifu.`\n'
                + '*GIF:*\n'
                + '`baka, '
                + 'bite, '
                + 'blush, '
                + 'bored, '
                + 'cry, '
                + 'cuddle, '
                + 'dance, '
                + 'facepalm, '
                + 'feed, '
                + 'happy, '
                + 'highfive, '
                + 'hug, '
                + 'kiss, '
                + 'laugh, '
                + 'pat, '
                + 'poke, '
                + 'pout, '
                + 'shrug, '
                + 'slap, '
                + 'sleep, '
                + 'smile, '
                + 'smug, '
                + 'stare, '
                + 'think, '
                + 'thumbsup, '
                + 'tickle, '
                + 'wave, '
                + 'wink.`'
            )
    }
    else{
        const response = await fetch('https://nekos.best/api/v2/' + tag)
        const data = await response.json()
        //console.log(data)
        //console.log(data.results[0].url)
        if(data.code == 404){
            message.channel.send(message.author.toString() + ' enter a valid tag please (try !img list)')
        }
        else{
            message.channel.send(data.results[0].url)
            if(tag == 'kitsune' || tag == 'neko' || tag == 'waifu'){
                message.channel.send('by ' + data.results[0].artist_name)
            }
        }
        
        
    }
}

async function filter(message: any, filter: any){
    if(message.member && message.member.voice.channel){
        var queue = distube.getQueue(message);
        if(filter == "list"){
            message.channel.send('**available filters:**\n'
                + '`3d\n'
                + 'bassboost\n'
                + 'echo\n'
                + 'karaoke\n'
                + 'nightcore\n'
                + 'vaporwave\n'
                + 'flanger\n'
                + 'gate\n'
                + 'haas\n'
                + 'reverse\n'
                + 'surround\n'
                + 'mcompand\n'
                + 'phaser\n'
                + 'tremolo\n'
                + 'earwax\n`'
                + '**warning: ** filters may cause your queue to crash and force you to requeue songs.'
            )
        }
        else{
            if(queue != undefined){
                try{
                    if(filter == "disable"){
                        distube.setFilter(queue, false)
                        message.channel.send("filters disabled");
                    }
                    else{
                        message.channel.send("Current queue filter: " + distube.setFilter(queue, filter));
                    }
                }
                catch(err){
                    message.channel.send(message.author.toString() + ' filter error ' + err)
                }
            }
            else{
                message.channel.send(message.author.toString() + ' nothing to filter :sob:')
            }
        }
    }
    else{
        message.channel.send(message.author.toString() + ' you need to be in a voice channel to use this command >:(')
    }
}

async function foob(message: any){
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

async function bunger(message: any){
    message.channel.send(message.author.toString() + ' here is a bunger for you :D')
                const response = await fetch('https://foodish-api.herokuapp.com/api/images/burger')
                const data = await response.json()
                //console.log(data);
                var image = data.image;
                //console.log(image)
                message.channel.send(image)
}
   
async function stop(message: any){
    if(message.member && message.member.voice.channel){
        if(distube.getQueue(message) != undefined){
            distube.stop(message)
            message.channel.send(message.author.toString() + ' has requested the song to stop')
        }
        else{
            message.channel.send(message.author.toString() + ' there is no music playing :c')
        }
    
    }
    else{
        message.channel.send(message.author.toString() + ' you need to be in a voice channel to use this command >:(')
    }
}

async function pause(message: any){
    if(message.member && message.member.voice.channel){
        var queue = distube.getQueue(message);
        if(queue != undefined){
            try{
                distube.pause(queue);
                message.channel.send(message.author.toString() + ' music paused :D')
            }
            catch(err){
                message.channel.send(message.author.toString() + ' the song is already paused!')
            }
        }
        else{
            message.channel.send(message.author.toString() + ' nothing to pause :c')
        }
    }
    else{
        message.channel.send(message.author.toString() + ' you need to be in a voice channel to use this command >:(')
    }
}

async function autoplay(message: any){
    if(message.member && message.member.voice.channel){
        var queue = distube.getQueue(message);
        if(queue != undefined){
            try{
                //distube.toggleAutoplay(queue);
                message.channel.send(message.author.toString() + ' autoplay set to ' + distube.toggleAutoplay(queue))
            }
            catch(err){
                message.channel.send(message.author.toString() + ' problem setting queue to autoplay + ' + err)
            }
        }
        else{
            message.channel.send(message.author.toString() + ' nothing to base autoplay off of')
        }
    }
    else{
        message.channel.send(message.author.toString() + ' you need to be in a voice channel to use this command >:(')
    }
}

async function resume(message: any){
    if(message.member && message.member.voice.channel){
        var queue = distube.getQueue(message);
        if(queue != undefined){
            try{
                distube.resume(queue);
                message.channel.send(message.author.toString() + ' music resumed :D')
            }
            catch(err){
                message.channel.send(message.author.toString() + ' the song is already resumed!')
            }
        }
        else{
            message.channel.send(message.author.toString() + ' nothing to resume D:')
        }
    }
    else{
        message.channel.send(message.author.toString() + ' you need to be in a voice channel to use this command >:(')
    }
}

async function skip(message: any){
    var queue = distube.getQueue(message)
    if(queue != undefined){
        if (!queue.autoplay && queue.songs.length <= 1){
            message.channel.send(message.author.toString() + ' there is no next song :(')
            return
        }
        distube.skip(message)
    }
}

async function queue(message: any){
    const queue = distube.getQueue(message)
    var qArr = new Array
    if(queue != undefined){

        message.channel.send(
            `current queue:\n${queue.songs
                .map(
                    (song, id) =>
                        `**${id ? id : 'Playing: '}** \`${
                            song.name
                        }\` - \`${song.formattedDuration}\``,
                )
                .slice(0, 11)
                .join('\n')}`,)
        
    }
    else{
        message.channel.send(message.author.toString() + ' there is no queue!')
    }
}


//distube.on("searchResult", (message, result) => printresult(message, result))
//distube.on("searchCancel", () => {})
//distube.on("searchInvalidAnswer", () => {})
//distube.on("searchDone", (message, answer, query) => {message.channel.send(query)})
//distube.on("playSong", (queue, song) => queue.textChannel?.send(`now playing song:  \`${song.name}\` - \`(${song.formattedDuration})\`\nrequested by: ${song.user}`))
//distube.on("addSong", (queue, song) => queue.textChannel?.send(`added song to queue:  \`${song.name}\` - \`(${song.formattedDuration})\`\nrequested by: ${song.user}`))
//distube.on("searchNoResult", (message, query) => message.channel.send(`No result found for ${query}!`))
//distube.on("error", (channel, error) => channel.send('there has been an error, please tr again'))

distube
    .on('playSong', (queue, song) =>
        queue.textChannel?.send(
            `playing \`${song.name}\` - \`${
                song.formattedDuration
            }\`\nrequested by: ${song.user}\n`,
        ),
    )
    .on('addSong', (queue, song) =>
        queue.textChannel?.send(
            `added \`${song.name}\` - \`${song.formattedDuration}\` to the queue by ${song.user}`,
        ),
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel?.send(
            `added \`${playlist.name}\` playlist (${
                playlist.songs.length
            } songs) to queue\n`,
        ),
    )
    .on('error', (textChannel, e) => {
        console.error(e)
        textChannel.send(
            `an error encountered: ${e.message.slice(0, 2000)}`,
        )
    })
    .on('finish', queue => queue.textChannel?.send(`no more songs`))
    .on('finishSong', queue =>
        queue.textChannel?.send(`song finished`),
    )
    .on('disconnect', queue =>
        queue.textChannel?.send(`disconnected!`),
    )
    .on('empty', queue =>
        queue.textChannel?.send(
            `the voice channel was empty :(`,
        ),
    )
    // DisTubeOptions.searchSongs > 1
    .on('searchResult', (message, result) => {
        let i = 0
        message.channel.send(
            `**choose an option from below**\n${result
                .map(
                    song =>
                        `**${++i}**. \`${song.name}\` - \`${
                            song.formattedDuration
                        }\``,
                )
                .join(
                    '\n',
                )}\n*enter a number from above or wait 30 seconds*`,
        )
    })
    .on('searchCancel', message =>
        message.channel.send('Searching canceled'),
    )
    .on('searchInvalidAnswer', message =>
        message.channel.send('that is not a valid option, please try again'),
    )
    .on('searchNoResult', message =>
        message.channel.send('no result found :c'),
    )
    .on('searchDone', () => {})




client.login(process.env.TOKEN)