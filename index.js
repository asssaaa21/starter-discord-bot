
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID 
const TOKEN = process.env.TOKEN 
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID 


const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');


const app = express();
// app.use(bodyParser.json());

const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Authorization",
	"Authorization": `Bot ${TOKEN}`
  }
});




app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name)
    if(interaction.data.name == 'yo'){
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    if(interaction.data.name == 'dm'){
      // https://discord.com/developers/docs/resources/user#create-dm
      let c = (await discord_api.post(`/users/@me/channels`,{
        recipient_id: interaction.member.user.id
      })).data
      try{
        // https://discord.com/developers/docs/resources/channel#create-message
        let res = await discord_api.post(`/channels/${c.id}/messages`,{
          content:'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
        })
        console.log(res.data)
      }catch(e){
        console.log(e)
      }

      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
          content:'👍'
        }
      });
    }
  }

});



app.get('/register_commands', async (req,res) =>{
  let slash_commands = [
    {
      "name": "yo",
      "description": "replies with Yo!",
      "options": []
    },
    {
      "name": "dm",
      "description": "sends user a DM",
      "options": []
    }
  ]
  try
  {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    let discord_response = await discord_api.put(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      slash_commands
    )
    console.log(discord_response.data)
    return res.send('commands have been registered')
  }catch(e){
    console.error(e.code)
    console.error(e.response?.data)
    return res.send(`${e.code} error from discord`)
  }
})


app.get('/', async (req,res) =>{
  return res.send('Follow documentation ')
})


app.listen(8999, () => {

})
//================================= // كود الانتنت
const Discord = require('discord.js');
const { EmbedBuilder, IntentsBitField,PermissionsBitField,ChannelType,StringSelectMenuBuilder, Collection , AttachmentBuilder , ActionRowBuilder, ButtonBuilder, 
ButtonStyle } = require('discord.js');
let voiceManager = new Collection();
const translate = require('@iamtraction/google-translate')
const colors = require('colors');
require('dotenv').config();
const client = new Discord.Client({
//intents:[
//Discord.IntentsBitField.Flags.GuildMessages,
//Discord.IntentsBitField.Flags.Guilds,
//Discord.IntentsBitField.Flags.GuildPresences,
//Discord.IntentsBitField.Flags.GuildMessageReactions,
//Discord.IntentsBitField.Flags.DirectMessages,
//Discord.IntentsBitField.Flags.MessageContent,
//Discord.IntentsBitField.Flags.GuildVoiceStates
//],partials: [
//Discord.Partials.Channel,
//Discord.Partials.Message,
//Discord.Partials.User,
//Discord.Partials.GuildMember,
//Discord.Partials.Reaction
  intents: 131071,
  partials: [
    1, 2, 5, 3,
    4, 6, 0
  ]
});

const flagsPermissions = new PermissionsBitField([
PermissionsBitField.Flags.ManageChannels,
PermissionsBitField.Flags.EmbedLinks,
PermissionsBitField.Flags.AttachFiles,
PermissionsBitField.Flags.ReadMessageHistory,
PermissionsBitField.Flags.ManageNicknames,
PermissionsBitField.Flags.ManageRoles,
PermissionsBitField.Flags.Administrator,
PermissionsBitField.Flags.BanMembers,
PermissionsBitField.Flags.KickMembers,
PermissionsBitField.Flags.SendMessages,
PermissionsBitField.Flags.ViewChannel,
PermissionsBitField.Flags.AddReactions,
PermissionsBitField.Flags.BanMembers,
PermissionsBitField.Flags.ChangeNickname,
PermissionsBitField.Flags.Connect,
PermissionsBitField.Flags.CreateInstantInvite,
PermissionsBitField.Flags.CreatePrivateThreads,
PermissionsBitField.Flags.CreatePublicThreads,
PermissionsBitField.Flags.DeafenMembers,
PermissionsBitField.Flags.ManageEmojisAndStickers,
PermissionsBitField.Flags.ManageEvents,
PermissionsBitField.Flags.ManageGuild,
PermissionsBitField.Flags.ManageMessages,
PermissionsBitField.Flags.ManageThreads,
PermissionsBitField.Flags.ManageWebhooks,
PermissionsBitField.Flags.MentionEveryone,
PermissionsBitField.Flags.ModerateMembers,
PermissionsBitField.Flags.MoveMembers,
PermissionsBitField.Flags.MuteMembers,
PermissionsBitField.Flags.PrioritySpeaker,
PermissionsBitField.Flags.ReadMessageHistory,
PermissionsBitField.Flags.RequestToSpeak,
PermissionsBitField.Flags.SendMessagesInThreads,
PermissionsBitField.Flags.SendTTSMessages,
PermissionsBitField.Flags.Speak,
PermissionsBitField.Flags.Stream,
PermissionsBitField.Flags.UseApplicationCommands,
PermissionsBitField.Flags.UseEmbeddedActivities,
PermissionsBitField.Flags.UseExternalEmojis,
PermissionsBitField.Flags.UseExternalStickers,
PermissionsBitField.Flags.UseVAD,
PermissionsBitField.Flags.ViewAuditLog,
PermissionsBitField.Flags.ViewGuildInsights,
]);
const config = require('./src/config/config.json')
client.config = require("./src/config/config.json")
require("./src/database/connect")();
var randomColor = Math.floor(Math.random()*16777215).toString(16);
client.setMaxListeners(9999999);
//================================= // كود ال ريدي فاكنكشن
let numGuilds = 0;
let numUsers = 0;

const chalk = require('chalk');

client.on('ready', () => {
  console.log(chalk.green.bold(`Logged in as ${client.user.tag}`));
  console.log(chalk.green(`Owner: ${client.application?.owner?.tag}`));

  const activities = [
    { name: `${client.guilds.cache.size} Servers`, type: Discord.ActivityType.Listening },
    { name: `${client.channels.cache.size} Channels`, type: Discord.ActivityType.Playing },
    { name: `${client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0).toLocaleString()} Users`, type: Discord.ActivityType.Watching },
  ];
  const status = [
    'online',
    'dnd',
    'idle'
  ];
  let i = 0;
  setInterval(() => {
    if (i >= activities.length) i = 0
    client.user.setActivity(activities[i])
    i++;
  }, 5000);

  let s = 0;
  setInterval(() => {
    if (s >= activities.length) s = 0
    client.user.setStatus(status[s])
    s++;
  }, 30000);

  numGuilds = client.guilds.cache.size;
  console.log(chalk.green.bold(`Joined ${numGuilds} guilds.`));

  let numUsers = 0;
  client.guilds.cache.forEach(guild => {
    numUsers += guild.memberCount;
  });
  console.log(chalk.green.bold(`Serving ${numUsers} users.`));
});

const RZ06instagram = "<:RZ06instagram:1102447883829121124>"; // Replace with the ID for the RZ06instagram emoji
const RZ05youtube = "<:RZ05youtube:1102448609347256361>"; // Replace with the ID for the RZ05youtube emoji
const RZ02tiktok = "<:RZ02tiktok:1102446279046471760>"; // Replace with the ID for the RZ02tiktok emoji

  const page1Button = new Discord.ButtonBuilder()
    .setCustomId('page1')
    .setLabel('TikTok')
    .setStyle(ButtonStyle.Primary)
    .setEmoji(RZ02tiktok);

  const page2Button = new Discord.ButtonBuilder()
    .setCustomId('page2')
    .setLabel('Youtube')
    .setStyle(ButtonStyle.Primary)
    .setEmoji(RZ05youtube);

  const page3Button = new Discord.ButtonBuilder()
    .setCustomId('page3')
    .setLabel('Instagram')
    .setStyle(ButtonStyle.Primary)
    .setEmoji(RZ06instagram);

let setupMessage;

client.on('messageCreate', async message => {
  if (!message.content.startsWith('!setup')) return;
  const channelId = '1102116585348538398';
  if (message.channel.id === channelId) {
    const row = new Discord.ActionRowBuilder().addComponents(page1Button, page2Button, page3Button);
   const embed = new Discord.EmbedBuilder()
     .setTitle('select a page test')
     .setDescription('test:')
     .setColor(randomColor)

    if (message.setupMessage) {
      await message.setupMessage.edit({ embeds: [embed], components: [row] });
    } else {
      message.setupMessage = await message.channel.send({ embeds: [embed], components: [row] });
    }
  }
});
client.on('interactionCreate', async interaction => {
  if (interaction.isButton() && ['page1', 'page2', 'page3'].includes(interaction.customId)) {
    const page = interaction.customId;
    let pageNumber, pageDescription, pageAuthor, pageFooter, pageTimestamp;

    switch (page) {
      case 'page1':
        //pageNumber = 1;
        pageAuthor = { name: interaction.message.guild.name, icon_url: interaction.message.guild.iconURL() };
        pageTitle = interaction.message.guild.name;
        pageDescription = '__**حياكم يوميا بثوث و فعاليات ببجي للمشاركة سوي متابعة لحسابي بالتيك توك **__';
        pageThumbnail = interaction.message.guild.iconURL();
        pageImage = 'https://i.ibb.co/kXVT5k2/5f896fd5459834cdaf9e79e22a31bdf5.jpg'
        pageFooter = { text: `${interaction.message.guild.name}`, iconURL: interaction.message.guild.iconURL(), };
            pageFields = [
    { name: '__**رابط قناتي التيكتوك الاساسيه:**__', value: 'https://www.tiktok.com/@saudpubg1' },
    { name: '__**رابط قناتي الثانيه:**__', value: 'https://www.tiktok.com/@saudpubg6' }
  ];
        pageTimestamp = new Date();
        break;
      case 'page2':
        //pageNumber = 2;
        pageAuthor = { name: interaction.message.guild.name, icon_url: interaction.message.guild.iconURL() };
        pageTitle = interaction.message.guild.name;
        pageDescription = '__**أخوكم سعود مختص بعالم التسريبـات**__\n__**محتوى القناه PUBG MOBILE بشكل عام**__\n__**اعشق الاخبار الحصريه والثغرات وتفتيح البكجات**__\n\n__**لدي 655 ألف مشترك باليوتيوب**__\n__**عدد مجموع مشاهداتي في اليوتيوب حاليا:\n52,830,528 مليون مشاهدة**__\n\n__**"فعل الخير حلو يا صديقي الصدوق"**__\n\n__**حياكم  قناتي باليوتيوب لتسريبات ببجي الحصرية**__\n__**اشترك بقناتي و فعل الجرس ليصلك كل جديد**__\n\n';
        pageThumbnail = interaction.message.guild.iconURL();
        pageFooter = { text: `${interaction.message.guild.name}`, iconURL: interaction.message.guild.iconURL(), };
        pageImage = 'https://probot.media/yYD5pBEpP3.jpg';
        pageFields = [
    { //name: '__**رابط قناتي اليوتيوب الاساسيه**__', value: '1' },
      name: '__**رابط قناتي اليوتيوب الاساسيه:**__', value: 'https://www.youtube.com/channel/UCNEIEZokIc6ZomCvGH1rVjA', inline: true }
  ];
        pageTimestamp = new Date();
        break;
      case 'page3':
        //pageNumber = 3;
        pageAuthor = { name: interaction.message.guild.name, icon_url: interaction.message.guild.iconURL() };
         pageTitle = interaction.message.guild.name;
        pageDescription = '__**حياكم علي حسابي بالانستقرام **__\n\n__**لمتابعة كل الاخبار و التسريبات الحصرية لببجي موبايل تابعوني عشان يوصلكم كل جديد**__\n\n__** كل يوم انزل استوريات حصرية وتسريبات لببجي موبايل في حسابي الاساسي**__\n\n';
        pageThumbnail = interaction.message.guild.iconURL();
        pageFooter = { text: `${interaction.message.guild.name}`, iconURL: interaction.message.guild.iconURL(), };
        pageImage = 'https://i.ibb.co/kXVT5k2/5f896fd5459834cdaf9e79e22a31bdf5.jpg';
        pageFields = [
     {
          name: '__**رابط حسابي الانستكرام الاساسي:**__', value: 'https://instagram.com/kk_pubg', inline: true }
  ];
        pageTimestamp = new Date();
        break;
      default:
        break;
    }

    const newEmbed = new Discord.EmbedBuilder()
      //.setTitle(pageTitle)
      .setDescription(pageDescription)
      .setColor(randomColor)
      .setImage(pageImage)
      .setThumbnail(pageThumbnail)
      .addFields(pageFields)
      .setAuthor(pageAuthor)
      .setFooter(pageFooter)
      .setTimestamp(pageTimestamp);

    const row = new Discord.ActionRowBuilder().addComponents(page1Button, page2Button, page3Button);

    await interaction.update({
      embeds: [newEmbed],
      components: [row]
    });
  }
});
//------------------------------------------------------------------------------------------------
const Rolesemoji = "<:rules:1108364200650219620>"; // Replace with the ID for the RZ06instagram emoji
const Forbiddenwords = "<:RZ05youtube:1102448609347256361>"; // Replace with the ID for the RZ05youtube emoji


  const page11Button = new Discord.ButtonBuilder()
    .setCustomId('page11')
    .setLabel('قوانين السيرفر')
    .setStyle(ButtonStyle.Danger)
    .setEmoji(Rolesemoji);

  const page12Button = new Discord.ButtonBuilder()
    .setCustomId('page12')
    .setLabel('الكلمات الممنوعة')
    .setStyle(ButtonStyle.Success)
    .setEmoji('🚫');

    let setupMessage1;
client.on('messageCreate', async message => {
  if (!message.content.startsWith('!setup1')) return;
  const channelId = '1106425636223983626';
  if (message.channel.id === channelId) {
    const row = new Discord.ActionRowBuilder().addComponents(page11Button, page12Button);
   const embed = new Discord.EmbedBuilder()
     .setTitle('select a page1 test')
     .setDescription('test:')
     .setColor(randomColor)

    if (message.setupMessage1) {
      await message.setupMessage1.edit({ embeds: [embed], components: [row] });
    } else {
      message.setupMessage1 = await message.channel.send({ embeds: [embed], components: [row] });
    }
  }
});
client.on('interactionCreate', async interaction1 => {
  if (interaction1.isButton() && ['page11', 'page12'].includes(interaction1.customId)) {
    const page1 = interaction1.customId;
    let pageNumber1, page1Description, page1Author, page1Footer, page1Timestamp;
    switch (page1) {
      case 'page11':
        //pageNumber1 = 1;
        page1Author = { name: interaction1.message.guild.name, icon_url: interaction1.message.guild.iconURL() };
        page1Title = interaction1.message.guild.name;
        page1Description = '__**قوانين  السيرفر **__';
        page1Thumbnail = interaction1.message.guild.iconURL();
        page1Image = 'https://i.ibb.co/4Wk1hJ8/image.png'
        page1Footer = { text: `${interaction1.message.guild.name}`, iconURL: interaction1.message.guild.iconURL(), };
        page1Fields = [
          { name: '`1- عدم أثارة المشاكل بالسيرفر او عالخاص`', value: '\n' },
          { name: '`2- احترم خصوصية الآخرين وعدم احراجهم`', value: '\n' },
          { name: '`3- مراعاة نظام كل روم و سياسته وقوانينه`', value: '\n' },
          { name: '`4- ممنوع السبام أو إرسال بكثرة بوقت قصير`', value: '\n' },
          { name: '`5- ممنوع طلب المال - بطاقات الستور - الألعاب`', value: '\n' },
          { name: '`6- يمنع دخول السيرفر بالأسماء والصور الغير لائقة`', value: '\n' },
          { name: '`7- يمنع نشر الروابط مثل السيرفرات , المقاطع , التويتش `', value: '\n' },
          { name: '`8- احترم جميع الموجودين في السيرفر احترم المشرفين`', value: '\n' },
          { name: '`9- في حاله وجود مشكله كلم أي شخص من الإدارة او المشرفين`', value: '\n' },
          { name: '`10- في حاله نشر أي سيرفر اخر في الخاص يرجى تبليغ الإدارة او المشرفين`', value: '\n' },
          { name: '`11- يمنع استخدام برامج تغير الصوت الا في حاله موافقه من المشرفين او الإدارة`', value: '\n' },
          { name: '`12- ممنوع التكلم عن الأمور التالية : السياسة .الدين .القبائل . الهاك . الحسابات المخترقة`', value: '\n' },
          { name: '`13- في حاله وجود خلاف او انتهاك للقوانين من قبل احد المشرفين يرجى ابلاغ الإدارة`', value: '\n' },
          { name: '`14- ممنوع ارسال صور عادية او متحركة في الشات العام ابدا`', value: '\n' },
          { name: '`15- ممنوع التحدث بطائفية`', value: '\n' },
          { name: '`16- ممنوع اضافة صورة بنت في ملفك الشخصي وانت ولد`', value: '\n' },
          { name: '`17- ممنوع عمل تاق لاسم العضو بدون سبب`', value: '\n' },
          { name: '`18- ممنوع استخدام كلمة "ابلع" الا الاداره العامه`', value: '\n' },
          { name: '`19- ممنوع طلب الدجاج في لعبة PUBGMOBILE ولا يتم عقابه أسبوع`', value: '\n' },
          { name: '`20- ممنوع الزحف بشكل علني وإلا يتعرض للعقاب من ٣ ايام لغاية الباند`', value: '\n' },
          { name: '`21- ممنوع إرسال إيموجي بدون رساله مصحوب مع الايموجي في الشات العام والا يعرض صاحبه للعقوبات التاليه : انذار اول > انذار ثاني > باند 24 ساعه`', value: '\n' },
      ];
        page1Timestamp = new Date();
        break;
        case 'page12':
          //pageNumber1 = 2;
          page1Author = { name: interaction1.message.guild.name, icon_url: interaction1.message.guild.iconURL() };
          page1Title = interaction1.message.guild.name;
          page1Description = '__**هنا شرح للكلامات الممنوعه في سيرفرنا لتجنب الميوت .. وعقاب الإداره **__\n';
          page1Thumbnail = interaction1.message.guild.iconURL();
          page1Footer = { text: `${interaction1.message.guild.name}`, iconURL: interaction1.message.guild.iconURL(), };
          page1Image = 'https://i.ibb.co/br2YWrF/forbiddenwords.png';
          page1Fields = [
            { name: '__**1- اولا .. :-**__', value: '\n' },
            { name: '`الكلامات الممنوعه (اختك - امك - ابن - خالتك - ابلع )`', value: '\n' },
            { name: '__**2- ثانيا .. :-**__', value: '\n' },
            { name: '`الكلامات السيئه بدون قصد هاي تبلع عليها ميوت متل ..`', value: '\n' }, 
            { name: '`ايامك (لإن تنتهي بكلمه امك البوت رح يحاسبك عليها ويعطيك ميوت ) ايامك - دامك - كلامك الخ....`', value: '\n' },
            { name: '__**3- ثالثا .. :-**__', value: '\n' },
            { name: '`في حال اخذت ميوت روح لشبابنا الاداره روح خاص او اصعد صوت ونفك عنك `', value: '\n' },
            { name: '__**4- رابعا .. :-**__', value: '\n' },
            { name: '`اذا اجاك تحذير من البوت في الخاص ما يضرك ولا شئ بس يقلك انو كتبت شئ ممنوع .. `', value: '\n' },
          ];
          page1Timestamp = new Date();
          break;
        default:
        }
        
        const formattedFields = page1Fields.map(field => {
          const lines = field.value.trim().split('\n');
          const formattedLines = lines.map((line, index) => {
            if (index === 0) {
              return line;
            }
            return ` ${line.trim()}`;
          });
          const formattedValue = formattedLines.join('\n');
          return {
            name: field.name,
            value: '\n' + formattedValue + '\n'
          };
        });
        
        const newEmbed = new Discord.EmbedBuilder()
          //.setTitle(pageTitle)
          .setDescription(page1Description)
          .setColor(randomColor)
          .setImage(page1Image)
          .setThumbnail(page1Thumbnail)
          .setAuthor(page1Author)
          .setFooter(page1Footer)
          .setTimestamp(page1Timestamp)
          .addFields(formattedFields);
        
        const row = new Discord.ActionRowBuilder().addComponents(page11Button, page12Button);
        
        await interaction1.update({
          embeds: [newEmbed],
          components: [row]
        });
  }
});
client.on("messageCreate", async(message) => {
  if (!message.guild || message.author.bot || message.content !== 'ping') return;

  const args = message.content.split(/ +/);
  if (args.length > 2) return;

  const command = args[0];
  if (command !== 'ping') return;

  const msg = Date.now() - message.createdTimestamp; 
  const api = Math.round(client.ws.ping);
  let states = "🟢 Excellent"; 
  let states2 = "🟢 Excellent";
  if (Number(msg) > 70) states = "🟢 Good"; 
  if (Number(msg) > 170) states = "🟡 Not Bad";
  if (Number(msg) > 350) states = "🔴 Soo Bad";
  if (Number(api) > 70) states2 = "🟢 Good";
  if (Number(api) > 170) states2 = "🟡 Not Bad"; 
  if (Number(api) > 350) states2 = "🔴 Soo Bad";

  const embed = new Discord.EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
    .addFields(
      { name: "**Time Taken:**", value: `${msg} ms 📶 | ${states}`, inline: true },
      { name: "**WebSocket:**", value: `${api} ms 📶 | ${states2}`, inline: true }
    )
    .setColor(randomColor)
.setThumbnail(message.guild.iconURL())
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
.setTimestamp();
  
  
  message.channel.send({ embeds: [embed] }).catch((err) => { return; }); 
});


client.on("messageCreate", (message) => {
  if (!message.guild || message.author.bot || message.content !== 'bot') return;

  const args = message.content.split(/ +/);
  if (args.length > 2) return;

  const command = args[0];
  if (command !== 'bot') return;
   
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 3600000) % 24;
    const minutes = Math.floor(client.uptime / 60000) % 60;
    
    const seconds = Math.floor(client.uptime / 1000) % 60;
    const embed = new Discord.EmbedBuilder()
      .setThumbnail(client.user.avatarURL({ format: 'png' }))
      .setColor(randomColor)
      .addFields(
        {name: "🤖 __**Bot Name**__", value: `__**${client.user.username}**__`, inline: true},
        {name: "🆔 __**Bot ID**__", value: `__**${client.user.id}**__`, inline: true},
        {name: "🧙‍♂️ __**Bot Dev**__", value: `[, 𝑹𝑨𝑴𝒀 ❥](https://discord.com/users/350709706764976129)`, inline: true},
        {name: "📶 __**My Ping**__", value: `\`${Math.round(client.ws.ping)}ms\``, inline: true},
        {name: "📒 __**Library**__", value: `__**Discord.js**__`, inline: true},
        {name: "🌐 __**Version**__", value: `__**V14.8.0**__`, inline: true},
        {name: "🚀 __**Uptime**__", value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true}
        )
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
.setTimestamp()
    message.channel.send({ embeds: [embed] }).catch((err) => { return; });
  });

const moment = require('moment');
client.on("messageCreate", (message) => {
  if (!message.guild || message.author.bot || message.content !== 'user') return;

  const args = message.content.split(/ +/);
  if (args.length > 2) return;

  const command = args[0];
  if (command !== 'user') return;

  var userr = message.mentions.users.first() || message.author;
  var memberr = message.mentions.members.first() || message.member;
  let userinfo = userr.displayAvatarURL({ size: 2048, dynamic: true });
  var ff = userr.bot ? "true" : "false"; // refactor this to a ternary operator

  var embed = new Discord.EmbedBuilder()
    .setColor(randomColor)
    .setTitle("__**✅INFO User:**__")
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
    .setThumbnail(userinfo)
    .addFields(
      { name: "__**✏️ UserName:**__", value: `**${userr.username}**__`, inline: true },
      { name: "#️⃣ Tag:", value: `__**${userr.discriminator}**__`, inline: true },
      { name: "__**🆔 Id:**__", value: `__**${userr.id}**__`, inline: true },
      { name: `__**🤖 User Type**__`, value: `__**${ff}**__`, inline: true },
      { name: `__**📆 Joind Discord**__`, value: `\`${moment(userr.createdAt).format('YYYY/M/D')} ${moment(userr.createdAt).format('LTS')}\`\n**${moment(userr.createdAt, "YYYYMMDD").fromNow()}**`, inline: false },
      { name: `__**📆 Joined Server**__`, value: `\`${moment(memberr.joinedAt).format('YYYY/M/D')} ${moment(memberr.joinedAt).format('LTS')}\`\n**${moment(memberr.joinedAt, "YYYYMMDD").fromNow()}**`, inline: false }
    )
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
    .setTimestamp();

  message.channel.send({ embeds: [embed] }).catch((err) => { return; });
});

client.on("messageCreate", (message) => {
  if (!message.guild || message.author.bot || message.content !== 'uptime') return;

  const args = message.content.split(/ +/);
  if (args.length > 2) return;

  const command = args[0];
  if (command !== 'uptime') return;
  const now = new Date();
  const readyAt = client.readyAt || now;
  const uptime = now.getTime() - readyAt.getTime();
  const days = Math.floor(uptime / 1000 / 60 / 60 / 24);
  const hours = Math.floor(uptime / 1000 / 60 / 60) % 24;
  const minutes = Math.floor(uptime / 1000 / 60) % 60;
  const seconds = Math.floor(uptime / 1000) % 60;
  const ping = client.ws.ping;

  const embed = new EmbedBuilder()
  .setTitle('__**🤖 وقت تشغيل البوت**__')
  .setDescription(`__**${client.user.username}**__ قد بدأ تشغيله لمدة __**${days}**__ أيام، __**${hours}**__ ساعات، __**${minutes}**__ دقائق، و __**${seconds}**__ ثواني. 🚀\n\n__**البنق:**__ \`${ping}ms\``)
  .setColor(randomColor)
  .setThumbnail(client.user.avatarURL({ format: 'png' }))
  .addFields(
    { name: '__**💾 قاعدة البيانات:**__', value: `البوت متصل بقاعدة بيانات __**MongoDB**__ تعمل على __**KSP**__.`, inline: true },
    { name: '__**📈 استخدام الذاكرة:**__', value: `__**${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB / ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB**__`, inline: true },
    { name: '__**💻 استخدام المعالج:**__', value: `__**${Math.round(process.cpuUsage().user / 1000) / 10}%**__`, inline: true },
)
.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
.setTimestamp();

  message.channel.send({ embeds: [embed] }).catch((err) => { return; });
  });




client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        const pongMessage = `Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms. Bot's latency is ${Math.round(client.ws.ping)}ms.`;
        await interaction.reply(pongMessage);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'botinfo') {
        const botInfoMessage = `Bot Name: ${client.user.username}\nBot ID: ${client.user.id}\nCreated At: ${client.user.createdAt}`;
        await interaction.reply(botInfoMessage);
    }
});




const channeChat = "<#572800136623947809>";
const channeRoles = "<#1106425636223983626>";
const ournews = "<#758387151413968916>";
const peoplerole = "<#1102795121247920128>";
const countryrole = "<#1094834552708530287>";
const colorsrole = "<#1095222816250548284>";
const chooserole = "<#1102795087160811560>";
const rankrole = "<#679908482186608671>";
const cmdrole = "<#680423398362578967>";
const pookerrole = "<#679908722050596942>";
const pubgnews = "<#814075465315909682>";
const mychannelssaudsocial = "<#1102116585348538398>";
const giveaways = "<#1088026618297057291>";
const askmeanything = "<#1087580085214777465>";
const rolesroom = "<#809723620011671572>";
const musicroom = "<#792780396273860608>";
const photoroom = "<#679908546682683439>"




let mapImage = "https://probot.media/3eZoZwUGm5.png"
client.on('messageCreate', async message => {
  if (message.content === '!server-map') {
    const args = message.content.split(/ +/);
  // Check if there are additional words
  if (args.length > 2) return;
    const embed = new EmbedBuilder()
.setThumbnail(message.guild.iconURL({ dynamic: true }))
.setColor(randomColor)
.setImage(`${mapImage}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
.setTimestamp()
      .addFields(
        { name: '**✮ الشـات :-** ' + channeChat, value:`\`\`\` هو عبـاره عن شـات للـتواصل و الدردشه
 \`\`\``},
        { name: '\u00A0', value: '\u00A0' },
      { name: '**✮ الـقوانيــن :-** ' + channeRoles, value:`\`\`\`قوانـين السيرفر لتجنـب الميوت و الباندات  والعقابـات \`\`\``},
      { name: '\u00A0', value: '\u00A0' },
 //     { name: '✮تعلم الديسكورد', value: 'تعلم كيف تستعمل الديسكورد بشكل صحيح' },
 //     { name: '\u00A0', value: '\u00A0' },
        { name: '**✮ أخبــارنا :-** ' + ournews, value:`\`\`\`كل جديد أو تحديث يجري بالسيرفر \`\`\``},
  { name: '\u00A0', value: '\u00A0' },
        { name: '**✮ قنواتي :-** ' + mychannelssaudsocial, value:`\`\`\`عـرض  جميع قنواتي في السوشال ميديا على منصات اليوتيوب,التيك توك,انستكرام \`\`\``},
 { name: '\u00A0', value: '\u00A0' },
      { name: '**✮ نيـوز ببجي :-** ' + pubgnews, value:`\`\`\`كـل ماهو جديد وحصري على لعبـه ببجي موبايل من تسريبات  واحداث حصريه \`\`\``},
{ name: '\u00A0', value: '\u00A0' },
  //    { name: '✮ نيـوز قيم', value: 'نشـر آخر الاخبـار على جميـع الالعاب' },
        { name: '**✮ مواعيدنا  :-** ' + giveaways, value:`\`\`\`مواعيد الفعاليـات وتوزيع الكردت ، اعياد الميـلاد، الخ،،، \`\`\``},
{ name: '\u00A0', value: '\u00A0' },
      { name: '**✮  شات بوت الاصطناعي :-** ' + askmeanything, value:`\`\`\`هو عباره عن بوت تسائله اي شي يرد عليك بي كل شي, تقدر حتى تستخدم لغه ثانيه, تقدر ايضا تستخدم الترجمه لو مافهمت عليه \`\`\``},
      { name: '\u00A0', value: '\u00A0' },
        { name: '**✮  شات الميوزك :-** ' + musicroom, value:`\`\`\`شات مخصص فقط لي الميوزك بي استعمال بوتات السيرفر \`\`\``},
      { name: '\u00A0', value: '\u00A0' },
        { name: '**✮ أوامــر البـوت :-** ' + cmdrole, value:`\`\`\`شـات مخصص فقــط لأوامر البوت \`\`\``},
        { name: '\u00A0', value: '\u00A0' },
        { name: '**✮  القمــار :-** ' + pookerrole, value:`\`\`\`غرفه مخصصـه للعبه البوكـر \`\`\``},
       { name: '\u00A0', value: '\u00A0' },
      { name: '**✮  رتب السيرفر :-** ' + rankrole, value:`\`\`\`رتب السيرفر التفاعليه كامله من خلالها تستطيع ان تصبغ رتبتك \`\`\``},
      { name: '\u00A0', value: '\u00A0' },
     { name: '**✮  غرف رتب اليدويه :-** ', value: peoplerole + "," + countryrole + "," + colorsrole + "," + chooserole + `\`\`\`الغرف هذي تقدر تاخذ منها رتبه يدويه, البوت راح يعطيك اي رتبه يدوي بس انت تختار الي تريده مفضل ليك \`\`\``},
      );
    
    const channel = client.channels.cache.get('1106425561498255430');
    channel.send({ embeds: [embed] });
  }
});


















//--------------------------------------------------------------------------------
const mongoose = require('mongoose');
const connect = require('./src/database/connect')();

const Canvas = require('@napi-rs/canvas');
var { inviteTracker } = require("discord-inviter"),
    
tracker = new inviteTracker(client);
tracker.on('guildMemberAdd', async (member,inviter) => {
  console.log(`1`)
  let Channel = member.guild.channels.cache.find(Channel => Channel.id === '572800136623947809') // ايدي الروم ترحيب
  if(!Channel) return;
  //https://media.discordapp.net/attachments/1106695466575462400/1106753888062799932/4.png?width=384&height=468
 // https://cdn.discordapp.com/attachments/1090436879293349948/1102103331280793660/4.png?width=384&height=468
  const background = await Canvas.loadImage('https://ik.imagekit.io/5nrwyo3ofo/4.png');
const canvas = Canvas.createCanvas(background.width, background.height);
const context = canvas.getContext('2d');
context.drawImage(background, 0, 0, canvas.width, canvas.height);
const avatar = await Canvas.loadImage(member.user.displayAvatarURL({size:1024}));
const canvas1 = Canvas.createCanvas(512, 512);
const ctx = canvas1.getContext('2d')
ctx.beginPath();
ctx.arc(255, 255, 255, 0, Math.PI * 2);
ctx.clip();
await ctx.drawImage(avatar, 0, 0, canvas1.width, canvas1.height)
let circle = canvas1.encodeSync('png')
if (circle) {circle = await Canvas.loadImage(circle)
             context.drawImage(circle, 183.5, canvas.height / 2 - -45, 135, 135)
  // context.drawImage(circle, 183, canvas.height / 2 - -43, 130, 130)
             //context.drawImage(circle, 138, canvas.height / 2 - -35, 100, 100)
  //context.drawImage(circle, 178, canvas.height / 2 - -39, 138, 135)
}
const rulesroomforwelcome = "<#1106425636223983626>"
//const emoji200 = "<a:793998960443392091:1102844378130698240>"
//const emoji201 = "<a:yagpdb:1102844360678191144>"

const attachment = new AttachmentBuilder(await canvas.encode('png'), 'welcome.png' );
Channel.send({files: [attachment]}).then((msg) => {
  msg.channel.send({
    content: `
    __** آهہ‏‏لآ وسـهہ‏‏لآ نورتنآ **__ ${emoji105}
     __**${rulesroomforwelcome} :اقرأ القوانين قبل كل شي حتى لا يقع عليك عقاب او باند من السيرفر**__ ${emoji105}
    __**${emoji105} حٍيآڪم منوُرٍين سيرٍفُرٍنآ**__

__**${member.guild.name}**__
__**By :**__ ${inviter} ${emoji105}
__**Hi :**__ ${member}
__**You :**__ **__${member.guild.memberCount}__** ${emoji105}
`,
  })})})
















client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith('$tax')) return;

  let priceStr = message.content.split(' ')[1];
  let price = parsePrice(priceStr);

  if (!price) {
    message.channel.send('Invalid price format. Please provide a valid format such as 123, 123K, 123M, 123.45M, 123B, etc.');
    return;
  }

  // Define the tax rate
  const taxRate = 0.025;

  // Calculate the tax and price with tax for 1 and 2 taxes
  const taxAmount = price * taxRate;
  const priceWithOneTax = price + taxAmount;
  const priceWithTwoTaxes = priceWithOneTax + taxAmount;

  // Create the message embed
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('ProBot Taxes')
    .setDescription(`
    ProBot Taxes For : ${formatPrice(price)}
    :moneybag: ${taxRate * 100}% Tax :
    ${formatPrice(taxAmount)}
    :moneybag: Price ( 1 Tax ) :
    ${formatPrice(priceWithOneTax)} (${formatPrice(taxAmount)})
    :moneybag: Price ( 2 Taxes ) :
    ${formatPrice(priceWithTwoTaxes)}
    :moneybag: Price ( 1 Tax ) + ${taxRate * 100}% :
    ${formatPrice(priceWithOneTax * (1 + taxRate))} 
    :moneybag: Price ( 2 Taxes ) + ${taxRate * 100}% :
    ${formatPrice(priceWithTwoTaxes * (1 + taxRate))}`)
    .setThumbnail(message.guild.iconURL())
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

  // Send the message to the channel or user
  message.channel.send({ embeds: [embed] });
});

function formatPrice(num) {
  return num.toLocaleString('en-US');
}

function parsePrice(str) {
  if (!str || str === '') {
    return null;
  }

  let num = str.replace(/,/g, '').replace(/\$/g, '');

  if (num.match(/^\d+$/)) {
    return parseInt(num, 10);
  } else if (num.match(/^\d+(\.\d+)?[kK]$/)) {
    return parseFloat(num) * 1000;
  } else if (num.match(/^\d+(\.\d+)?[mM]$/)) {
    return parseFloat(num) * 1000000;
  } else if (num.match(/^\d+(\.\d+)?[bB]$/)) {
    return parseFloat(num) * 1000000000;
  } else if (num.match(/^\d+(\.\d+)?([kKmMbB])$/)) {
    let factor = 1;
    switch (num.slice(-1)) {
      case 'k':
      case 'K':
        factor = 1000;
        break;
      case 'm':
      case 'M':
        factor = 1000000;
        break;
      case 'b':
      case 'B':
        factor = 1000000000;
        break;
      default:
        return null; // return null if the letter doesn't match k, m, or b
    }
    return parseFloat(num) * factor;
  } else if (num.match(/^\d{1,3}(,\d{3})*(\.\d+)?$/)) {
    return parseFloat(num.replace(/,/g, ''));
  } else {
    return null;
  }
}
const tax = require('probot-taxs');
client.on("messageCreate", message => {
  if (message.content.startsWith("$tax1")) {
    let amount = message.content.split(" ").slice(1).join(" ");
    if (!amount) return message.channel.send("**amount cant be empty**")

    let taxs = tax.tax(amount, true) 
    if(!taxs)return 

    var embed = new EmbedBuilder()
       .setTitle(`${message.guild.name}  Tax 📑`)
       .setDescription(`**ProBot Taxes For: ${(parseInt(amount))}** 
      > 2.5% Tax: **${(2.5/100 * parseInt(amount))}** 
      > Price (1 Tax): **${taxs.tax}** 
      > Price (2 Taxes): **${taxs.wasit}** 
      > Price (1 Tax) + 2.5%: **${(2.5/100 * parseInt(amount))+taxs.tax}**
      > Price (2 Taxes) + 2.5%: **${(2.5/100 * parseInt(amount))+taxs.wasit}**`)
       .setColor("#f70e00")
           .setTimestamp()
    .setThumbnail(message.guild.iconURL())
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

  message.channel.send({ embeds: [embed] });
}});

const logChannelId = '1101127160749637753';

client.on('auditLogs', async (logs) => {
  const logChannel = await client.channels.fetch(logChannelId);
  const roleChanges = logs.entries.filter(entry => entry.action === 'MEMBER_ROLE_UPDATE');
  for (const roleChange of roleChanges) {
    const { id, guild, executor } = roleChange;

    // Get the member who had their role updated
    const member = await guild.members.fetch(id);

    // Check if the role was added or removed by an autorole
    const isAutorole = executor === null;

    // Get the roles before and after the update
    const beforeRoles = roleChange.changes[0].old;
    const afterRoles = roleChange.changes[0].new;

    // Find the role that was added
    const addedRoles = afterRoles.filter(role => !beforeRoles.includes(role));
    if (addedRoles.length > 0) {
      const addedRole = addedRoles[0];
      const logMessage = `${member.user.tag} was given the role '${addedRole.name}' ${isAutorole ? 'by an autorole' : `by ${executor.tag}`}`;
      try {
        await logChannel.send(logMessage);
        console.log(`Message sent to ${logChannel.name}: ${logMessage}`);
      } catch (error) {
        console.error(`Error sending message to channel ${logChannel.name}: ${error}`);
      }
    }

    // Find the role that was removed
    const removedRoles = beforeRoles.filter(role => !afterRoles.includes(role));
    if (removedRoles.length > 0) {
      const removedRole = removedRoles[0];
      const logMessage = `${member.user.tag} had the role '${removedRole.name}' removed ${isAutorole ? 'by an autorole' : `by ${executor.tag}`}`;
      try {
        await logChannel.send(logMessage);
        console.log(`Message sent to ${logChannel.name}: ${logMessage}`);
      } catch (error) {
        console.error(`Error sending message to channel ${logChannel.name}: ${error}`);
      }
    }
  }
});


//--------------------------------------------------------------------------------
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase().startsWith('مسح1')) {
    const args = message.content.split(/ +/);
  // Check if there are additional words
  if (args.length > 2) return;
    const amount = parseInt(message.content.split(' ')[1]);
    if (isNaN(amount)) {
      const errorEmbed = new EmbedBuilder()
        .setColor(randomColor)
        .setDescription('__**Please provide a valid amount of messages to delete.**__');

      return message.channel.send({ embeds: [errorEmbed], ephemeral: true });
    } else if (amount > 99) {
      const errorEmbed = new EmbedBuilder()
        .setColor(randomColor)
        .setDescription('__**You cannot delete more than 99 messages at once.**__');

      return message.channel.send({ embeds: [errorEmbed], ephemeral: true });
    }

        const target = message.mentions.users.first();

    const messages = await message.channel.messages.fetch({ limit: amount + 1 });
    const filtered = target ? messages.filter((msg) => msg.author.id === target.id) : messages;

    const ids = filtered.filter((msg) => !msg.pinned).map((msg) => msg.id);

    const loadingEmbed = new EmbedBuilder()
      .setColor(randomColor)
      .setDescription(`__**Deleting ${ids.length} messages...**__`);
    const loadingMessage = await message.channel.send({ embeds: [loadingEmbed], ephemeral: true });

    setTimeout(async () => {
      try {
        await message.channel.bulkDelete(ids, true);

        const successEmbed = new EmbedBuilder()
          .setColor(randomColor)
          .setDescription(`__**تم مسح ${ids.length} رسالة ${target ? '__**مرسلة بواسطة **__' + target.username : ''}.**__`);
        const successMessage = await loadingMessage.edit({ embeds: [successEmbed] });

        setTimeout(async () => {
  const deletedMessage = await successMessage.edit(`__**${ids.length} messages have been deleted.**__`);
  await deletedMessage.delete();
}, 3000);
      } catch (error) {
        console.error(error);

        const errorEmbed = new EmbedBuilder()
          .setColor(randomColor)
          .setDescription('__**An error occurred while trying to delete messages.**__');
        await loadingMessage.edit({ embeds: [errorEmbed] });
      }
    }, 3000);
  }
});





//-------------------------------------------------------------------- this is for Select Menu for Colors to the Member
const fs = require('fs');
client.setMaxListeners(20);
const emoji30= "<:1_:1095499768660242503>"; 
const emoji31 = "<:2_:1095499770593812601>";
const emoji32= "<:3_:1095499771822743623>";
const emoji33 = "<:4_:1095499773219455128>";
const emoji34 = "<:5_:1095499775249490002>";
const emoji35 = "<:6_:1095499776587485346>";
const emoji36 = "<:7_:1095499777799630940>";
const emoji37 = "<:8_:1095499780316201012>";
const emoji38 = "<:9_:1095499781578694676>";
const emoji39 = "<:10:1095499782727925791>";
const emoji40 = "<:11:1095500042095296703>";
const emoji41 = "<:12:1095500043538153482>";
const emoji42 = "<:13:1095500393120792646>";
const emoji43 = "<:14:1095500394634936352>";
const emoji44 = "<:15:1095500396052611124>";
const emoji45 = "<:16:1095500397390602280>";
const emoji46 = "<:17:1095500399328374824>";
const emoji47 = "<:18:1095500477891874906>";
const emoji48 = "<:19:1095500480580423800>";
const emoji49 = "<:20:1095500482287521874>";

const roles = [
{ name: '1', roleId: '1091664605102755851', emoji: `${emoji30}` },
{ name: '2', roleId: '1091664709637373992', emoji: `${emoji31}` },
{ name: '3', roleId: '1091664771587248230', emoji: `${emoji32}` },
{ name: '4', roleId: '1091664838436073512', emoji: `${emoji33}` },
{ name: '5', roleId: '1091664941112635422', emoji: `${emoji34}` },
{ name: '6', roleId: '1091665036247846973', emoji: `${emoji35}` },
{ name: '7', roleId: '1091665093273591851', emoji: `${emoji36}` },
{ name: '8', roleId: '1091665156536291400', emoji: `${emoji37}` },
{ name: '9', roleId: '1091665232507719781', emoji: `${emoji38}` },
{ name: '10', roleId: '1091665296529559553', emoji: `${emoji39}` },
{ name: '11', roleId: '1091665365379059832', emoji: `${emoji40}` },
{ name: '12', roleId: '1091665423667318835', emoji: `${emoji41}` },
{ name: '13', roleId: '1091665519985315840', emoji: `${emoji42}` },
{ name: '14', roleId: '1091665669398994985', emoji: `${emoji43}` },
{ name: '15', roleId: '1091665754342051842', emoji: `${emoji44}` },
{ name: '16', roleId: '1091665873904881764', emoji: `${emoji45}` },
{ name: '17', roleId: '1091666215317020754', emoji: `${emoji46}` },
{ name: '18', roleId: '1091666379876356156', emoji: `${emoji47}` },
{ name: '19', roleId: '1091666466337738842', emoji: `${emoji48}` },
{ name: '20', roleId: '1091666737499492432', emoji: `${emoji49}` },
];

let channel;
let messageEdited = false;

client.on('ready', async (message) => {
    // Get the server and channel objects
    const guild = await client.guilds.fetch('572800136132952065');
    channel = guild.channels.cache.get('1095222816250548284');

    // Check if the message already exists in the channel
    const messages = await channel.messages.fetch();
    const oldMessage = messages.find(m => m.author.id === client.user.id && m.embeds.length > 0 && m.embeds[0].title === '__**اختر لونك المفضل**__');

    if (oldMessage && !messageEdited) {
        console.log(`Found old message with ID ${oldMessage.id}`);
        const components = oldMessage.components;
        const roleSelect = components[0].components[0];
        roleSelect.options = roles.map(role => ({ label: `${role.emoji} **${role.name}**`, value: role.name }));

        const colorimage = "https://media.tenor.com/NPR5w7x9CpUAAAAd/discord-colour-roles.gif";
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const updatedEmbed = new Discord.EmbedBuilder()
            .setColor(randomColor)
            .setTitle('__**اختر لونك المفضل**__')
            .setDescription(':paintbrush: __**من هنا تقدر تختار لونك المفضل، فقط اضغط على القائمة واختر اللون الذي تريده**__ :paintbrush:')
            .setImage(colorimage)
            .addFields(
                { name: '__**الألوان المتاحة**__', value: roles.map(role => `${role.emoji} **${role.name}**`).join('\n') },
                { name: ':warning: __**تحذير:**__', value: '__**كل شخص ليه حق يختار فقط لون واحد فقط، في حالة اختيار أكثر من لون واحد يرجى الإبلاغ عن ذلك.**__' }
            )
            .setFooter({ text: channel.guild.name, iconURL: channel.guild.iconURL() })
            .setTimestamp()
            .setThumbnail(channel.guild.iconURL())
            .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })

        await oldMessage.edit({ embeds: [updatedEmbed], components: components });
        messageEdited = true;
    } else {
        console.log('No old message found or already edited - creating new message');

        const roleSelectOptions = roles.map(role => {
            const { name, emoji } = role;
            return { label: `${name}`, value: `${name}`, emoji: `${emoji}` };
        });
        const roleSelect = new Discord.StringSelectMenuBuilder()
            .setCustomId('role_select')
            .setPlaceholder('اختر لونك المفضل')
            .setMinValues(0)
            .setMaxValues(1)
            .addOptions(roleSelectOptions);
        let colorimage = "https://media.tenor.com/NPR5w7x9CpUAAAAd/discord-colour-roles.gif";

        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const embed = new Discord.MessageEmbed()
            .setColor(randomColor)
            .setTitle('__**اختر لونك المفضل**__')
            .setDescription(':paintbrush: __**من هنا تقدر تختار لونك المفضل، فقط اضغط على القائمة واختر اللون الذي تريده**__ :paintbrush:')
            .setImage(`${colorimage}`)
            .addFields(
                { name: '__**الألوان المتاحة**__', value: roles.map(role => `${role.emoji} **${role.name}**`).join('\n') },
                { name: ':warning: __**تحذير:**__', value: '__**كل شخص ليه حق يختار فقط لون واحد فقط، في حالة اختيار أكثر من لون واحد يرجى الإبلاغ عن ذلك.**__' }
            )
            .setFooter(channel.guild.name, channel.guild.iconURL())
            .setTimestamp()
            .setThumbnail(channel.guild.iconURL())
            .setAuthor(channel.guild.name, channel.guild.iconURL());
        const message = await channel.send({ embeds: [embed], components: [new Discord.ActionRowBuilder().addComponents(roleSelect)] });
    }
    let canSelect = true;
});

client.on('interactionCreate', async interaction => {
    const { customId, values } = interaction;

    if (customId === 'role_select') {
        const selectedRoleName = values[0];
        const selectedRoleObj = roles.find(role => role.name === selectedRoleName);
        const selectedRoleId = selectedRoleObj?.roleId;
        const selectedRole = interaction.guild.roles.cache.find(role => role.id === selectedRoleId);

        if (!selectedRoleName) {
            const previousRoleObj = roles.find(role => interaction.member.roles.cache.has(role.roleId));
            if (previousRoleObj) {
                const previousRoleId = previousRoleObj.roleId;
                await interaction.member.roles.remove(previousRoleId, 'User deselected their role color.');
                await interaction.reply({ content: '**__تمت إزالة اللون من حسابك__**.', ephemeral: true });
            } else {
                await interaction.reply({ content: '**__لم تختار أي لون بعد__**', ephemeral: true });
            }
        } else if (!selectedRoleObj) {
            await interaction.reply({ content: `**__لون ${selectedRoleName} غير متوفر__**`, ephemeral: true });
        } else {
            const hasSelectedRole = interaction.member.roles.cache.has(selectedRoleId);

            if (hasSelectedRole) {
                await interaction.reply({ content: `**__انت بالفعل تستخدم اللون ${selectedRoleName}__**`, ephemeral: true });
            } else {
                const previousRoleObj = roles.find(role => interaction.member.roles.cache.has(role.roleId) && role.roleId !== selectedRoleId);

                if (previousRoleObj) {
                    const previousRoleId = previousRoleObj.roleId;
                    await interaction.member.roles.remove(previousRoleId, 'User changed their role color.');
                }

                await interaction.member.roles.add(selectedRole, 'User changed their role color.');
                await interaction.reply({ content: `**__تم إضافة اللون ${selectedRoleName} بنجاح__**`, ephemeral: true });
            }
        }
    }
});

//-------------------------------------------------------------------- this is for Select Menu for Country to the Member
const emoji25 = "<:flag_kr:1095526980184707222>";
const roles1 = [
    { name: 'Kuwait', roleId: '679914924063064064', emoji: '🇰🇼' },
    { name: 'Saudi Arabia', roleId: '679915141298520094', emoji: '🇸🇦' },
    { name: 'Qatar', roleId: '679914562262532253', emoji: '🇶🇦' },
    { name: 'UAE', roleId: '950116019488325682', emoji: '🇦🇪' },
    { name: 'Oman', roleId: '1094836284876390421', emoji: '🇴🇲' },
    { name: 'Bahrain', roleId: '1094835541456986114', emoji: '🇧🇭' },
    { name: 'Jordan', roleId: '714853905569153064', emoji: '🇯🇴' },
    { name: 'Lebanon', roleId: '679914944925401154', emoji: '🇱🇧' },
    { name: 'Iraq', roleId: '679915026739757064', emoji: '🇮🇶' },
    { name: 'Kurdistan', roleId: '1094842353132519514', emoji: `${emoji25}` },
    { name: 'Syria', roleId: '679915165331751071', emoji: '🇸🇾' },
    { name: 'Libya', roleId: '679914670248689741', emoji: '🇱🇾' },
    { name: 'Yemen', roleId: '679914641119379466', emoji: '🇾🇪' },
    { name: 'Palestine', roleId: '679914796115689527', emoji: '🇵🇸' },
    { name: 'Egypt', roleId: '679914902990618680', emoji: '🇪🇬' },
    { name: 'Algeria', roleId: '679914742478929970', emoji: '🇩🇿' },
    { name: 'Morocco', roleId: '680399471783313429', emoji: '🇲🇦' },
    { name: 'Tunisia', roleId: '679914709608431646', emoji: '🇹🇳' },
    { name: 'Sudan', roleId: '1094836748833525830', emoji: '🇸🇩' }
];

let channel1;
let message1Edited = false;

client.on('ready', async () => {
    // Get the server and channel objects
    const guild1 = await client.guilds.fetch('572800136132952065');
    channel1 = guild1.channels.cache.get('1094834552708530287');

    // Check if the message already exists in the channel
    const messages1 = await channel1.messages.fetch();
    const oldMessage1 = messages1.find(m => m.author.id === client.user.id && m.embeds.length > 0 && m.embeds[0].title === '__**اختر بلدك المفضل**__');

    if (oldMessage1 && !message1Edited) {
        console.log(`Found old message with ID ${oldMessage1.id}`);
        const components1 = oldMessage1.components;
        const roleSelect = components1[0].components[0];
        roleSelect.options = roles1.map(role => ({ label: `${role.emoji} **${role.name}**`, value: role.name }));

        const countryimage = "https://media.tenor.com/3DusFyei0VsAAAAC/location-roles.gif";
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const updatedEmbed1 = new Discord.EmbedBuilder()
            .setColor(randomColor)
            .setTitle('__**اختر بلدك المفضل**__')
            .setDescription(':earth_africa: __**من هنا تقدر تختار بلدك المفضل، فقط اضغط على القائمة واختر بلدك الذي تريده**__ :earth_africa:')
            .setImage(countryimage)
            .addFields(
                { name: '__**البلدان المتاحة**__', value: roles1.map(role => `${role.emoji} **${role.name}**`).join('\n') },
                { 
                    name: ':warning: __**تحذير:**__', 
                    value: '__**كل شخص ليه حق يختار فقط بلد واحد فقط، في حالة اختيار أكثر من بلد واحد يرجى الإبلاغ عن ذلك.**__',
                } 
            )
            .setFooter({ text: channel1.guild.name, iconURL: channel1.guild.iconURL() })
            .setTimestamp()
            .setThumbnail(channel1.guild.iconURL())
            .setAuthor({ name: channel1.guild.name, iconURL: channel1.guild.iconURL() });

        await oldMessage1.edit({ embeds: [updatedEmbed1], components: components1 });
        message1Edited = true;
    } else {
        console.log('No old message found or already edited - creating new message');

        const roleSelectOptions = roles1.map(role => {
            const { name, emoji } = role;
            return { label: `${name}`, value: `${name}`, emoji: `${emoji}` };
        });
        const roleSelect = new Discord.StringSelectMenuBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('role_select1')
                    .setPlaceholder('اختر بلدك المفضل')
                    .setMinValues(0)
                    .setMaxValues(1)
                    .addOptions(roleSelectOptions)
            );

        const countryimage = "https://media.tenor.com/3DusFyei0VsAAAAC/location-roles.gif";
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const embed1 = new Discord.EmbedBuilder()
            .setColor(randomColor)
            .setTitle('__**اختر بلدك المفضل**__')
            .setDescription(':earth_africa: __**من هنا تقدر تختار بلدك المفضل، فقط اضغط على القائمة واختر بلدك الذي تريده**__ :earth_africa:')
            .setImage(countryimage)
            .addFields(
                { name: '__**البلدان المتاحة**__', value: roles1.map(role => `${role.emoji} **${role.name}**`).join('\n') },
                { 
                    name: ':warning: __**تحذير:**__', 
                    value: '__**كل شخص ليه حق يختار فقط بلد واحد فقط، في حالة اختيار أكثر من بلد واحد يرجى الإبلاغ عن ذلك.**__',
                } 
            )
            .setFooter({ text: channel1.guild.name, iconURL: channel1.guild.iconURL() })
            .setTimestamp()
            .setThumbnail(channel1.guild.iconURL())
            .setAuthor({ name: channel1.guild.name, iconURL: channel1.guild.iconURL() });
        
        const message1 = await channel1.send({ embeds: [embed1], components: [roleSelect] });
    }

    let canSelect1 = true;
});

client.on('interactionCreate', async interaction1 => {
    const { customId, values } = interaction1;

    if (customId === 'role_select1') {
        const selectedRoleName = values[0];
        const selectedRoleObj = roles1.find(role => role.name === selectedRoleName);
        const selectedRoleId = selectedRoleObj?.roleId;
        const selectedRole = interaction1.guild.roles.cache.find(role => role.id === selectedRoleId);

        if (!selectedRoleName) {
            const previousRoleObj = roles1.find(role => interaction1.member.roles.cache.has(role.roleId));
            if (previousRoleObj) {
                const previousRoleId = previousRoleObj.roleId;
                await interaction1.member.roles.remove(previousRoleId, 'User deselected their country.');
                await interaction1.reply({ content: `**__تم الغاء بلدك المفضل__**`, ephemeral: true });
            } else {
                await interaction1.reply({ content: '**__لم تختار أي بلد بعد__**', ephemeral: true });
            }
        } else if (!selectedRoleObj) {
            await interaction1.reply({ content: `**__البلد ${selectedRoleName}  غير متوفر هذا__**`, ephemeral: true });
        } else {
            const hasSelectedRole = interaction1.member.roles.cache.has(selectedRoleId);

            if (hasSelectedRole) {
                await interaction1.reply({ content: `**__انت بالفعل تمتلك البلد ${selectedRoleName}__**`, ephemeral: true });
            } else {
                const previousRoleObj = roles1.find(role => interaction1.member.roles.cache.has(role.roleId) && role.roleId !== selectedRoleId);

                if (previousRoleObj) {
                    const previousRoleId = previousRoleObj.roleId;
                    await interaction1.member.roles.remove(previousRoleId, 'User changed their country.');
                }

                await interaction1.member.roles.add(selectedRole, 'User changed their country.');
                await interaction1.reply({ content: `**__تم إضافة البلد  ${selectedRoleName} بنجاح__**`, ephemeral: true });
            }
        }
    }
});
//----------------------------------------------------------------------------------------------------
const roles2 = [
    { name: 'ولد', roleId: '823598411848482827', emoji: '🤴' },
    { name: 'بنت', roleId: '823598703344222278', emoji: '👸' },
];

let channel2;
let message2Edited = false;

client.on('ready', async () => {
    // Get the server and channel objects
    const guild2 = await client.guilds.fetch('572800136132952065');
    channel2 = guild2.channels.cache.get('1102795121247920128');

    // Check if the message already exists in the channel
    const messages2 = await channel2.messages.fetch();
    const oldMessage2 = messages2.find(m => m.author.id === client.user.id && m.embeds.length > 0 && m.embeds[0].title === '__**اختر انت ولد او بنت**__');

    if (oldMessage2 && !message2Edited) {
        console.log(`Found old message with ID ${oldMessage2.id}`);
        const components2 = oldMessage2.components;
        const roleSelect = components2[0].components[0];
        roleSelect.options = roles2.map(role => ({ label: `${role.emoji} **${role.name}**`, value: role.name }));
        
        const genderImage = "https://media.tenor.com/blq4QyDcdR8AAAAC/gender-roles.gif";
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const updatedEmbed2 = new Discord.EmbedBuilder()
            .setColor(randomColor)
            .setTitle('__**اختر انت ولد او بنت**__')
            .setDescription(':point_down::point_down:  __**من هنا تقدر تختار انت ولد او بنت, فقط اضغط على القائمة واختار **__:point_down::point_down:')
            .setImage(genderImage)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                   { name: '__**الرتب المتاحة**__', value: roles2.map(role => `**${role.name}** ${role.emoji}`).join('\n') },
                ) 
            .setFooter({ text: channel2.guild.name, iconURL: channel2.guild.iconURL() })
            .setTimestamp()
            .setThumbnail(channel2.guild.iconURL())
            .setAuthor({ name: channel2.guild.name, iconURL: channel2.guild.iconURL() });

        await oldMessage2.edit({ embeds: [updatedEmbed2], components: components2 });
        message2Edited = true;
    } else {
        console.log('No old message found or already edited - creating new message');

        const roleSelectOptions = roles2.map(role => {
            const { emoji, name } = role;
            return { label: `${emoji}`, value: `${emoji}`, name: `${name}` };
        });
        const roleSelect = new Discord.StringSelectMenuBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('role_select2')
                    .setPlaceholder('اختر انت ولد او بنت')
                    .setMinValues(0)
                    .setMaxValues(1)
                    .addOptions(roleSelectOptions)
            );

        const genderImage = "https://media.tenor.com/blq4QyDcdR8AAAAC/gender-roles.gif";
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const embed2 = new Discord.EmbedBuilder()
            .setColor(randomColor)
            .setTitle('__**اختر انت ولد او بنت**__')
            .setDescription(':point_down::point_down:  __**من هنا تقدر تختار انت ولد او بنت, فقط اضغط على القائمة واختار **__:point_down::point_down:')
            .setImage(genderImage)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                   { name: '__**الرتب المتاحة**__', value: roles2.map(role => `**${role.name}** ${role.emoji}`).join('\n') },
                ) 
            .setFooter({ text: channel2.guild.name, iconURL: channel2.guild.iconURL() })
            .setTimestamp()
            .setThumbnail(channel2.guild.iconURL())
            .setAuthor({ name: channel2.guild.name, iconURL: channel2.guild.iconURL() });

        const message2 = await channel2.send({ embeds: [embed2], components: [roleSelect] });
    }

    let canSelect2 = true;
});

client.on('interactionCreate', async interaction2 => {
    const { customId, values } = interaction2;

    if (customId === 'role_select2') {
        const selectedRoleName = values[0];
        const selectedRoleObj = roles2.find(role => role.name === selectedRoleName);
        const selectedRoleId = selectedRoleObj?.roleId;
        const selectedRole = interaction2.guild.roles.cache.find(role => role.id === selectedRoleId);

        if (!selectedRoleName) {
            const previousRoleObj = roles2.find(role => interaction2.member.roles.cache.has(role.roleId));
            if (previousRoleObj) {
                const previousRoleId = previousRoleObj.roleId;
                await interaction2.member.roles.remove(previousRoleId, 'User deselected their gender.');
                await interaction2.reply({ content: `**__تم الغاء الرتبه من حسابك__**`, ephemeral: true });
            } else {
                await interaction2.reply({ content: '**__لم تختار أي شي بعد__**', ephemeral: true });
            }
        } else if (!selectedRoleObj) {
            await interaction2.reply({ content: `**__الرتبه ${selectedRoleName}  غير متوفر هذه__**`, ephemeral: true });
        } else {
            const hasSelectedRole = interaction2.member.roles.cache.has(selectedRoleId);

            if (hasSelectedRole) {
                await interaction2.reply({ content: `**__انت بالفعل تمتلك الرتبه ${selectedRoleName}__**`, ephemeral: true });
            } else {
                const previousRoleObj = roles2.find(role => interaction2.member.roles.cache.has(role.roleId) && role.roleId !== selectedRoleId);

                if (previousRoleObj) {
                    const previousRoleId = previousRoleObj.roleId;
                    await interaction2.member.roles.remove(previousRoleId, 'User changed their gender.');
                }

                await interaction2.member.roles.add(selectedRole, 'User changed their gender.');
                await interaction2.reply({ content: `**__تم إضافة الرتبه  ${selectedRoleName} بنجاح__**`, ephemeral: true });
            }
        }
    }
});

//--------------------------------------------------------------------
const emoji120 = "<a:O86:793998960443392091>";
 const emoji121 = "<a:O40:776506884793958431>";
 const emoji122 = "<a:yagpdb:1102844360678191144>";
 const emoji123 = "<:B2:680462033883234396>";
 const emoji124 = "<a:yagpdb1:1102844342521049129>";

const roles3 = [
  { name: 'فعاليات نايترو', roleId: '894614206404513802', emoji: `${emoji120}` },
  { name: 'فعاليات ببجي', roleId: '894614325774385203', emoji: `${emoji121}` },
  { name: 'فعاليات للونسه', roleId: '894613944558317609', emoji: `${emoji122}` },
  { name: 'فعاليات كريديت', roleId: '894614100951314463', emoji: `${emoji123}` },
  { name: 'فعاليات كت تويت', roleId: '894612505316450384', emoji: `${emoji124}` },
  ];

let message3Edited = false;
let channel3;
client.on('ready', async () => {
  // Get the server and channel objects
  const guild3 = await client.guilds.fetch('572800136132952065');
  channel3 = guild3.channels.cache.get('1102795087160811560');

  // Check if the message already exists in the channel
  const messages3 = await channel3.messages.fetch();
  const oldMessage3 = messages3.find(m => m.author.id === client.user.id && m.embeds.length > 0 && m.embeds[0].title === '__**اختر رتبة الفعاليات**__');

  if (oldMessage3 && !message3Edited) {
    console.log(`Found old message with ID ${oldMessage3.id}`);
    const components3 = oldMessage3.components;
    const roleSelect = components3[0].components[0];
    roleSelect.options = roles3.map(role => ({ label: `${role.emoji} **${role.name}**`, value: role.name }));
    
    const genderImage = "https://media.tenor.com/RAWpX5mWxsEAAAAC/self-roles-roles.gif";
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const updatedEmbed3 = new Discord.EmbedBuilder()
        .setColor(randomColor)
        .setTitle('__**اختر رتبة الفعاليات**__')
        .setDescription('🔔 __**من هنا تقدر تختار رتبة الفعاليات حتى يوصلك اشعار الفعاليات، فقط اضغط على القائمة واختر رتبة الفعاليات الذي تريده**__ 🔔')
        .setImage(genderImage)
        .addFields(
            { name: '__**الرتب الفعاليات المتاحة**__', value: roles3.map(role => `**${role.name}** ${role.emoji}`).join('\n') },
        )
        .setFooter({ text: channel3.guild.name, iconURL: channel3.guild.iconURL() })
        .setTimestamp()
        .setThumbnail(channel3.guild.iconURL())
        .setAuthor({ name: channel3.guild.name, iconURL: channel3.guild.iconURL() });

    await oldMessage3.edit({ embeds: [updatedEmbed3], components: components3 });
    message3Edited = true;
} else {
    console.log('No old message found or already edited - creating new message');

    const roleSelectOptions = roles3.map(role => {
        const { name, emoji } = role;
        return { label: `${name}`, value: `${name}`, emoji: `${emoji}` };
    });
   const roleSelect = new Discord.StringSelectMenuBuilder()
   .setCustomId('role_select3')
  .setPlaceholder('اختر رتبة الفعاليات')
  .addOptions(roleSelectOptions);
 
 let genderImage = "https://media.tenor.com/RAWpX5mWxsEAAAAC/self-roles-roles.gif"
 
 const embed3 = new Discord.EmbedBuilder()
 .setColor(randomColor)
 .setTitle('__**اختر رتبة الفعاليات**__')
 .setDescription('🔔 __**من هنا تقدر تختار رتبة الفعاليات حتى يوصلك اشعار الفعاليات، فقط اضغط على القائمة واختر رتبة الفعاليات الذي تريده**__ 🔔')
.setImage(`${genderImage}`)   
.addFields(
    { name: '__**الرتب الفعاليات المتاحة**__', value: roles3.map(role => `**${role.name}** ${role.emoji}`).join('\n') },
  //  name '__**مثال:**__', value: '__** فقط قم بي الضغط على القائمة "اختر رتبة الفعاليات" وقم بي اختيار رتبة الي تريده حتى يوصلك اشعار **__' },
 ) 
 .setFooter({ text: channel3.guild.name, iconURL: channel3.guild.iconURL() })
 .setTimestamp()
 .setThumbnail(channel3.guild.iconURL())
 .setAuthor({ name: channel3.guild.name, iconURL: channel3.guild.iconURL() })
const message3= await channel3.send({ embeds: [embed3], components: [new Discord.ActionRowBuilder().addComponents(roleSelect)] });
}
let canSelect3 = true;
});

client.on('interactionCreate', async interaction3 => {
  const { customId, values } = interaction3;

  if (customId === 'role_select3') {
    const selectRoles = values.map(selectedRoleName => {
      const selectedRoleObj = roles3.find(role => role.name === selectedRoleName);
      const selectedRoleId = selectedRoleObj?.roleId;
      return selectedRoleId ? interaction3.guild.roles.cache.find(role => role.id === selectedRoleId) : undefined;
    }).filter(Boolean);

    if (!selectRoles.length) {
      await interaction3.reply({ content: '**__لم تختار أي شي بعد__**', ephemeral: true });
    } else {
      const userRoles = interaction3.member.roles.cache;
      const newRoles = selectRoles.filter(role => !userRoles.has(role.id));
      const addedRoleNames = newRoles.map(role => roles3.find(r => r.roleId === role.id).name);
      const existingRoles = selectRoles.filter(role => userRoles.has(role.id)).map(role => role.name);
      if (existingRoles.length > 0) {
        await interaction3.reply({ content: `**__انت بالفعل تمتلك الرتب التالية: ${existingRoles.join(', ')}__**`, ephemeral: true });
      } else {
        for (const role of newRoles) {
          await interaction3.member.roles.add(role, 'User changed their gender.');
        }
        await interaction3.reply({ content: `**__تم إضافة الرتب التالية: ${addedRoleNames.join(', ')}__**`, ephemeral: true });
      }
    }
  }
});

//-------------------------------------------------------------------- this is for Generating images only works with English Alphabates
const prodia = require("prodia-ai");
const natural = require('natural')

const model = "theallys-mix-ii-churned.safetensors [5d9225a4]";
const seed = 100;
const steps = 30;
const cfgScale = 7;
//const targetChannelId = "1085816462276579419"; // Replace with the ID of the target channel
//the target channel
const minimumLength = 3; // Replace with your preferred minimum length or complexity threshold

// Create a new bayes classifier for language detection
const classifier = new natural.BayesClassifier();
// Train the classifier with some example English and non-English texts
classifier.addDocument('The quick brown fox jumps over the lazy dog', 'english');
classifier.addDocument('Ich bin ein Berliner', 'german');
classifier.addDocument('Bonjour', 'french');
classifier.addDocument('ض ص ث ق ف غ ع ه ح خ ج ك ز ز و ة ى لا ر ؤ ء ش س ي ب ل ا ت ن م ', 'arabic')
classifier.train();

const targetimage = '1092300512138899547';
const targetcomamnd = '1090436879293349948';

client.on("messageCreate", async (message) => {
if (message.author.bot) return;
const first = message.member

if (!first) return;
// Check if the message was sent in the target channel
if (message.channel.id !== targetcomamnd) return;

// Check if the message starts with 'image '
if (!message.content.toLowerCase().startsWith("image")) return;

const inputKeyword = message.content.slice(6);

// Detect the language of the input keyword
const language = classifier.classify(inputKeyword);

// Check if the language is English and if the keyword meets the minimum length or complexity threshold
if (language !== 'english' || inputKeyword.replace(/[^\w]/g, "").length < minimumLength) {
message.channel.send(`**__Please use English characteres only with at least three characters__** ${first}`);
return;
}

let job = await prodia.createJob({
model: model,
prompt: `image of ${inputKeyword}`,
seed: seed,
steps: steps,
cfg_scale: cfgScale
});

console.log(`Job created! Using inputKeyword "${inputKeyword}". Waiting...`);

while (job.status !== "succeeded" && job.status !== "failed") {
await new Promise((resolve) => setTimeout(resolve, 250));

job = await prodia.getJob(job.job);
}

if (job.status !== "succeeded") {
throw new Error("Job failed!");
}

try {
  const imageBuffer = await fetch(job.imageUrl).then(res => res.buffer());

  const imageChannel = await client.channels.fetch(targetimage);
  console.log(`targetChannelId: ${targetimage}`);
  console.log(`imageChannel.id: ${imageChannel.id}`);

  // Send confirmation message to original channel
  await message.channel.send("Your image has been generated!");

  console.log("Message sent!");
  await imageChannel.send({
    content: `__**Here's your generated image:**__`,
    files: [
      {
        attachment: imageBuffer,
        name: 'generated-image.png',
      },
    ],
  });
} catch (error) {
  console.error(error);
  await message.channel.send(`__**An error occurred while sending the generated image to the target channel. Please try again later.**__`);
}
});
//-------------------------------------------------------------------- this is for getting the avatar of a member
client.setMaxListeners(9999999);
const channelIds = ["680423398362578967","1085816462276579419", "572800136623947809","1092300512138899547"]; // 
const prefix = "ramy";
client.on(`messageCreate`, async message => {
if (!channelIds.includes(message.channel.id)) return; // Check if the message was sent in one of the desired channels
  // Get avatar
  if (message.content.startsWith(prefix + "avatar")) {
    let args = message.content.split(" ");
    let user = message.mentions.users.first() || (args.length > 1 ? client.users.cache.get(args[1]) : undefined) || message.author;
    let avatarURL = user.displayAvatarURL({ dynamic: true, size: 512 });
    const first = message.member;

if (!first) return;
if (avatarURL === false) return message.reply(`__** ❌ \`${first}\`**__ • ليس لديه افتار__**`);
// Create a new row to hold the download button
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("اضغط عليا اذا تريد تحميل الافتار")
.setStyle("Link")
.setEmoji("📥")
.setURL(avatarURL)
);

// Create and send the embed with the avatar image and download button
const embed = new Discord.EmbedBuilder()
.setTitle(`**__ Here is The Avatar Of: __**  ${user.username}`)
.setImage(avatarURL)
.setColor(randomColor)
.setTimestamp();
message.reply({
embeds: [embed],
components: [row] // Add the row to the reply message
});
}


//-------------------------------------------------------------------- this is for getting the banner of a Member
if (message.content.startsWith(prefix + "banner")) {
let member = message.mentions.users.first() || message.author;
let args = message.content.split(" ");
    let user = message.mentions.users.first() || (args.length > 1 ? client.users.cache.get(args[1]) : undefined) || message.author;
    if (!user) return message.channel.send(`**__يرجى ذكر المستخدم أو استعمال الايدي__**`)
    let banner = false;
    await user.fetch().then(user => {
      if (user.banner) {
        banner = user.bannerURL({ dynamic: true, size: 1024 })
      }
    })
    if (banner === false) return message.reply(`** ❌ \`${user.username}\`**__ •  ليس لديه بانر__**`);
// Create a new row to hold the download button
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("اضغط عليا اذا تريد تحميل البانر")
.setStyle("Link")
.setEmoji("📥")
.setURL(banner)
);

// Create and send the embed with the banner image and download button
const embed = new Discord.EmbedBuilder()
.setTitle(`**__ Here is The Banner Of: __**  ${user.username} `)
.setImage(banner)
.setColor(randomColor)
.setTimestamp();
message.reply({
embeds: [embed],
components: [row] // Add the row to the reply message
});
}


//-------------------------------------------------------------------- this is for Providing a server information
if (message.content.startsWith(prefix + "server")) {
if (message.author.bot) return;

const verificationLevels = { NONE: "0", LOW: "1", MEDIUM: "2", HIGH: "3", VERY_HIGH: "4" };
const onlineMembers = message.guild.members.cache.filter(m => m.presence?.status === "online").size;
const idleMembers = message.guild.members.cache.filter(m => m.presence?.status === "idle").size;
const dndMembers = message.guild.members.cache.filter(m => m.presence?.status === "dnd").size;
const boostCount = message.guild.premiumSubscriptionCount;

const embed = new Discord.EmbedBuilder()
.setThumbnail(message.guild.iconURL({ dynamic: true }))
.addFields(
{ name: "__**🆔 Server ID:**__", value: `__**${message.guild.id}**__` },
{ name: "__**📅 Created On:**__", value: `__**<t:${Math.floor(message.guild.createdAt.valueOf() / 1000)}:R>**__` },
{ name: "__**👑 Owned by:**__", value: `__**${await message.guild.fetchOwner()}**__` },
{
name: `👥 Members: (__**${message.guild.memberCount}**__)`,
value: `__**${onlineMembers + idleMembers + dndMembers} Online\n${boostCount} Boosts **__`
},
{
name: `__**💬 Channels:**__ (${message.guild.channels.cache.size})**__`,
value: `__**${message.guild.channels.cache.filter(m => m.type === "GUILD_TEXT").size} Text | ${message.guild.channels.cache.filter(m => m.type === "GUILD_VOICE").size} Voice**__`
},
{ name: "__**🌍 Others:**__", value: `__**Verification Level: ${verificationLevels[message.guild.verificationLevel]}**__` },

)
.setColor(randomColor)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });
message.reply({ embeds: [embed] });
} 


//-------------------------------------------------------------------- this is for Setting a Nickname a Member
if (message.content.startsWith("#nick") || message.content.startsWith("لقب")) {
const flagsPermissions = ['ManageNicknames'];
// Check if the author has the "MANAGE_NICKNAMES" permission
if (!message.member.permissions.has(flagsPermissions)) {
return message.channel.send(`❌**__ليس لديك إذن بتغير النك نيم.__**`);
}

// Get the member and new nickname from the message
const args = message.content.slice(prefix).trim().match(/[^ ]+/g);
const member = message.mentions.members.first();
const newNickname = args.slice(2).join(" ");

// Check if the member exists and if the new nickname is not empty
if (!member) {
return message.channel.send("**__يرجى ذكر المستخدم لتعيين النك نيم.__**");
}
if (!newNickname) {
return message.channel.send("**__الرجاء إدخال اسم النك نيم الجديد .__**");
}
if (member.nickname === newNickname) {
return message.channel.send("**__انت بالفعل تمتلك النك نيم هذا يرجى استعمال نك نيم جديد.__**");
}

// Set the new nickname and send a confirmation message
member.setNickname(newNickname)
.then(() => {
message.channel.send(`**__تم تعيين النك نيم بي نجاح__** \`${newNickname}\`.`);
})
.catch(err => {
console.log(err);
message.channel.send(`❌**__حدث خطأ في تعيين النك نيم يرجى محاوله مرة ثانية: ${err.message}__**`);
});
}})

const fetch = require('node-fetch');
const https = require('https');
//-------------------------------------------------------------------- this is for Bannding a Member
//-------------------------------------------------------------------- this is for unbaning a Member
client.on('messageCreate', async message => {
  if (message.author.bot) return;
   // const flagsPermissions = ['BanMembers', 'Adminstrator'];
    const unbanAliases = ['افتح'];
  //console.log('Message received:', message.content);

const mentionPattern = /<(\!?@|@!)(\d+)>/;
let user;
const args = message.content.trim().split(/ +/g);
if (!unbanAliases.includes(args[0].toLowerCase())) return;
//if (!unbanAliases.includes(args[-0].toLowerCase())) return;
 
    const unbanFlagPermissions = [
  'Administrator',
  'BanMembers'
];

if (args.length > 1) {
  let userMatch = args[1].match(mentionPattern);
  if (userMatch) {
    user = await message.client.users.fetch(userMatch[2], { cache: false }).catch(() => {});
  } else if (/^\d+$/.test(args[1])) {
    user = await message.client.users.fetch(args[1], { cache: false }).catch(() => {});
  }

  if (!user) {
    console.log('No valid ID or mention found in "unban" message.');
    let helpEmbed = new Discord.EmbedBuilder()
      .setTitle('**Command: unban**')
      .setDescription('**إزالة الحظر عن عضو.**')
      .addFields(
        {
          name: '**الأختصارات:**',
          value: unbanAliases.map(alias => `${alias}`).join(', ')
        },
        {
          name: '**الاستخدام:**',
          value: 'unban [user]',
        },
        {
          name: '**أمثله للأمر:**',
          value: `unban <@${message.author.id}>\nunban 123456789488384512`
        }
      )
      .setColor(randomColor);

    return message.channel.send({ embeds: [helpEmbed] });
  } else {
    let bannedUsers = await message.guild.bans.fetch();
    let bannedUser = bannedUsers.find(u => u.user.id === user.id);
if (!bannedUser) {
  console.log('User is not currently banned from server');
  if (!message.member.permissions.any(unbanFlagPermissions)) {
    const notAllowedEmbed = new Discord.EmbedBuilder()
      //.setTitle('Unban Error')
      .setDescription('__**You don\'t have permission to unban members.**__')
    .setColor(randomColor);
    const messageObject = { embeds: [notAllowedEmbed] };
    await message.channel.send(messageObject);
    await message.channel.send({ embeds: [notAllowedEmbed], allowedMentions: { repliedUser: true } });
  } else {
    console.log(`User '${user.tag}' is not banned from server`);
    const notBannedEmbed = new Discord.EmbedBuilder()
      //.setTitle('User is not currently banned')
      .setDescription(`__**${user} is not currently banned from this server.**__`)
      .setColor(randomColor);
    await message.channel.send({ embeds: [notBannedEmbed], allowedMentions: { repliedUser: true } });
  }
} else {
  console.log(`__**User '${user.tag}' is currently banned from server**__`);

        let unbanReason = `By: ${message.author.tag}`;
        if (args.length > 2) {
          unbanReason += ` | Reason: ${args.slice(2).join(' ')}`;
        }

        console.log(`Unban reason: ${unbanReason}`);

        await message.guild.members.unban(user.id, { reason: unbanReason })
          .then(() => {
            console.log(`Successfully unbanned ${user.tag}`);
            setTimeout(() => {
              let successEmbed = new Discord.EmbedBuilder()
                .setDescription(`**:white_check_mark: تم فك حظر ${user}.**`)
                .setColor(randomColor);
              message.channel.send({ embeds: [successEmbed] });
            }, 3000);
          })
          .catch(() => {
            let errorEmbed = new Discord.EmbedBuilder()
              .setDescription(`**❌ لم يتم فك حظر ${user}.**`)
              .setColor(randomColor);
            return message.channel.send({ embeds: [errorEmbed] });
          });
      }
    }
  }
});
     
//-------------------------------------------------------------------- this is for unbaning a Member
 client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const banAliases = ['حظر', 'ابلع', 'تف','بيباي'];
  
  const mentionPattern = /<(\!?@|@!)(\d+)>/;
  let user;
  const args = message.content.trim().split(/ +/g);
  
  //console.log('Message received:', message.content);
  
  if (!banAliases.includes(args[0].toLowerCase())) return;
    const banFlagPermissions = [
    'Administrator',
    'BanMembers'
  ];
  
  if (args.length > 1) {
    let userMatch = args[1].match(mentionPattern);
    let userId;
    if (userMatch) {
      userId = userMatch[2];
    } else if (/^\d+$/.test(args[1])) {
      userId = args[1];
    }
    if (!userId) {
      console.log('No valid ID or mention found in "ban" message.');
      let helpEmbed = new Discord.EmbedBuilder()
        .setTitle('**Command: ban**')
        .setDescription('**حضر العضو من السيرفر.**')
        .addFields(
          {
            name: '**الأختصارات:**',
            value: banAliases.map(alias => `${alias}`).join(', ')
          },
          {
            name: '**الاستخدام:**',
            value: '/ban [user] [reason]',
          },
          {
            name: '**أمثله للأمر:**',
            value: `/ban <@${message.author.id}> breaking rules\nban 123456789488384512 spamming\nban username#1234 toxic behavior`
          }
        )
        .setColor(randomColor);
  
        return message.channel.send({ embeds: [helpEmbed] });
      } else {
    let user = await message.client.users.fetch(userId);
    let member = await message.guild.members.fetch(user.id).catch(() => {});
    let reason = args.slice(2).join(' ');
    let days = 180;
      
    const now = Date.now();
    const endTime = new Date(now);
    endTime.setDate(endTime.getDate() + days);
    endTime.setSeconds(0, 0);
  
    if (!reason) {
  reason = `By: ${message.author.tag}, REASON: , ENDS ON: ${endTime.toLocaleString('en-US', { timeZone: 'UTC' }).replace(',', '')}`;
} else {
  reason = `By: ${message.author.tag}, REASON: ${reason}, ENDS ON: ${endTime.toLocaleString('en-US', { timeZone: 'UTC' }).replace(',', '')}`;
}
  
    if (!message.member.permissions.any(banFlagPermissions)) {
      console.log('❌ __**العضو ليس لديه بيرمنشن لحظر الأعضاء**__');
      let noPermissionEmbed = new Discord.EmbedBuilder()
        .setTitle('__**لاتملك بيرمنشن**__')
        .setDescription('❌__** ليس لديك بيرمنشن لحظر الاعضاء .**__')
        .setColor(randomColor);
      return message.channel.send({ embeds: [noPermissionEmbed] });
    } else if (message.guild.ownerId === user.id) {
      console.log('__**❌لا يمكنك حظر الاونر للسيرفر لأنه مالك السيرفر**__');
      let ownerEmbed = new Discord.EmbedBuilder()
        .setTitle('__**لايمكنك حضر الاونر للسيرفر**__')
        .setDescription(`__**❌ ${user} لا يمكنك حظر الاونر للسيرفر لأنه مالك السيرفر.**__`)
        .setColor(randomColor);
      return message.channel.send({ embeds: [ownerEmbed] });
    } else if (member && member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
        console.log('__**❌ لايمكنك حضر الاعضاء اعلى منك بل بالرتب وا البيرمنشنات**__');
    let adminEmbed = new Discord.EmbedBuilder()
      .setTitle('__**لاتقدر تبند هذا المستخدم**__')
      .setDescription(`__**❌${user} لايمكنك حضر الاعضاء اعلى منك بل بالرتب وا البيرمنشنات.**__`)
      .setColor(randomColor);
    return message.channel.send({ embeds: [adminEmbed] });
  } else {
    if (member) {
  await member.ban({ days: 180, reason: reason });
  let successEmbed = new Discord.EmbedBuilder()
    .setDescription(`**:white_check_mark: تم حظر ${user} بنجاح.**`)
    .setColor(randomColor);
  return message.channel.send({ embeds: [successEmbed] });
} else {
  console.log(`Unable to ban user ${user.tag} from ${message.guild.name}: member not found.`);
}
      }
  }

 };
 });
      
//-------------------------------------------------------------------- this is for Warning a Member
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const requiredRole = message.guild.roles.cache.find(role => role.name === '⋆୨𝐌𝐔𝐓𝐄-𝐓𝐀𝐋𝐊୧⋆ ᵏˢᵖ');

  if (!message.member.roles.cache.has(requiredRole.id)) return;

  const warnAliases = ['warn', 'انذار', 'ممنوع'];
  const allowedRoleNames = ['Moderator', 'Admin'];
const args = message.content.split(/ +/g).slice(0);
  if (warnAliases.some(alias => message.content.toLowerCase().startsWith(alias)) && args.length > 1 && !message.reference) {

    if (!args[0]) {
      const helpEmbed = new Discord.EmbedBuilder()
        .setTitle('**Command: warn**')
        .setDescription('**تحذير العضو.**')
        .addFields(
          {
            name: '**الأختصارات:**',
            value: warnAliases.map(alias => `${alias}`).join(', ')
          },
          {
            name: '**الاستخدام:**',
            value: '/warn [user ID or mention] (reason)',
          },
          {
            name: '**أمثله للأمر:**',
            value: `/warn <@${message.author.id}> spamming`
          }
        )
        .setColor(randomColor);

      return message.channel.send({ embeds: [helpEmbed] });
    }

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!member) {
      const helpEmbed = new Discord.EmbedBuilder()
        .setDescription(`__**❌ لم يتم العثور على عضو بهذا الاسم أو الرقم.**__`)
        .setColor(randomColor);

      return message.channel.send({ embeds: [helpEmbed] });
    }

    if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position <= member.roles.highest.position) {
      const helpEmbed = new Discord.EmbedBuilder()
        .setDescription(`__**❌ لا يمكنك تحذير هذا العضو انه اعلى منك.**__`)
        .setColor(randomColor);

      return message.channel.send({ embeds: [helpEmbed] });
    }

    if (!args[1]) {
      const helpEmbed = new Discord.EmbedBuilder()
        .setDescription(`__**❌ انت لم تذكر سبب التحذير لكي يتم تحذير العضو, يجب ان تكتب سبب للتحذير لكي يتم تحذير المستخدم.**__`)
        .setColor(randomColor);

      return message.channel.send({ embeds: [helpEmbed] });
    }

    let reason = args.slice(1).join(' ');

    let successMessage = `__**✅ ${member} تم تحذيره! 🚨**__`;

    await message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setDescription(successMessage)
          .setColor(randomColor)
      ]
    });

    await member.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setTitle('**⚠️ !لقد تم تحذيرك**')
          .setDescription(`**السبب:** ${reason}`)
          .setFooter(
            { text: `${message.guild.name}`, iconURL: message.guild.iconURL(), }
          )
          .setTimestamp()
          .setColor(randomColor)
      ]
    })
      .then(() => console.log(`DM sent to user ${member.user.tag} (${member.id}).`))
      .catch(console.error);
  }
});



//-------------------------------------------------------------------- this is for Muting a Member
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const requiredRole = message.guild.roles.cache.find(role => role.name === '⋆୨𝐌𝐔𝐓𝐄-𝐓𝐀𝐋𝐊୧⋆ ᵏˢᵖ');

  if (!message.member.roles.cache.has(requiredRole.id)) return;
  
  const muteAliases = ['mute', 'اسكت'];
  if (muteAliases.some(alias => message.content.toLowerCase().startsWith(alias))) {
    let args = message.content.split(/ +/g);
    args.shift(); // Remove the alias from the args
  
    // Check if user to mute is provided
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      let helpEmbed = new Discord.EmbedBuilder()
        .setTitle('**Command: mute**')
        .setDescription('**اسكات احد الاعضاء من الرومات الكتابية.**')
        .addFields(
          {
            name: '**الأختصارات:**',
            value: muteAliases.map(alias => `${alias}`).join(', ')
          },
          {
            name: '**الاستخدام:**',
            value: '/mute [user ID or mention] (time ends m,h,d,mo,y) (reason)',
          },
          {
            name: '**أمثله للأمر:**',
            value: `/mute <@${message.author.id}> spamming\nmute <@${message.author.id}> 1h\nmute <@${message.author.id}> 1d\nmute <@${message.author.id}> 1w\nmute <@${message.author.id}> 1mo\nmute <@${message.author.id}> 1y`
          }
        )
        .setColor(randomColor);
      return message.channel.send({
        embeds: [helpEmbed]
      });
    }
  
    if (member.id === message.author.id) {
      return message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription(`__**😕 لا يمكنك ان تلغي اسكات حسابك.**__`)
            .setColor(randomColor)
        ]
      });
    }
  
    if (member.roles.highest.raw >= message.member.roles.highest.raw) {
      return message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription(`__**😕 ${message.author.toString()} لا يمكنك إلغاء اسكات ${member.toString()} بسبب الشخص الذي تحاول اسكاته  يملك دور أعلى من دورك.**__`)
            .setColor(randomColor)
        ]
      });
    }
  
    const muteRole = message.guild.roles.cache.find(role => role.name === '𝐌𝐔𝐓𝐄𝐃');
    if (!muteRole) {
      return message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription(`__**❌ لا يوجد دور "Muted" في هذا السيرفر. يرجى إنشاء واحدة قبل استخدام الأمر. **__` )
            .setColor(randomColor)
        ]
      });
    }
  
    // Check if the user has the given role to have permission to mute members
    const hasPermission = message.member.roles.cache.some(role => role.name === '⋆୨𝐌𝐔𝐓𝐄-𝐓𝐀𝐋𝐊୧⋆ ᵏˢᵖ');
    if (!hasPermission) {
      return message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription(`__**😕 ليس لديك إذن لاسكات الأعضاء.**__`)
            .setColor(randomColor)
        ]
      });
    }

    // Check if the member who is to be muted has a role that is lower than the role of the member issuing the command
     if (member.roles.highest.position >= message.member.roles.highest.position) {
      return message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription(`__**😕 ${message.author.toString()} لا يمكنك إلغاء اسكات ${member.toString()} بسبب أن لديه دور أعلى من دورك.**__`)
            .setColor(randomColor)
        ]
      });
    }

    // Get mute duration and reason
    const time = args[1];
    const reason = args.slice(2).join(' ') ||
    // Mute the user
    member.roles.add(muteRole);
    message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setDescription(`__**${member.toString()} تم اسكات ${time ? `لمدة ${time}` : ''}''}.**__`)
          .setColor(randomColor)
      ]
    });
const moment = require('moment');
    // Remove the muted role after the given time ends
    if (time) {
      const endTime = moment().add(moment.duration(time));
      const timeout = moment().diff(endTime);

      setTimeout(() => {
        if (!member.roles.cache.has(muteRole.id)) return;

        member.roles.remove(muteRole);
        message.channel.send({
          embeds: [
            new Discord.EmbedBuilder()
             .setDescription(`__**${member.toString()} لقد انتهى وقت الاسكات بعد تم سحب 
 الرتبه اسكات المحددة يرجى منك الاتزام بي القوانين لكي تتجنب يتم اسكاتك مراى ثانية.**__`)
            .setColor(randomColor)
          ]
        });
      }, timeout);
    }
  }
});


client.on('messageCreate', async message => {
  if (message.author.bot) return;
  
  const muteRole = message.guild.roles.cache.find(role => role.name === '𝐌𝐔𝐓𝐄𝐃');
  if (!muteRole) {
    return message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`__**❌ لا يوجد دور "Muted" في هذا السيرفر. يرجى إنشاء Muted قبل استخدام هذا الأمر. **__ `).setColor(randomColor)]});
  }
  
  const moderatorRole = message.guild.roles.cache.find(role => role.name === '⋆୨𝐌𝐔𝐓𝐄-𝐓𝐀𝐋𝐊୧⋆ ᵏˢᵖ');
  
  const unmuteAliases = ['unmute', 'تكلم'];
  if (unmuteAliases.some(alias => message.content.toLowerCase().startsWith(alias))) {
    let args = message.content.split(/ +/g);
    args.shift(); // Remove the alias from the args
    
    // Check if user to unmute is provided
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      let helpEmbed = new Discord.EmbedBuilder()
        .setTitle('**Command: unmute**')
        .setDescription('**Unmute a member.**')
        .addFields(
          {
            name: '**الأختصارات:**',
            value: unmuteAliases.map(alias => `${alias}`).join(', ')
          },
          {
            name: '**الاستخدام:**',
            value: 'unmute [user]',
          },
          {
            name: '**أمثله للأمر:**',
            value: `unmute <@${message.author.id}>\nunmute 1234567890`
          }
        )
        .setColor(randomColor);
      return message.channel.send({ embeds: [helpEmbed] });
    }
    
    // Check if member has the Moderator role
    if (!message.member.roles.cache.has(moderatorRole.id)) {
      let helpEmbed = new Discord.EmbedBuilder()
        .setDescription(`__**😕 ليس لديك صلاحيات لإلغاء اسكات الأعضاء.**__`)
        .setColor(randomColor);
      return message.channel.send({ embeds: [helpEmbed] });
    }

    // Check if member to unmute has the Muted role
    if (!member.roles.cache.has(muteRole.id)) {
      let helpEmbed = new Discord.EmbedBuilder()
        .setDescription(`__**❌ ${member.toString()} لا يوجد اسكات على هذا الحساب.**__`)
        .setColor(randomColor);
      return message.channel.send({ embeds: [helpEmbed] });
    }
    
    if (member.roles.highest.raw >= message.member.roles.highest.raw) {
  let helpEmbed = new Discord.EmbedBuilder()
    .setDescription(`__**😕 <@${message.author.id}> لا تقدر تفكك ${member.toString()} لأن لهم دورًا أعلى من دورك وبيرمنشنات اعلى منك**__`)
    .setColor(randomColor);
  return message.channel.send({ embeds: [helpEmbed] });
}

    
    // Remove Muted role from member
    try {
      await member.roles.remove(muteRole);
      let successMessage = `__**✅ <@${message.author.id}> تم فك اسكات ${member.toString()}.**__`;
      return message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(successMessage).setColor(randomColor)] });
    } catch (error) {
      console.error(error);
      let errorMessage = `__**❌ لم يتمكن <@${message.author.id}> من إلغاء اسكات ${member.toString()}.**__`;
      return message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(errorMessage).setColor(randomColor)] });
    }
  }
});









//-------------------------------------------------------------------- this is for Giving a role
client.on('messageCreate', async message => {
if (message.author.bot) return;

const requiredRole = message.guild.roles.cache.find(role => role.name === '⋆୨𝐌𝐔𝐓𝐄-𝐓𝐀𝐋𝐊୧⋆ ᵏˢᵖ');

const giveRoleAliases = ['رتبه'];

if (!giveRoleAliases.some(alias => message.content.toLowerCase().startsWith(alias))) {
return;
}

if (!message.member.roles.cache.has(requiredRole.id)) return;

const args = message.content.split(/ +/g).slice(1);

let mentionedUser = message.mentions.members.first();
let userID = '';

if (!mentionedUser) {
userID = args[0]?.replace(/[<@!>]/g, '');
if (message.guild.members.cache.get(userID)) {
mentionedUser = message.guild.members.cache.get(userID);
}
}

if (!mentionedUser) {
const helpEmbed = new Discord.EmbedBuilder()
.setTitle('**Command: giverole**')
.setDescription('**اعطى رول للمستخدم لي مستخدم ثاني.**')
.addFields(
{
name: 'الأختصارات:',
value: giveRoleAliases.map(alias => `${alias}`).join(', ')
},
{
name: 'الاستخدام:',
value: '/role [user] (+/-)[roles names separated by comma]\n/role all (+/-)[role name]'
},
{
name: 'أمثله للأمر:',
value: `/role <@${message.author.id}> Admin\n/role 1234567890 Admin\n/role all members\n/role bots System\n/role humans members`
}
)
.setColor(randomColor);

return message.channel.send({ embeds: [helpEmbed] });
}

let roleNameOrID = args.slice(1).join(' ').toLowerCase();
let roleToGive = null;

if (!roleNameOrID) {
message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setDescription(`__**:rolling_eyes: - لا يمكنني العثور على هذا العضو**__`)
.setColor(randomColor)
]
});
return;
}

// Check if the roleNameOrID is an ID
if (/^\d+$/.test(roleNameOrID)) {
roleToGive = message.guild.roles.cache.get(roleNameOrID);
}

// If it's not an ID or the ID wasn't found, check for a role name match
if (!roleToGive) {
roleToGive = message.guild.roles.cache.find(role => role.name.toLowerCase() === roleNameOrID);
}

// If we couldn't find a match, check for partial matches
if (!roleToGive) {
roleToGive = message.guild.roles.cache.find(role => role.name.toLowerCase().includes(roleNameOrID));
}

if (!roleToGive) {
message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setDescription(`__**:rolling_eyes: - لا يمكنني العثور على الرتبة او العضو الذي تطلبه, يرجى محاولت مراى ثانية.**__`)
.setColor(randomColor)
]
});
return;
}

const mentionedUserRoles = mentionedUser.roles.cache;
const mentionedUserHighestRole = mentionedUserRoles.sort((b, a) => b.position - a.position).first();

if (roleToGive.position >= message.member.roles.highest.position || roleToGive.position <= mentionedUserHighestRole.position) {
  message.channel.send({
    embeds: [
      new Discord.EmbedBuilder()
        .setDescription(`__**:rolling_eyes: - موضع الرتبة ${roleToGive.name} اعلى من رتبتك.**__`)
        .setColor(randomColor)
    ]
  });
  return;
}


// Check if the user has the role already
if (mentionedUser.roles.cache.has(roleToGive.id)) {
message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setDescription(`__**:rolling_eyes: - ${mentionedUser} انت بالفعل تمتلك الرتبه, ${roleToGive.name}**__`)
.setColor(randomColor)
]
});
return;
}
let reason = args.slice(2).join(' ');

if (!reason) {
  reason = `By: ${message.author.tag}`;
} else {
  reason += `, By: ${message.author.tag}`;
}

  
  await mentionedUser.roles.add(roleToGive, reason);

console.log(`Successfully gave role: ${roleToGive.name} to ${mentionedUser.user.tag} by ${message.author.tag}`);
message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setDescription(`__**✅ ${mentionedUser} تم تغيير الرولات, +${roleToGive.name}**__`)
.setColor(randomColor)
]
});
});
client.on('messageCreate', async message => {
if (message.author.bot) return;

const requiredRole = message.guild.roles.cache.find(role => role.name === '⋆୨𝐌𝐔𝐓𝐄-𝐓𝐀𝐋𝐊୧⋆ ᵏˢᵖ');

const unRoleAliases = ['ازاله'];

if (!unRoleAliases.some(alias => message.content.toLowerCase().startsWith(alias))) {
return;
}

if (!message.member.roles.cache.has(requiredRole.id)) return;

const args = message.content.split(/ +/g).slice(1);
let mentionedUser = message.mentions.members.first();
let userID = '';

if (!mentionedUser) {
userID = args[0]?.replace(/[<@!>]/g, '');
if (message.guild.members.cache.get(userID)) {
mentionedUser = message.guild.members.cache.get(userID);
}
}

if (!mentionedUser) {
const helpEmbed = new Discord.EmbedBuilder()
.setTitle('**Command: unrole**')
.setDescription('**إزالة رول من المستخدم.**')
.addFields(
{
name: 'الأختصارات:',
value: unRoleAliases.map(alias => `${alias}`).join(', ')
},
{
name: 'الاستخدام:',
value: '/unrole [user] (+/-)[roles names separated by comma]\n/role all (+/-)[role name]'
},
{
name: 'أمثله للأمر:',
value: `/unrole <@${message.author.id}> Admin\n/role 1234567890 Admin\n/role all members\n/role bots System\n/role humans members`
}
)
.setColor(randomColor);

return message.channel.send({ embeds: [helpEmbed] });
}

let roleNameOrID = args.slice(1).join(' ').toLowerCase();
let roleToRemove = null;

if (!roleNameOrID) {
message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setDescription(`__**:rolling_eyes: - لا يمكنني العثور على الرتبة الذي تريد ازالة من العضو الذي تطلبه, يرجى محاولت مراى ثانية.**__`)
.setColor(randomColor)
]
});
return;
}

// Check if the roleNameOrID is an ID
if (/^\d+$/.test(roleNameOrID)) {
roleToRemove = message.guild.roles.cache.get(roleNameOrID);
}

// If it's not an ID or the ID wasn't found, check for a role name match
if (!roleToRemove) {
roleToRemove = message.guild.roles.cache.find(role => role.name.toLowerCase() === roleNameOrID);
}

// If we couldn't find a match, check for partial matches
if (!roleToRemove) {
roleToRemove = message.guild.roles.cache.find(role => role.name.toLowerCase().includes(roleNameOrID));
}

if (!roleToRemove) {
message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setDescription(`__**:rolling_eyes: - لا يمكنني العثور على هذه الرتبة يوجد خطا ما يرجى محاولت مراى اخراى**__`)
.setColor(randomColor)
]
});
return;
}

// Check if the mentioned user has the role to remove
if (!mentionedUser.roles.cache.has(roleToRemove.id)) {
message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setDescription(`__**:rolling_eyes: - ${mentionedUser}  انت بلفعل لاتمتلك الرتبه الذي تريد سحبها, ${roleToRemove.name}**__`)
.setColor(randomColor)
]
});
return;
}

 // Get the highest role of the author and the mentioned user
  //const authorHighestRole = message.member.roles.highest;
 // const mentionedUserHighestRole = mentionedUser.roles.highest;

  // Check if the role to remove is higher than or equal to the highest role of either the author or the mentioned user
 // if (authorHighestRole.position <= roleToRemove.position || mentionedUserHighestRole.position <= roleToRemove.position) {
 //   message.channel.send({
//embeds: [
//new Discord.EmbedBuilder()
//.setDescription(`**:rolling_eyes: - موضع الرتبة ${roleToRemove.name} اعلى من رتبتك.**`)
//.setColor(randomColor)
//]
//});
//return;
//}
const mentionedUserRoles = mentionedUser.roles.cache;
const mentionedUserHighestRole = mentionedUserRoles.sort((b, a) => b.position - a.position).first();

if (roleToRemove.position >= message.member.roles.highest.position || roleToRemove.position <= mentionedUserHighestRole.position) {
  if (!message.member.roles.cache.has('AdminStrator')) {
    message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setDescription(`__**:rolling_eyes: - موضع الرتبة ${roleToRemove.name} اعلى من رتبتك.**__`)
          .setColor(randomColor)
      ]
    });
    return;
  }
  if (roleToRemove.position <= mentionedUserHighestRole.position) {
    message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setDescription(`__**:rolling_eyes: - ${message.author.toString()} لا يمكنك إلغاء الرتبة ${roleToRemove.name} من 
		  لن لديه دور أعلى من دورك في الرتب.**__`)
		  //${mentionedUser.toString()}
          .setColor(randomColor)
      ]
    });
    return;
  }
}

if (!mentionedUser.roles.cache.has(roleToRemove.id)) {
  message.channel.send({
    embeds: [
      new Discord.EmbedBuilder()
        .setDescription(`__**:rolling_eyes: - ${mentionedUser.toString()} انت بالفعل لا تمتلك هذه الرتبة ${roleToRemove.name}.**__`)
        .setColor(randomColor)
    ]
  });
  return;
}

await mentionedUser.roles.remove(roleToRemove);

    console.log(`Successfully removed role: ${roleToRemove.name} from ${mentionedUser.user.tag} by ${message.author.tag}`);
    message.channel.send({
  embeds: [
    new Discord.EmbedBuilder()
      .setDescription(`__**✅ ${mentionedUser} تم تغيير الرولات, -${roleToRemove.name}**__`)
      .setColor(randomColor)
  ]
});
});

//-------------------------------------------------------------------- this is for Voice Kicking
client.on('messageCreate', async message => {
  const vkickAliases = ['#vkick', 'تت'];
  const regex = new RegExp(`^(${vkickAliases.join('|')})$`, 'i');
  if (!regex.test(message.content)) {
    return;
  }

  const args = message.content.split(/ +/g).slice(1);
  const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

  if (args.length === 0 || !mentionedUser) {
    const helpEmbed = new Discord.EmbedBuilder()
.setTitle('**Command: Voice Kick**')
.setDescription('**طرد المستخدم من القناة الصوتية.**')
.addFields(
{
name: '**الأختصارات**',
value: vkickAliases.map(alias => `${alias}`).join(', ')
},
{
name: '**الاستخدام**',
value: '/#vkick [user mention or ID]'
},
{
name: '**أمثله للأمر:**',
value: `#vkick <@${message.author.id}>`
}
)
.setColor(randomColor);

message.channel.send({ embeds: [helpEmbed] });
return;
}

const voiceChannel = message.member.voice.channel;

if (!voiceChannel) {
const notInVoiceChannelEmbed = new Discord.EmbedBuilder()
.setDescription('__**❌ يجب عليك الانضمام إلى قناة صوتية قبل طرد أي شخص!**__')
.setColor(randomColor);

message.channel.send({ embeds: [notInVoiceChannelEmbed] });
return;
}

const vkickPermissions = [
"MoveMembers"
];

if (!message.member.permissions.has(vkickPermissions)) {
const noPermissionsEmbed = new Discord.EmbedBuilder()
.setDescription('__**❌ ليس لديك الصلاحيات اللازمة لاستخدام هذا الأمر!**__')
.setColor(randomColor);

message.channel.send({ embeds: [noPermissionsEmbed] });
return;
}

if (mentionedUser.permissions.has('KickMembers') || mentionedUser.permissions.has('MoveMembers')) {
if (message.member.roles.highest.comparePositionTo(mentionedUser.roles.highest) <= 0) {
const higherRoleEmbed = new Discord.EmbedBuilder()
.setDescription(`__**❌ لا يمكنك طرد ${mentionedUser}لأنه يمتلك صلاحية اعلى منك!**__`)
.setColor(randomColor);

message.channel.send({ embeds: [higherRoleEmbed] });
return;
}
}

if (mentionedUser.id === message.guild.ownerId) {
const ownerEmbed = new Discord.EmbedBuilder()
.setDescription(`__**❌ لا يمكنك طرد صاحب السيرفر!**__`)
.setColor(randomColor);

message.channel.send({ embeds: [ownerEmbed] });
return;
}

await mentionedUser.voice.setChannel(null);

const voiceChannelName = voiceChannel.name;
const successEmbed = new Discord.EmbedBuilder()
.setDescription(`__**✅ تم طرد ${mentionedUser} من ,${voiceChannelName}!**__`)
.setColor(randomColor);

message.channel.send({ embeds: [successEmbed] });
});


//-------------------------------------------------------------------- this is for Voice dragging
client.on('messageCreate', async message => {
const dragAliases = ['move'];
if (!message.content.toLowerCase().startsWith('move')) {
return;
}

const args = message.content.split(/ +/g).slice(1);
const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

if (args.length === 0 || !mentionedUser) {
const helpEmbed = new Discord.EmbedBuilder()
.setTitle('**Command: Voice Move **')
.setDescription('**سحب المستخدم إلى قناة صوتية أخرى.**')
.addFields(
{
name: '**الأختصارات**',
value: dragAliases.map(alias => `${alias}`).join(', ')
},
{
name: '**الاستخدام**',
value: '/move [user mention or ID]'
},
{
name: '**أمثله للأمر:**',
value: `move <@${message.author.id}>`
}
)
.setColor(randomColor);

message.channel.send({ embeds: [helpEmbed] });
return;
}

const voiceChannel = message.member.voice.channel;

if (!voiceChannel) {
const notInVoiceChannelEmbed = new Discord.EmbedBuilder()
.setDescription('__**❌ يجب عليك الانضمام إلى قناة صوتية قبل سحب أي شخص!**__')
.setColor(randomColor);

message.channel.send({ embeds: [notInVoiceChannelEmbed] });
return;
}

const dragPermissions = [
"MoveMembers", "Administrator"
];

if (!message.member.permissions.has(dragPermissions)) {
const noPermissionsEmbed = new Discord.EmbedBuilder()
.setDescription('__**❌ ليس لديك الصلاحيات اللازمة لاستخدام هذا الأمر!**__')
.setColor(randomColor);

message.channel.send({ embeds: [noPermissionsEmbed] });
return;
}

const intentsvoice = [
'GuildVoice'
];

let dragChannel = message.guild.channels.cache.find(channel => intentsvoice.includes(channel.type) && channel.name === args.slice(1).join(' '));

if (!dragChannel) {
dragChannel = voiceChannel;
}

const mentionedUserVoiceChannel = mentionedUser.voice.channel;

if (mentionedUserVoiceChannel.id === dragChannel.id && args.length === 1) {
const sameChannelEmbed = new Discord.EmbedBuilder()
.setDescription(`__**❌ ${mentionedUser} انت بالفعل موجود في ,${mentionedUserVoiceChannel.name}!**__`)
.setColor(randomColor);

return message.channel.send({ embeds: [sameChannelEmbed] });
}

if (mentionedUser.permissions.has('KickMembers') || mentionedUser.permissions.has('MoveMembers')) {
if (message.member.roles.highest.comparePositionTo(mentionedUser.roles.highest) <= 0) {
const higherRoleEmbed = new Discord.EmbedBuilder()
.setDescription(`__**❌ لا يمكنك سحب ${mentionedUser} لأنه يمتلك صلاحية اعلى منك!**__`)
.setColor(randomColor);

message.channel.send({ embeds: [higherRoleEmbed] });
return;
}
}

if (mentionedUser.id === message.guild.ownerId) {
const ownerEmbed = new Discord.EmbedBuilder()
.setDescription(`__**❌ لا يمكنك سحب صاحب السيرفر!**__`)
.setColor(randomColor);

message.channel.send({ embeds: [ownerEmbed] });
return;
}

const oldVoiceChannel = mentionedUser.voice.channel;
await mentionedUser.voice.setChannel(voiceChannel);

const oldVoiceChannelName = oldVoiceChannel.name;
const voiceChannelName = voiceChannel.name;
const successEmbed = new Discord.EmbedBuilder()
.setDescription(`__**✅ تم سحب ${mentionedUser} من ${oldVoiceChannelName} إلى ${voiceChannelName}!**__`)
.setColor(randomColor);

message.channel.send({ embeds: [successEmbed] });
});



//-------------------------------------------------------------------- this is for Profile using Probot API
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const member = message.mentions.users.first();
//if (!member) {
//message.channel.send("I couldn't find that member. Please try again.");
//return;
//}
const profileAliases = ['P', 'p', '#profile'];
  
    const args = message.content.split(/ +/)
    
    // Check if any of the aliases match
    if (!profileAliases.some(alias => args[0].toLowerCase() === alias)) return;
  
  
  if(args[0] && !args[1]) {
  if (message.channel.type === 'DM' || message.channel.type === 'text') {
  message.channel.startTyping();
  setTimeout(() => {
  message.channel.stopTyping();
  }, Math.random() * (1 - 3) + 1 * 1000);
  }
  message.channel.send({
  files: [
  {
  name: "profile.png",
  attachment: `https://api.probot.io/profile/${message.author.id}?&name=${encodeURIComponent(message.author.username)}`
  }
  ]
  });
  } else if(member) {
  if (message.channel.type === 'DM' || message.channel.type === 'text') {
  message.channel.startTyping();
  setTimeout(() => {
  message.channel.stopTyping();
  }, Math.random() * (1 - 3) + 1 * 1000);
  }
  message.channel.send({
  files: [
  {
  name: "profile.png",
  attachment: `https://api.probot.io/profile/${member?.id}?&name=${encodeURIComponent(member.username)}`
  }
  ]
  });
  } else if(args[1] && !member) {
  client.users.fetch(args[1]).then(user => {
  if (message.channel.type === 'DM' || message.channel.type === 'text') {
  message.channel.startTyping();
  setTimeout(() => {
  message.channel.stopTyping();
  }, Math.random() * (1 - 3) + 1 * 1000);
  }
  message.channel.send({
  files: [
  {
  name: "profile.png",
  attachment: `https://api.probot.io/profile/${user.id}?&name=${encodeURIComponent(user.username)}`
  }
  ]
  });
  });
  }
  });



//const fetch = require('node-fetch');

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const member = message.mentions.users.first();

  const profileAliases = ['P1', 'p1'];
  const args = message.content.split(/ +/);

  // Check if any of the aliases match
  if (!profileAliases.some(alias => args[0].toLowerCase() === alias)) return;

  // Defer the reply to avoid timing out the command
  const initialReply = await message.reply('Processing request. Please wait...');

  if(args[0] && !args[1]) {
    const response = await fetch(`https://api.probot.io/profile/${message.author.id}?&name=${encodeURIComponent(message.author.username)}`);
    const buffer = await response.buffer();
    const attachment = new Discord.AttachmentBuilder(buffer, { name: 'profileramy.png' });

    const messageObject = {
      files: [attachment]
    };

    await message.channel.send(messageObject);
  } else if(member) {
    const response = await fetch(`https://api.probot.io/profile/${member?.id}?&name=${encodeURIComponent(member.username)}`);
    const buffer = await response.buffer();
    const attachment = new Discord.AttachmentBuilder(buffer, { name: 'profileramy.png' });

    const messageObject = {
      files: [attachment]
    };

    await message.channel.send(messageObject);
  } else if(args[1] && !member) {
    client.users.fetch(args[1]).then(async user => {
      const response = await fetch(`https://api.probot.io/profile/${user.id}?&name=${encodeURIComponent(user.username)}`);
      const buffer = await response.buffer();
      const attachment = new Discord.AttachmentBuilder(buffer,{ name: 'profileramy.png' });

      const messageObject = {
        files: [attachment]
      };

      await message.channel.send(messageObject).then(async reply => {
        // Create an embed with the sent image
        const embed = new Discord.EmbedBuilder()
          .setTitle("Profile Picture")
          .setImage(`https://media.discordapp.net/attachments/${reply.channel.id}/${reply.id}/${attachment.name}`);

        // Send a follow-up message with the embedded image
        const followUpMessage = await message.reply('Here\'s the profile picture you requested:', { embeds: [embed] });
      });
    });
  }

  // Delete the initial reply
  await initialReply.delete();
});







































//-------------------------------------------------------------------- this is for Rank using Probot API
client.on('messageCreate', async message => {
  const rankAliases = ['rank', '#rank', '#iD'];
  const args = message.content.split(/ +/);

  // Check if any of the aliases match
  if (!rankAliases.some(alias => args[0].toLowerCase() === alias)) return;

  let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;

  if (!member) {
    message.channel.send("I couldn't find that member. Please try again.");
    return;
  }
  
  
  

if(args[0] && !args[1]) {
if (message.channel.type === 'DM' || message.channel.type === 'text') {
message.channel.startTyping();
setTimeout(() => {
message.channel.stopTyping();
}, Math.random() * (1 - 3) + 1 * 1000);
}
message.channel.send({
files: [
{
name: "rank.png",
attachment: `https://api.probot.io/rank/${message.guild.id}/${member.user.id}/?rank,png&name=${encodeURIComponent(member.user.username)}`
}
]
});
} else if(member) {
if (message.channel.type === 'DM' || message.channel.type === 'text') {
message.channel.startTyping();
setTimeout(() => {
message.channel.stopTyping();
}, Math.random() * (1 - 3) + 1 * 1000);
}
message.channel.send({
files: [
{
name: "rank.png",
attachment:  `https://api.probot.io/rank/${message.guild.id}/${member.user.id}/?rank,png&name=${encodeURIComponent(member.user.username)}`
}
]
});
} else if(args[1] && !member && !args[2]) {
client.users.fetch(args[1]).then(user => {
if (!user) {
message.channel.send("I couldn't find that user. Please try again.");
return;
}
if (message.channel.type === 'DM' || message.channel.type === 'text') {
message.channel.startTyping();
setTimeout(() => {
message.channel.stopTyping();
}, Math.random() * (1 - 3) + 1 * 1000);
}
message.channel.send({
files: [
{
name: "rank.png",
attachment: `https://api.probot.io/rank/${message.guild.id}/${member.user.id}/?rank,png&name=${encodeURIComponent(member.user.username)}`
}
]
});
});
}
});

/*
//-------------------------------------------------------------------- this is for user output using Probot API
client.on('messageCreate', async message => {
if (message.content.startsWith("u")) {
let member = message.mentions.members.first() || message.member;
let joinDiscordDate = new Date(member.user.createdTimestamp);
let joinServerDate = new Date(member.joinedTimestamp);
let guildInvites = await message.guild.invites.fetch();
let inviter = guildInvites.find(invite => invite.inviter.id === member.user.id);
let inviterName = inviter ? inviter.inviter.username : "Unknown";

const embed = new Discord.EmbedBuilder()
.setColor("#7289da")
.setThumbnail(member.user.displayAvatarURL({ format: 'png', size: 256 }))
.addFields(
{ name: "تاريخ الدخول للديسكورد:", value: joinDiscordDate.toDateString(), inline: true },
{ name: "تاريخ الدخول للسيرفر:", value: joinServerDate.toDateString(), inline: true },
{ name: "تم دعوتة بواسطة:", value: inviterName }
);

if (member.user.username && member.user.displayAvatarURL()) {
embed.setAuthor({ name: member.user.username,iconURL: member.user.displayAvatarURL()})
}

message.channel.send({ embeds: [embed] });
}
});
**/
let channel_girls = "997650728246059068";
let channel_general = "572800136623947809";
//-------------------------------------------------------------------- this is a game caled Mafia, and Rolet
const admin_roles = ['⋆୨𝐌𝐔𝐓𝐄-𝐓𝐀𝐋𝐊୧⋆ ᵏˢᵖ']; // Role names allowed to use the commands
const channel_prefixes = [channel_girls, channel_general];

client.on("messageCreate", async message => {
  if (!message.guild || message.author.bot) return;

  let args = message.content.split(" ");
  if (args[0] === "مافيا") {
    if (!message.member.roles.cache.some(role => admin_roles.includes(role.name))) {
      console.log('User does not have the required roles to use this command.');
      return;
    }
    if (!channel_prefixes.some((prefix) => message.channel.id === prefix)) {
  console.log(`This command can only be used in channels with ID "${channel_prefixes.join(", ")}".`);
  return;
}
    require("./mafia")(message);
  } else if (args[0] === "روليت") {
    if (!message.member.roles.cache.some(role => admin_roles.includes(role.name))) {
      console.log('User does not have the required roles to use this command.');
      return;
    }
    if (!channel_prefixes.some((prefix) => message.channel.id === prefix)) {
  console.log(`This command can only be used in channels with ID "${channel_prefixes.join(", ")}".`);
  return;
}
    require("./roulette")(message);
  }
});


//let sug = ['1089401234311630928','','']; كود نستعمله بي الغرف بعدين
let link = "https://im2.ezgif.com/tmp/ezgif-2-88b86095e1.gif";//رابط الخط
//=================================

//-------------------------------------------------------------------- this is the method of getting emoji from server, bot has to be inside the sever also.
const emoji1 = "<a:ramy3:1088633226702102618>" // كود الايموجي ملحضه السيرفر لزم يكون داخل للسيرفر عشان ياخذ الايموجي
// طريقة سحب الايموجيات
//`emoji
//`



//-------------------------------------------------------------------- this is for GPT, can Translate all langauges, uses Arabic as the main output.
module.exports = client;
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
  organization: "org-iXfDHPooDGCNq5jAC4jkz7aT",
});
const openai = new OpenAIApi(configuration);
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const response = await openai.listEngines();
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith('!')) return;
  if (message.content.includes('here')) return message.reply('__**يازفت لاتحاول معايا تخليني امنشن here**__');
  if (message.content.includes('everyone')) return message.reply('__**يازفت لاتحاول معايا تخليني امنشن everyone**__');
  if (message.content.includes('@')) return message.reply('__**يازفت لايمكنك تمنشن عضو هنا**__');
  if (message.content.includes('هير')) return message.reply('__**يازفت لاتحاول معايا تخليني امنشن هير**__');
  if (message.content.includes('ايفريون')) return message.reply('__**يازفت لاتحاول معايا تخليني امنشن ايفريون**__');
  if (message.content.includes('@')) return message.reply('__**يازفت لايمكنك تمنشن عضو هنا**__');
  if (message.content.includes('هاك')) return message.reply('__**يازفت لايمكنك تتكلم عن هاك هنا**__');
  if (message.content.includes('هاكات')) return message.reply('__**يازفت لايمكنك تتكلم عن هاكات هنا**__');
  if (message.content.includes('هكر')) return message.reply('__**يازفت لايمكنك تتكلم عن هكر هنا**__');

  let conversationLog = [{ role: 'system', content: 'You are a friendly chatbot.' }];
try {
  await message.channel.sendTyping();
  let prevMessages = await message.channel.messages.fetch({ limit: 15 });
  prevMessages = Array.from(prevMessages.values()).reverse();
  prevMessages.forEach((msg) => {
    if (message.content.startsWith('!')) return;
    if (msg.author.id!== client.user.id && message.author.bot) return;
    if (msg.author.id!== message.author.id) return;
    const member21 = message.mentions.members.first() || message.member;
    if (!member21) return message.channel.send('No member mentioned.');
  });
  conversationLog.push({
    role: 'user',
    content: message.content,
  });

  // Retry logic function
  const retry = async (delay, retries) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      // You need to replace this with your own logic to call the OpenAI API
      const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        total_tokens: 2048,
        temperature: 0.9,
        presencePenalty: 0.6,
        timeout: 60000, // Increase the timeout value to 60 seconds
      });

      if (!result.choices || result.choices.length === 0) {
        throw new Error('No choices returned from OpenAI API');
      }

      const generatedResponse = result.choices[0].message.content;
      console.log('Initial response:', generatedResponse);
      // Send the initial response to the user using Discord API method
      const embed = new EmbedBuilder()
       .setColor(randomColor)
       .setThumbnail(message.guild.iconURL())
       .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
       .setDescription(`__**${generatedResponse}**__`)
       .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
       .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
        console.log(`OPENAI ERR: ${error}`);
        const embed = new EmbedBuilder()
          .setColor(randomColor)
          .setThumbnail(message.guild.iconURL())
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
          .setDescription(`__**أُووبس! لقد انتهت صلاحية الكود ولا يعمل. الرجاء معاودة المحاولة في وقت لاحق.**__\n\n   __**${error}**__  `)
          .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
          .setTimestamp();

      message.channel.send({ embeds: [embed] });
    }
  }
  retry(5000, 3);
} catch (error) {
  console.error(error);
}
      async function handleTranslation(message, result) {
        try {
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel('اضغط عليا للترجمه')
                .setCustomId('translate')
            );
  
        const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('اضغط عليا للترجمه')
            .setDisabled(true)
            .setCustomId('translate')
        );
  
        const embed = new EmbedBuilder()
        .setColor(randomColor)
        .setThumbnail(message.guild.iconURL())
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
        .setDescription(`__**${result.data.choices[0].message.content}**__`)
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        .setTimestamp();
  
      const re = await message.reply({
        embeds: [embed],
        components: [row]
      });
  
      const collector = re.createMessageComponentCollector({
        time: 10000
      });
  
      const first = message.member;
      if (!first) return;
  
      collector.on('collect', async (i) => {
        if (i.customId == 'translate') {
          const t_from = 'auto';
          const t_to = 'ar';
          const translated = await translate(result.choices[0].message.content, { from: t_from, to: t_to });
          const boldedText = `__**${translated.text}**__`;
          const translationEmbed = new EmbedBuilder()
          .setColor(randomColor)
          .setDescription(boldedText)
          .setThumbnail(message.guild.iconURL())
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
          .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
          .setTimestamp();
  
          i.reply({ embeds: [translationEmbed] });
        }
      });
  
      collector.on('end', async (i) => {
        re.edit({
          embeds: [embed],
          components: [row2]
        });
      });
    } catch (error) {
      console.log(`ERR: ${error.stack}`);
    }
  }
});

//-------------------------------------------------------------------- this is for Changing Color in a role, every 30 seconds
// كود الرتبه تتغير كل 6 ثواني
const colors1 = [
// List of colors to cycle through - add as many colors as you want
'#FF0000', // Red
'#00FF00', // Green
'#0000FF', // Blue
'#FFFF00', // Yellow
'#FF00FF', // Magenta
'#00FFFF', // Cyan
'#FFA500', // Orange
'#800080', // Purple
'#FFC0CB', // Pink
'#000000', // Black
'#808080', // Gray
'#FFFFFF', // White
'#FF5733', // Deep Orange
'#3D0C02', // Maroon
'#00539C', // Dark Blue
'#F5DEB3', // Wheat
'#720000', // Crimson
'#8E44AD', // Purple
'#F1948A', // Light Salmon
'#6E2C00', // Rust
'#6B8E23', // Olive Drab
'#8B4513', // Saddle Brown
'#FF5733', // Deep Orange
'#7FFF00', // Chartreuse
'#A9A9A9', // Dark Gray
'#FFD700', // Gold
'#FF6347', // Tomato
'#228B22', // Forest Green
'#8B008B', // Dark Magenta
'#FF1493', // Deep Pink
'#4B0082', // Indigo
'#7CFC00', // Lawn Green
'#8B0000', // Dark Red
'#8FBC8F', // Dark Sea Green
'#9400D3', // Dark Violet
'#FFB6C1', // Light Pink
'#FFA07A', // Light Salmon
'#FFDAB9', // Peach Puff
'#EEE8AA', // Pale Goldenrod
'#B0C4DE', // Light Steel Blue
'#A0522D', // Sienna
'#BC8F8F', // Rosy Brown
'#D2B48C', // Tan
'#1E90FF', // Dodger Blue
'#FFC0CB', // Pink
'#9ACD32', // Yellow Green
'#696969', // Dim Gray
'#FF1493', // Deep Pink
'#ADD8E6', // Light Blue
'#FFFFE0', // Light Yellow
'#FAFAD2', // Light Goldenrod Yellow
'#BEBEBE', // Gray
'#FFDAB9', // Peach Puff
'#6495ED', // Cornflower Blue
'#FFFACD', // Lemon Chiffon
'#A9A9A9', // Dark Gray
'#FA8072', // Salmon
'#BDB76B', // Dark Khaki
'#00CED1', // Dark Turquoise
'#FFA500', // Orange
'#EEE8AA', // Pale Goldenrod
'#FF69B4', // Hot Pink
'#00FFFF', // Aqua
'#20B2AA', // Light Sea Green
'#F08080', // Light Coral
'#FFEFD5', // Papaya Whip
'#00BFFF', // Deep Sky Blue
'#000080', // Navy
'#FF6347', // Tomato
'#DA70D6', // Orchid
'#CD853F', // Peru
'#FFC3A0', // Melon
'#00FA9A', // Medium Spring Green
'#FF00FF', // Fuchsia
'#4682B4', // Steel Blue
'#FF1493', // Deep Pink
'#6A5ACD', // Slate Blue
'#9370DB', // Medium Purple
'#468499', // Steel Teal
'#FF8C69', // Salmon
'#DAA520', // Goldenrod
'#9AC0CD', // Sky Blue
'#5F9EA0', // Cadet Blue
'#BCD2EE', // Light Steel Blue
'#FFC1CC', // Pink
'#00FA9A', // Medium Spring Green
'#FFAEB9', // Light Pink
'#B0E0E6', // Powder Blue
'#FF7F50', // Coral
'#F5F5DC', // Beige
'#FFA07A', // Light Salmon
'#7B68EE', // Medium Slate Blue
'#FAEBD7', // Antique White
'#6B8E23', // Olive Drab
'#00BFFF', // Deep Sky Blue
'#FFDAB9', // Peach Puff
'#D3D3D3', // Light Grey
'#00CED1', // Dark Turquoise
'#696969', // Dim Grey
'#F0E68C', // Khaki
'#9400D3', // Dark Violet
'#CD853F', // Peru
'#FFE4B5', // Moccasin
'#FFDEAD', // Navajo White
'#B0C4DE', // Light Blue
'#9ACD32', // Yellow Green
'#696969', // Dim Gray
'#ADD8E6', // Light Blue
'#FFFFE0', // Light Yellow
'#FAFAD2', // Light Goldenrod Yellow
'#BEBEBE', // Gray
'#6495ED', // Cornflower Blue
'#FFFACD', // Lemon Chiffon
'#FA8072', // Salmon
'#BDB76B', // Dark Khaki
'#00CED1', // Dark Turquoise
'#EEE8AA', // Pale Goldenrod
'#FF69B4', // Hot Pink
'#00FFFF', // Aqua
'#20B2AA', // Light Sea Green
'#F08080', // Light Coral
'#FFEFD5', // Papaya Whip
'#00BFFF', // Deep Sky Blue
'#000080', // Navy
'#FF6347', // Tomato
'#DA70D6', // Orchid
'#CD853F', // Peru
'#FFC3A0', // Melon
'#00FA9A', // Medium Spring Green
'#FF00FF', // Fuchsia
'#4682B4', // Steel Blue
'#FF1493', // Deep Pink
'#CD5C5C', // Indian Red
'#FFA07A', // Light Salmon
'#FF8C00', // Dark Orange
'#9ACD32', // Yellow Green
'#2E8B57', // Sea Green
'#6B8E23', // Olive Drab
'#FF69B4', // Hot Pink
'#6A5ACD', // Slate Blue
'#00FF7F', // Spring Green
'#8B0000', // Dark Red
'#A0522D', // Sienna
'#008B8B', // Dark Cyan
'#3CB371', // Medium Sea Green
'#8B4513', // Saddle Brown
'#FFDAB9', // Peach Puff
'#000080', // Navy
'#8FBC8F', // Dark Sea Green
'#FFB6C1', // Light Pink
'#D2691E', // Chocolate

];
const roleName = '⋆୨𝐌𝐞𝐦𝐛𝐞𝐫୧⋆ ᵏˢᵖ';
const guildId1 = '572800136132952065';

// Add random colors to the list until it has at least 50 colors
while (colors1.length < 50) {
const randomColor = Math.floor(Math.random() * 16777215).toString(16);
colors1.push(`#${randomColor}`);
}

let currentColor = colors1[Math.floor(Math.random() * colors1.length)];
let cycleStopped = false;

client.on('ready', async () => {
// Get the guild and role by name
const guild1 = client.guilds.cache.get(guildId1);
const role = guild1.roles.cache.find(r => r.name === roleName);

if (!role) {
console.error('Could not find role with specified name.');
return;
}

console.log(`Starting color cycle for role ${role.name}`);

while (true) {
// Get the next random color and change the role color
const nextColorIndex = colors1.indexOf(currentColor) + 1;
const nextColor = (nextColorIndex < colors1.length) ? colors1[nextColorIndex] : colors1[0];
role.setColor(nextColor)
.then(updatedRole => {
currentColor = nextColor;
//   console.log(`Changed role color to ${updatedRole.hexColor}`);
cycleStopped = false;
})
.catch(error => {
console.error(`Error changing role color: ${error}`);
cycleStopped = true;
});

// If we've cycled through all the colors, reset the index and wait 10 minutes before starting again
if (currentColor === colors1[colors1.length - 1]) {
//   console.log('Cycled through all colors - resetting in 10 minutes');
setTimeout(() => {
currentColor = colors1[Math.floor(Math.random() * colors1.length)];
}, 600000);
}

// Check if the cycle has stopped and restart if necessary
if (cycleStopped) {
console.log('Color cycling has stopped - restarting in 1 minute');
await new Promise(resolve => setTimeout(resolve, 60000));
cycleStopped = false;
}

// Wait for 1 minute before changing colors again
await new Promise(resolve => setTimeout(resolve, 60000));
}
});


//-------------------------------------------------------------------- this is for Log Channel of Color Change or Edit Rules
client.on('ready', (message) => {
logChannel = client.channels.cache.find(channel => channel.name.toLowerCase() === '⊰║˚₊·-͟͟͞test');

if (!logChannel) {
console.error('Unable to find the role log channel!');
} else {
console.log(`Role log channel set to ${logChannel.name}`);
}
});
client.on('roleUpdate', (oldRole, newRole,message) => {

if (oldRole.color !== newRole.color && logChannel) {
newRole.guild.fetchAuditLogs({ type: 31, limit: 1 })
.then(auditLogs => {
const roleLog = auditLogs.entries.first();
if (roleLog) {
const logEmbed = new Discord.EmbedBuilder()

//.setTitle(`${newRole.guild.name}`,{text: newRole.guild.iconURL()})
.setColor(newRole.color)
.setAuthor({ name: `${newRole.guild.name}`, iconURL: newRole.guild.iconURL()})
.setDescription(`**تم تحديث الرتبة** \`${newRole.name}\` 👨‍👨‍👦 .`)
.addFields(
{ name: "📅 Old Color:", value: `#${oldRole.color.toString(16).toUpperCase()}`, inline: true },
{ name: "👑 New Color:", value: `#${newRole.color.toString(16).toUpperCase()}`, inline: true },
{             name: "👥 Modified By:", value: roleLog.executor.toString(), inline: true },
)
.setFooter({ text: `${newRole.client.user.tag}`, iconURL: `${newRole.client.user.avatarURL()}` })
.setTimestamp();

logChannel.send({ embeds: [logEmbed] });
}
})
.catch(console.error);
}
});



//-------------------------------------------------------------------- this is for Names, when writing any name, the name will provide a message
/* client.on("messageCreate", async (message) => {
//if (message.author.bot) return;
//if (message.content.startsWith("ahmed")) { // هنا اوامر الاسماء
//const first = message.member

//if (!first) return;

// const second = `<@606099560854585365>` // هنا لزم كل شخص يمنشن على شخص الي طلبه
//message.channel.send(`${emoji1} **__𝕎𝔼𝕃ℂ𝕆𝕄𝔼 𝕋𝕆 𝕆𝕌ℝ 𝕊𝔼ℝ𝕍𝔼ℝ__**${emoji1}\n\n ${emoji1}**__𝔻𝕆ℕ'𝕋 𝔽𝕆ℝ𝔾𝔼𝕋 𝕋𝕆 𝕋𝔸𝕂𝔼 𝕐𝕆𝕌ℝ ℝ𝕌𝕃𝔼𝕊__**${emoji1} \n\n //${emoji1}**__𝔼ℕ𝕁𝕆𝕐__**   ${emoji1}\n\n${emoji1}${second}${emoji1}\n\n${emoji1}${first}${emoji1}`)
//message.channel.send("https://im2.ezgif.com/tmp/ezgif-2-88b86095e1.gif") // الفيديو لزم يكون داىا mp4 مايدعم غير صيغه
//}
//})
//=================================
//let link1 = "https://imgur.com/b91qvBg";//رابط الخط
//=================================

const emoji2 = "<a:RZ115:932763337945645096>"// كود الايموجي ملحضه السيرفر لزم يكون داخل للسيرفر عشان ياخذ الايموجي
const emoji3 = "<a:RZ111:932728590699724880>" // كود الايموجي ملحضه السيرفر لزم يكون داخل للسيرفر عشان ياخذ الايموجي
/** */
// طريقة سحب الايموجيات
//`emoji
//`
//================================= // كود ردود الاسماء كل شخص
//client.on("messageCreate", async (message) => {
//   if (message.author.bot) return;
//    if (message.content.startsWith("شهد")) { // هنا اوامر الاسماء
//     const first = message.member

//      if (!first) return;

//     const second = `<@836552094391599114>` // هنا لزم كل شخص يمنشن على شخص الي طلبه
//       message.channel.send(`${emoji2}  **__عَيناها تقنع المُلحدين بأن الله قَد أبدع،__**  ${emoji2}\n\n ${emoji3} ${second} ${emoji3}\n\n ${emoji3} //${first} ${emoji3} \n ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|${link1}`)
//message.channel.send("https://imgur.com/b91qvBg") // الفيديو لزم يكون داىا mp4 مايدعم غير صيغه
//}
//})
//---------------------------------------------------------------------------------------------
const emoji4 = "<a:1LoVe8:791802541544308737>"// كود الايموجي ملحضه السيرفر لزم يكون داخل للسيرفر عشان ياخذ الايموجي
const emoji5 = "<a:1LoVe9:791802506723852308>" // كود الايموجي ملحضه السيرفر لزم يكون داخل للسيرفر عشان ياخذ الايموجي
// طريقة سحب الايموجيات
//`emoji
//`
//================================= // كود ردود الاسماء كل شخص
client.on('messageCreate', async message => {
  const vkickAliases = ['#vkick', 'تت'];
  if (!message.content.toLowerCase().startsWith('#vkick') && !message.content.toLowerCase().startsWith('تت') && message.content !== 'تت') {
    return;
  }

  const args = message.content.split(/ +/g).slice(1);
  const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

  if ((args.length === 0 || !mentionedUser) && message.content !== 'تتزكروني') {
          return;
        }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`${emoji4}${emoji4}  **__عَ ـلَيّكَمِـ آلَسًـلَآمِـ وُرَحً ـمِـهِ آلَلَهِ وُبّـرَكَآتُهِ__**  ${emoji5}${emoji5}${emoji5}\n\n${emoji5}${emoji5}**__آهہ‏‏لآ وسـهہ‏‏لآ نورتنا__**${emoji4}${emoji4} \n\n${first} __يـــا__\n `)
    });
    //--------------------------------------------------------------------------------------
    let link2 = "https://discord.gg/685g9HduPd";//رابط الخط
    //=================================
    
    const emoji20 = "<a:G64:932944364836110386>"// كود الايموجي ملحضه السيرفر لزم يكون داخل للسيرفر عشان ياخذ الايموجي
    //`emoji
    //`
    //================================= // كود ردود الاسماء كل شخص
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("رابط")) { // هنا اوامر الاسماء
        if (message.content !== 'رابط') {
            return;
              }
              
              const args = message.content.split(/ +/);
              if (args.length > 2) {
                return;
              }
      const first = message.member
    
    if (!first) return;
    
    message.channel.send(`${emoji20}  **__تفضل يغالي هذا رابط سيرفرنا،__**  ${emoji20}\n\n${first}\n ${link2}`)
    //message.channel.send("https://imgur.com/b91qvBg") // الفيديو لزم يكون داىا mp4 مايدعم غير صيغه
    });
    //client.on("messageCreate", async (message) => {
    //   if (message.author.bot) return;
    //   if (message.content.startsWith("./")) { // هنا اوامر الاسماء 
    //     const first = message.member
    
    //     if (!first) return;
    //   message.channel.send(`**__لابربك 😮 شنو هااي🤔__**\n\n${first}\n `)
    //}
    //})
    //---------------------------------------------------------------------------------------------
    //جميع كودات الكلمات هنا لي السيرفر معا الستايل وكل شي
    
    const emoji6 = "<a:Y12:845333494959833138>"// كود الايموجي ملحضه السيرفر لزم يكون داخل للسيرفر عشان ياخذ الايموجي
    const emoji7 = "<a:1LoVe9:791802506723852308>"
    const emoji8 = "<a:Y12:845333494959833138>"
    const emoji9 = "<a:Saud0000:705991673364217857>"
    const emoji10 = "<a:Saud000:705991716435394560>"
    const emoji11 = "<a:Saud00:705991830566600805>"
    const emoji12 = "<a:Saud0:705991870144184392>"
    const emoji13 = "<:EE4:691917893968855101>"
    const emoji14 = "<a:Saud6:685696563573555271>"
    const emoji15 = "<a:B73:685580833926807583>"
    const emoji16 = "<a:B70:684560694682845257>"
    const emoji17 = "<a:G923:762765401138004019>"
    const emoji18 = "<a:O21:750747332034822188>"
    const emoji19 = "<a:U1:681301202666782844>"
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (message.content !== '.') {
            return;
              }
              
              const args = message.content.split(/ +/);
              if (args.length > 2) {
                return;
              }
        
          const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`**__لابربك 😮 شنو هااي🤔__**\n\n${first}\n`) },
    { content: (`**__تعرف وين تحطهـــــــــــــا؟ ولا يعلمك سعــــود!__**\n\n${first}\n `) },
    { content: (`**  ${emoji8}__بُځآطُريُ أقٌوُلُڪ وُيُنْ تْحطُﮩآ.. بُڛ لُعٌيُوُنْ آلُمْڊيُر بُڛڪتْ__${emoji8}  **\n\n${first}\n `) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    const emoji80 = "<a:Saud6:685696563573555271>"
    
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
    //if (message.content.startsWith('سعود')) {
        if (message.content !== 'سعود') {
                return;
              }
              
              const args = message.content.split(/ +/);
              if (args.length > 2) {
                return;
              }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`__**تفضل يا الغالي**__:blush:\n** __اذا ما رد عليك سعود.. راح يرد عليك أدمن بالنيابه عنه__**:zap:\n\n${first}\n`) },
    { content: (`${emoji13}__**تفضل حبيبي .. اذا ما رد عليك راح يرد عليك اداره بالنيابه عنه**__${emoji13}\n\n${first}\n `) },
    { content: (`__**:heart:ابشر :heart:حبيبي:heart:**__\n__**اذا ما رد عليك سعود.. راح يرد عليك أدمن بالنيابه عنه :zap:**__\n\n ${first}`) },
    { content: (`   __** قول والله:anger_right:مرتين :joy:**__    \n** __اذا ما رد عليك سعود.. راح يرد عليك أدمن بالنيابه عنه__**:zap:\n\n${first}\n`) },
    { content: (`${emoji80}__** عَّـيٌّـوّنِّ ๛ـعَّـوّدٌّ**____${emoji80}\n\n${first}\n `) },
    { content: (`${emoji9}${emoji10}${emoji11}${emoji12}`) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    
    const emoji81 = "<a:Y0:758211951254831123>";
    const emoji82 = "<a:B78:685687960406196237>";
    const emoji83 = "<a:Saud2:703670338592178257>";
    
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
      if (message.content !== 'روح') {
        return;
      }
      
      const args = message.content.split(/ +/);
      if (args.length > 2) {
        return;
      }
    
      const first = message.member;
      if (!first) {
        return;
      }
      
      const outputArray = [
        { content: (`${emoji81} __**روووووووووح**__ ${emoji81}\n\n${first}\n `) },
        { content: (`${emoji81} __**بربك:clap::point_down::joy: رووووووووووووووووووووووح**__ ${emoji81}\n\n${first}\n `) },
        { content: (`${emoji81} __**ولك :point_left:رووووووووووووووووح:ok_hand::joy:**__ ${emoji81}\n\n${first}\n `) },
        { content: (`${emoji81} __**راحت :joy: روحك**__ ${emoji81}\n\n${first}\n `) },
        { content: (`${emoji82} __** ۅلـ☻ـکــ   رۅۅۅۅۅۅۅحـ☻ـ **__ ${emoji82}\n\n${first}\n `) },
        { content: (`${emoji83} __** ولكــ رووووح يا خالـــــي **__ ${emoji83}\n\n${first}\n `) },
      ];
      const randomIndex = Math.floor(Math.random() * outputArray.length);
      const randomOutput = outputArray[randomIndex];
      message.channel.send(randomOutput);
    });
    
    const emoji84 = "<a:Y1:919075337697103953>"
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
    //if (message.content.startsWith('وينك')) {
      if (message.content !== 'وينك') {
        return;
      }
      
      const args = message.content.split(/ +/);
      if (args.length > 2) {
        return;
      }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`__** ✈ مسافر :airplane: عوفني ✈**__\n\n${first}\n `) },
    { content: (`${emoji84} __** أقولك :zap: وين؟ **__ ${emoji84}\n\n${first}\n `) },
    { content: (`__** ❤ دلل ❤ **__ \n\n${first}\n `) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content !== 'السلام عليكم' && message.content !== 'سلام عليكم') {
      return;
    }
  const args = message.content.split(/ +/);
      if (args.length > 2) {
        return;
      }
        const first = message.member;
        if (!first) return;
        message.channel.send(`${emoji4}${emoji4}  **__عَ ـلَيّكَمِـ آلَسًـلَآمِـ وُرَحً ـمِـهِ آلَلَهِ وُبّـرَكَآتُهِ__**  ${emoji5}${emoji5}${emoji5}\n\n${emoji5}${emoji5}**__آهہ‏‏لآ وسـهہ‏‏لآ نورتنا__**${emoji4}${emoji4} \n\n${first} __يـــا__`);
    });
    
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("يا بشر")) { // هنا اوامر الاسماء 
    if (message.content !== 'يا بشر') {
        return;
      }
      
      const args = message.content.split(/ +/);
      if (args.length > 2) {
        return;
      }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`__** اذا محد رد يعني ما اعتقد إنهم بشر :zap:**__\n\n${first}\n `)
    });
    const emoji85 = "<a:O42:773876338788532285>"
    const emoji86 = "<a:B77:685687920815767651>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("باي")) { // هنا اوامر الاسماء 
    if (message.content !== 'باي') {
        return;
      }
      
      const args = message.content.split(/ +/);
      if (args.length > 2) {
        return;
      }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`||__** ${emoji85}   روحه     بلا     رده  ${emoji85} **__||\n\n${first}\n `) },
    { content: (`${emoji85}`) },
    { content: (`__**${emoji86} آلْـَلْـَھ ۈﭜآﮗ ${emoji86}**__ \n\n${first}\n `) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    
    const emoji87 = "<a:U1:681301202666782844>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("هاي")) { // هنا اوامر الاسماء 
        if (message.content !== 'هاي') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`__** ${emoji87} هـ☻ــــــــــآيـ☻ــــــــآتـ☻ ${emoji87}**__\n\n__**${emoji87} مـ,ـنـ,ـۅر آلـ,ـډنـ,ـيـ,ـآ ${emoji87}**__\n\n${first}\n `)
    });
    
    const emoji90 = "<a:1LoVe7:726039734198992976>"
    const emoji91 = "<a:B84:692454809596461066>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("شعار")) { // هنا اوامر الاسماء 
    if (message.content !== 'شعار') {
        return;
      }
      
      const args = message.content.split(/ +/);
      if (args.length > 2) {
        return;
      }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`__**${emoji90}تفضل هذا شعار السيرفر ${emoji90}\n${emoji91}**__\n\n**『KSP』**\n\n${emoji91}\n\n${first}\n `)
    });
    
    
    const emoji88 = "<a:G909:746823903229509733>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content !== 'الو') {
        return;
      }
      
      const args = message.content.split(/ +/);
      if (args.length > 2) {
        return;
      }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`__**${emoji88}كاااااافي الو .. الجهاز مغلق .. شقيتنــا شق${emoji88}**__\n\n${first}\n `)
    });
    
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
    //if (message.content.startsWith('برب')) {
        if (message.content !== 'برب') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`${emoji14} __**Tـ☻ــــــيـ☻ــــــTـ☻ــــ**__${emoji14}\n\n\n${first}\n`) },
    { content: (`${emoji15}__**لآ تطٌول آلغيِبهـ عٍليِنآ .. آجُلدگ يِآ آلبيِض**__${emoji15}\n\n${first}\n `) },
    { content: (`__**:zap: فديت العنقريزي :zap:**__\n\n__**:zap: تيت  :zap:**__\n\n${first}\n\n`) },
    { content: (`${emoji16}__**امَشَيَ اطَلَعَ بَرَا**__${emoji16}\n\n${first}\n\n`) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
    //if (message.content.startsWith('بيض')) {
        if (message.content !== 'بيض') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`__**لك نييص :rolling_eyes:اكعد راحه:joy::joy:**__\n\n\n${first}\n`) },
    { content: (`__**انت:egg: البيض لا :egg:تلزك**__\n\n${first}\n `) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
    //if (message.content.startsWith('باك')) {
        if (message.content !== 'باك') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`${emoji17}__**   وُلُڪمْ بُآآآآآڪ يُآ مْعٌوُڊ  **__${emoji17}\n\n\n${first}\n`) },
    { content: (`${emoji19}__** وُلَكَمِـ بّـآكَ مِـنٌوُرَ آلَدُنٌيّآ **__${emoji19}\n\n${first}\n `) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
    //if (message.content.startsWith('سعود6')) {
        if (message.content !== 'سعود6') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`${emoji18}`)
    });
    
    const emoji94 = "<a:O78:819931760926261311>"
    const emoji95 = "<a:O80:820666350090584093>"
    const emoji96 = "<:G187:945667655594033182>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("سبام")) { // هنا اوامر الاسماء 
        if (message.content !== 'سبام') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`${emoji94} ${emoji96} ${emoji95}`)
    });
    
    const emoji97 = "<a:Saud4:691314678256631898>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("احم")) { // هنا اوامر الاسماء 
        if (message.content !== 'احم') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`${emoji97}`)
    });
    
        let link3 = "https://media.discordapp.net/attachments/1090436879293349948/1100588281835569192/350709706764976129.gif";//رابط الخط
    //=================================
    
    client.on("messageCreate", async (message) => {
       if (message.author.bot) return;
        //if (message.content.startsWith("29")) { // هنا اوامر الاسماء
            if (message.content !== '29') {
                return;
              }
              
              const args = message.content.split(/ +/);
              if (args.length > 2) {
                return;
              }
          const first = message.member
    
    message.channel.send(`\n ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|||${link3}`);
});
    
    const emoji93 = "<a:B77:685687920815767651>"
    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;
    //if (message.content.startsWith("مرحبا")) { // هنا اوامر الاسماء 
        if (message.content !== 'مرحبا') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`__**${emoji90} ڪيُفُڪوُوُوُنْ .. شُوُ أځبُآرڪوُوُوُوُوُنْ ${emoji90}**__\n\n${first}\n `) },
    { content: (`__**${emoji90}مـ,ـرآآآآحـ,ـبـ,ـ .. مـ,ـنـ,ـۅر آلـ,ـډنـ,ـيـ,ـآ ${emoji90}**__\n\n${first}\n `) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    
    const emoji98 = "<a:B98:681165006485848074>"
    const emoji99 = "<a:Y10:685687739332821017>"
    const emoji100 = "<a:SAUDKSP3:829966734940176425>"
    const emoji101 = "<a:SAUDKSP:869209182304337980>"
    const emoji102 = "<a:SAUDKSP5:833169629358456842>"
    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;
    //if (message.content.startsWith("السعدي")) { // هنا اوامر الاسماء 
        if (message.content !== 'السعدي') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`${emoji98}`) },
    { content: (`${emoji99}`) },
    { content: (`${emoji100}`) },
    { content: (`${emoji101}`) },
    { content: (`${emoji102}`) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    
    const emoji103 = "<a:saud0:699729926068240506>"
    const emoji104 = "<:RZZ9:766662974374019133>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("احبك")) { // هنا اوامر الاسماء 
        if (message.content !== 'احبك') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`__**${emoji103} وُآنيـﮯ سًـعَوُدُ آمِـوُتُ فُيـﮯگمِـ  ${emoji103}**__\n\n${first}\n `) },
    { content: (`__**${emoji80} وُآنٌآ آلَسًسًـعَ ـدُيّ آعَ ـشّـقَكَمِـ ${emoji80}**__\n\n${first}\n `) },
    { content: (`__**${emoji104}${emoji83} وُآنٌآ آلَسًسًـعَ ـدُيّ آعَ ـشّـقَكَمِـ ${emoji83}${emoji104}**__\n\n${first}\n `) }
    
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    
    const emoji105 = "<a:1LoVe1:707122267641085982>"
    const emoji106 = "<a:1LoVe2:707122234937966642>"
    const emoji107 = "<:A1:707038022981386270>"
    const emoji108 = "<:A2:707037979889238046>"
    const emoji109 = "<:A3:707037926998933514>"
    const emoji110 = "<:A5:707037842978635857>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("دعاء")) { // هنا اوامر الاسماء 
        if (message.content !== 'دعاء') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    const outputArray = [
    { content: (`${emoji106}${emoji105}${emoji109}${emoji105}${emoji106}`) },
    { content: (`${emoji105}${emoji106}${emoji108}${emoji106}${emoji105}`) },
    { content: (`${emoji105}${emoji106}${emoji107}${emoji106}${emoji105}`) },
    { content: (`${emoji105}${emoji106}${emoji110}${emoji106}${emoji105}`) },
    ];
    const randomIndex = Math.floor(Math.random() * outputArray.length);
    const randomOutput = outputArray[randomIndex];
    message.channel.send(randomOutput);
    });
    
    const emoji111 = "<a:Saud11:728635144004436049>"
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("سعوود")) { // هنا اوامر الاسماء 
        if (message.content !== 'سعوود') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`__**قصــدك:${emoji111}؟؟**__\n\n__**فديتك:**__${emoji90}\n\n${first}\n `)
    });
    
    const emoji112 = "<a:E20:933048275043483708>"
    const emoji113 = "<a:E21:933048295838867476>"
    
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("هلا")) { // هنا اوامر الاسماء 
        if (message.content !== 'هلا') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`__**${emoji112}   شلووووونهــــــــــ آلحــــجُيِ  ${emoji113}**__\n\n${first}\n `)
    });
    
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("ID")) { // هنا اوامر الاسماء 
        if (message.content !== 'ID') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`${emoji83}__**حساب سعود الاصلي **__${emoji83}\n\n__**ID : 5147805759 **__\n\n${first}\n `)
    });
    
    client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    //if (message.content.startsWith("حبيبي والله")) { // هنا اوامر الاسماء 
        if (message.content !== 'حبيبي والله') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
      const first = message.member
    
    if (!first) return;
    message.channel.send(`${emoji18}`)
    });
    
    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;
      //if (!message.content.startsWith("اختر رتبتك")) return;
    
      if (message.content !== 'اختر رتبتك') {
        return;
      }
      
      const args = message.content.split(/ +/);
      if (args.length > 2) {
        return;
      }
    
      // Send message
      const first = message.member;
      const one = "<#679907963078443012>";
      const two = "<#1095222816250548284>";
      const three = "<#1094834552708530287>";
      const four = "<#894611563762294885>";
    
      if (!first) return;
    message.channel.send(`__**تفضل اختر رتبتك المفضله**__\n\n${emoji20}${emoji20}${emoji20}${emoji20}\n\n__**من هنا تقدر تختار رتبة انت ذكر او انثى:**__${one}\n__**من هنا تقدر تختار رتبة لونك الفضل:**__${two}\n__**من هنا تقدر تختار رتبة بلدك المفضل:**__${three}\n__**من هنا تقدر تختار رتبة الفعاليات حتى يوصلك اشعار الفعاليات:**__${four}\n\n\n${first}\n `)
    });
    
    const link4 = "https://media.discordapp.net/attachments/572800136623947809/862639309101727754/265173778qYSm2T.gif"; //رابط الخط
const link5 = "https://media.discordapp.net/attachments/930220885099556906/941796094231326750/IMG_6969.gif"; //رابط الخط

const allowedPermissions = [
  "ManageChannels",
  "Administrator",
  // add more permissions as necessary
];

client.on("messageCreate", async message => {
  if (message.author.bot) return;
    //if (message.content.startsWith("سعوود")) { // هنا اوامر الاسماء 
        if (message.content !== 'خط') {
            return;
          }
          
          const args = message.content.split(/ +/);
          if (args.length > 2) {
            return;
          }
// Check permissions
if (!allowedPermissions.some(p => message.member.permissions.has(p))) {
  console.log(`You don't have permission to use this command.`);
  message.suppressEmbeds(true); // hide the reply message
  return;
}
  // Send random output
  const outputArray = [
    {content: (`\n ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|||${link4}`)},
    {content: (`\n ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|||${link5}`)},
  ];
  const randomIndex = Math.floor(Math.random() * outputArray.length);
  const randomOutput = outputArray[randomIndex];
  message.channel.send(randomOutput);
  });
//-------------------------------------------------------------------- this is for TEMP VOICE 1, using a userlimit, Like 2,3,4 using Duo,Double,More
client.on('ready', async () => {
  const guild = client.guilds.cache.get('572800136132952065');
  const channel = client.channels.cache.get("1089134388769456168");

  client.on("voiceStateUpdate", async (oldState, newState) => {
    const { member } = oldState;
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;

    if (oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
      const voiceChannel = await guild.channels.create({
        name: `🗣️-${member.user.username} Room`,
        type: ChannelType.GuildVoice,
        parent: newChannel.parent,
        permissionOverwrites: [
          {
            id: member.id,
            allow: [
              "ViewChannel",
              "Connect",
              "ManageChannels",
              "ManageRoles",
              "Speak",
              "Stream",
              "UseVAD",
              "UseEmbeddedActivities"
            ],
          },
          {
            id: guild.id,
            allow: ["Connect"],
          },
        ],
        userLimit: "2"
      });

      voiceManager.set(member.id, voiceChannel.id);

      await newChannel.permissionOverwrites.edit(member, {
        Connect: false
      });
      setTimeout(() => {
        newChannel.permissionOverwrites.delete(member);
      }, 30000);

      return setTimeout(() => {
        member.voice.setChannel(voiceChannel);
      }, 500);
    }

    const jointocreate = voiceManager.get(member.id);
    const members = oldChannel?.members
      .filter((m) => !m.user.bot)
      .map((m) => m.id);
    if (
      jointocreate &&
      oldChannel.id === jointocreate &&
      (!newChannel || newChannel.id !== jointocreate)
    ) {
      if (members.length > 0) {
        let randomID = members[Math.floor(Math.random() * members.length)];
        let randomMember = guild.members.cache.get(randomID);
        randomMember.voice.setChannel(oldChannel).then((v) => {
          oldChannel.setName(randomMember.user.username).catch((e) => null);
          oldChannel.permissionOverwrites.edit(randomMember, {
            Connect: true,
            ManageChannels: true
          });
        });
        voiceManager.set(member.id, null);
        voiceManager.set(randomMember.id, oldChannel.id);
      } else {
        voiceManager.set(member.id, null);
        setTimeout(() => {
          if (oldChannel.members.size == 0) {
            oldChannel.delete().catch((e) => null);
          }
        }, 10000); // Wait for 60 seconds before deleting the channel
      }
    }
  });

  // Check for empty voice channels when the bot comes back online
  const voiceChannels = await guild.channels.cache.filter(channel => channel.type === 'GuildVoice');
  voiceChannels.forEach(async voiceChannel => {
    if (voiceChannel.members.size === 0 && voiceChannel.name.startsWith('🗣️-')) {
      await voiceChannel.delete().catch(error => { console.error(`Error deleting empty voice channel: ${error}`); });
      console.log(`Deleted empty voice channel: ${voiceChannel.name}`);
    }
  });

  console.log('Bot is ready!');
});

//-------------------------------------------------------------------- this is for TEMP VOICE 2 if you want more than 1 channel, using a userlimit, Like 2,3,4
client.on("voiceStateUpdate", async (oldState, newState) => {
  const { member, guild } = oldState;
  const newChannel = newState.channel;
  const oldChannel = oldState.channel;

  const channel = client.channels.cache.get("1089135814912520273");

  if (oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
    const voiceChannel = await guild.channels.create({
      name: `🗣️-${member.user.username} Room`,
      type: ChannelType.GuildVoice,
      parent: newChannel.parent,
      permissionOverwrites: [
        {
          id: member.id,
          allow: [
            "ViewChannel",
            "Connect",
            "ManageChannels",
            "ManageRoles",
            "Speak",
            "Stream",
            "UseVAD",
            "UseEmbeddedActivities"
          ],
        },
        {
          id: guild.id,
          allow: ["Connect"],
        },
      ],
      userLimit: "3"
    });

    voiceManager.set(member.id, voiceChannel.id);

    await newChannel.permissionOverwrites.edit(member, {
      Connect: false
    });
    setTimeout(() => {
      newChannel.permissionOverwrites.delete(member);
    }, 30000);

    return setTimeout(() => {
      member.voice.setChannel(voiceChannel);
    }, 500);
  }

  const jointocreate = voiceManager.get(member.id);
  const members = oldChannel?.members
    .filter((m) => !m.user.bot)
    .map((m) => m.id);
  if (
    jointocreate &&
    oldChannel.id === jointocreate &&
    (!newChannel || newChannel.id !== jointocreate)
  ) {
    if (members.length > 0) {
      let randomID = members[Math.floor(Math.random() * members.length)];
      let randomMember = guild.members.cache.get(randomID);
      randomMember.voice.setChannel(oldChannel).then((v) => {
        oldChannel.setName(randomMember.user.username).catch((e) => null);
        oldChannel.permissionOverwrites.edit(randomMember, {
          Connect: true,
          ManageChannels: true
        });
      });
      voiceManager.set(member.id, null);
      voiceManager.set(randomMember.id, oldChannel.id);
    } else {
      voiceManager.set(member.id, null);
      setTimeout(() => {
        if (oldChannel.members.size == 0) {
          oldChannel.delete().catch((e) => null);
        }
      }, 10000); // Wait for 10 seconds before deleting the channel
    }
  }
});

//-------------------------------------------------------------------- this is for TEMP VOICE 3 if you want more than 1 channel, using a userlimit, Like 2,3,4
client.on("voiceStateUpdate", async (oldState, newState) => {
  const { member, guild } = oldState;
  const newChannel = newState.channel;
  const oldChannel = oldState.channel;

  const channel = client.channels.cache.get("1089135839918968992");

  if (oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
    const voiceChannel = await guild.channels.create({
      name: `🗣️-${member.user.username} Room`,
      type: ChannelType.GuildVoice,
      parent: newChannel.parent,
      permissionOverwrites: [
        {
          id: member.id,
          allow: [
            "ViewChannel",
            "Connect",
            "ManageChannels",
            "ManageRoles",
            "Speak",
            "Stream",
            "UseVAD",
            "UseEmbeddedActivities"
          ],
        },
        {
          id: guild.id,
          allow: ["Connect"],
        },
      ],
      userLimit: "4"
    });

    voiceManager.set(member.id, voiceChannel.id);

    await newChannel.permissionOverwrites.edit(member, {
      Connect: false
    });
    setTimeout(() => {
      newChannel.permissionOverwrites.delete(member);
    }, 30000);

    return setTimeout(() => {
      member.voice.setChannel(voiceChannel);
    }, 500);
  }

  const jointocreate = voiceManager.get(member.id);
  const members = oldChannel?.members
    .filter((m) => !m.user.bot)
    .map((m) => m.id);
  if (
    jointocreate &&
    oldChannel.id === jointocreate &&
    (!newChannel || newChannel.id !== jointocreate)
  ) {
    if (members.length > 0) {
      let randomID = members[Math.floor(Math.random() * members.length)];
      let randomMember = guild.members.cache.get(randomID);
      randomMember.voice.setChannel(oldChannel).then((v) => {
        oldChannel.setName(randomMember.user.username).catch((e) => null);
        oldChannel.permissionOverwrites.edit(randomMember, {
          Connect: true,
          ManageChannels: true
        });
      });
      voiceManager.set(member.id, null);
      voiceManager.set(randomMember.id, oldChannel.id);
    } else {
      voiceManager.set(member.id, null);
      setTimeout(() => {
        if (oldChannel.members.size == 0) {
          oldChannel.delete().catch((e) => null);
        }
      }, 10000); // Wait for 10 seconds before deleting the channel
    }
  }
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'info') {
        const botInfoMessage = `Bot Name: ${client.user.username}\nBot ID: ${client.user.id}\nCreated At: ${client.user.createdAt}`;
        await interaction.reply(botInfoMessage);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() || interaction.commandName !== 'restart') return;

    if (interaction.user.id !== '350709706764976129') {
        await interaction.reply({ content: '⛔️ You are not the owner of the bot. Only the owner can restart the bot.', ephemeral: true });
        return;
    }

    const restartEmbed = new EmbedBuilder()
        .setColor(randomColor)
        .setTitle('__**Restarting the bot...**__');

    const restartMessage = await interaction.reply({ embeds: [restartEmbed], ephemeral: true });
    const restartSuccess = await restartBot();

    if (restartSuccess) {
        const successEmbed = new EmbedBuilder()
            .setColor(randomColor)
            .setTitle('__**Restart successful!**__');
        await restartMessage.edit({ embeds: [successEmbed], ephemeral: true });
    } else {
        const failureEmbed = new EmbedBuilder()
            .setColor(randomColor)
            .setTitle('__**Restart failed!**__');
        await restartMessage.edit({ embeds: [failureEmbed], ephemeral: true });
    }
});

async function restartBot() {
    console.log('Restarting...');
    try {
        await client.destroy();
        await client.login(process.env.Token);
        console.log('Restart successful!');
        return true;
    } catch (error) {
        console.error('Restart failed:', error);
        return false;
    }
}
//-------------------------------------------------------------------- this is for client needed
module.exports = client;
//-------------------------------------------------------------------- this is for bot process env login
client.login(process.env.Token).catch((err) => {
//console.warn("\033[31m Token Invalid")
})
