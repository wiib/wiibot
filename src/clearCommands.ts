import "./lib/setup";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

// Initialize REST client
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN ?? "");

// Execute PUT
rest.put(Routes.applicationCommands(process.env.APP_ID ?? ""), { body: [] })
    .then(() => console.log("Successfully unregistered application commands."))
    .catch(console.error);
