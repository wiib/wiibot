import { Command } from "../../common/types";
import { DefaultEmbed } from "../../common/classes";
import { Client, Language } from "fnapicom";
import Fuse from "fuse.js";
import { SlashCommandBuilder, time } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Fortnite implements Command {
    data = new SlashCommandBuilder()
        .setName("fortnite")
        .setDescription("Performs different queries to fortnite-api")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Searches for a cosmetic by name")
                .addStringOption((option) =>
                    option
                        .setName("name")
                        .setDescription("The name of the cosmetic")
                        .setRequired(true)
                )
        );

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const e = new DefaultEmbed();

        const fnClient = new Client({
            language: Language.English
        });

        if (subcommand === "search") {
            const query = interaction.options.getString("name") ?? "";
            const cosmeticsList = await fnClient.cosmeticsList();

            e.setTitle("Cosmetic Search");

            if (cosmeticsList.status === 200) {
                const fuse = new Fuse(cosmeticsList.data, { keys: ["name"], includeScore: true });
                const res = fuse.search(query);

                const dateAdded = new Date(res[0].item.added);
                const lastSeen = res[0].item.shopHistory
                    ? new Date(res[0].item.shopHistory.slice(-1)[0])
                    : null;

                // TODO: Present choices based on fuzzy-search score
                e.setAuthor({
                    name: res[0].item.name,
                    iconURL: res[0].item.images.smallIcon,
                    url: `https://youtu.be/${res[0].item.showcaseVideo}`
                })
                    .setDescription(`${res[0].item.description}`)
                    .addFields([
                        {
                            name: "Type",
                            inline: true,
                            value: res[0].item.type.displayValue
                        },
                        {
                            name: "Rarity",
                            inline: true,
                            value: res[0].item.rarity.displayValue
                        },
                        {
                            name: "Season Added",
                            inline: true,
                            value: `Ch. ${res[0].item.introduction.chapter}, Season ${res[0].item.introduction.season}`
                        },
                        {
                            name: "Date Added",
                            inline: true,
                            value: `${time(dateAdded, "f")}`
                        }
                    ])
                    .setImage(res[0].item.images.featured ?? res[0].item.images.icon);

                if (lastSeen) {
                    e.addFields([
                        {
                            name: "Last Seen",
                            inline: true,
                            value: `${time(lastSeen, "R")}`
                        }
                    ]);
                }
            }

            await interaction.reply({ embeds: [e] });
            return;
        }
    }
}
