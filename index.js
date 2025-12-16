const { Client, GatewayIntentBits, Events } = require("discord.js");

const WELCOME_CHANNEL_ID = "1450110116841127957";
const ROLES_CHANNEL_ID = "1449850339451732088";

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("❌ Missing DISCORD_TOKEN environment variable.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Logged in as ${readyClient.user.tag}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const channel =
      member.guild.channels.cache.get(WELCOME_CHANNEL_ID) ||
      (await member.guild.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null));

    if (!channel || !channel.isTextBased()) {
      console.warn("⚠️ Welcome channel not found / not text-based.");
      return;
    }

    const count = member.guild.memberCount;

    const msg =
      `👋 Bienvenue ${member} sur **TFT Arena** !\n\n` +
      `🎮 Tu es le **${count}e membre** à rejoindre le serveur\n` +
      `🔔 Choisis tes rôles dans ➜ <#${ROLES_CHANNEL_ID}>\n\n` +
      `Bon jeu et bonne chance dans l’arène 🔥`;

    await channel.send({ content: msg });
  } catch (err) {
    console.error("❌ Failed to send welcome message:", err);
  }
});

client.login(token);
