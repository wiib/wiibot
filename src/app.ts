import "./lib/setup";
import { Client, GatewayIntentBits } from "discord.js";

// Initialize client
const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });

// When ready, log that shit
client.once("ready", () => {
    console.log("Bot is READY!!");
});

// Login
client.login(process.env.DISCORD_TOKEN)
      .then(() => { console.log("Logged in!") });