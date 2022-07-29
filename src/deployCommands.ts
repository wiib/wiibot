import "./lib/setup";
import { join } from "node:path";
import { readdirSync } from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

// Read commands from dir
const commands: unknown[] = [];
const commandsPath = join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

// Load command data
for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const f = require(filePath);
    const command = new f.default();
    commands.push(command.data.toJSON());
}

// Initialize REST client
// @ts-ignore
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// Execute PUT
rest.put(
    // @ts-ignore
    Routes.applicationCommands(process.env.APP_ID),
    { body: commands }
)
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
