import "./lib/setup";
import { readdirSyncRecursive } from "./common/utils";
import { join } from "node:path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import type { Command } from "./common/types";

// Read commands from dir
const commands: unknown[] = [];
const commandsPath = join(__dirname, "commands");
const commandFiles = readdirSyncRecursive(commandsPath).filter((file) => file.endsWith(".js"));

// Load command data
for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const f = require(file);
    const command = new f.default() as Command;
    console.log(command.data);
    commands.push(command.data.toJSON());
}

// Initialize REST client
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN ?? "");

// Execute PUT
rest.put(Routes.applicationCommands(process.env.APP_ID ?? ""), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
