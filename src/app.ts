import "./lib/setup";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "./common/types";

// Initialize client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = new Collection<string, Command>();

// Read command files
const commandsPath = join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

// Store command classes in collection
for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const f = require(filePath);
    const command: Command = new f.default();
    commands.set(command.data.name, command);
}

// When ready, log that shit
client.once("ready", () => {
    console.log("Bot is READY!!");
});

// Execute commands
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({
            content: "There was an error while executing that command...",
            ephemeral: true,
        });
    }
});

// Login
client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log("Successfully logged in!");
});
