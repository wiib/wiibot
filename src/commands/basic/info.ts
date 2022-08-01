import { Command } from "../../common/types";
import { msToHMS } from "../../common/utils";
import { colors, embedFooter } from "../../common/constants";
import {
    EmbedBuilder,
    OAuth2Scopes,
    SlashCommandBuilder,
    hyperlink,
    time,
    userMention
} from "discord.js";
import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export default class Info implements Command {
    data = new SlashCommandBuilder()
        .setName("info")
        .setDescription("Display useful information about the bot")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("user")
                .setDescription("Displays information about an user")
                .addUserOption((option) =>
                    option.setName("target").setDescription("The user").setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("bot").setDescription("Displays information about the bot")
        );

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "user") {
            const member = interaction.options.getMember("target") as GuildMember;
            const avatar = member.user.avatarURL({ size: 4096, extension: "png" });

            const e = new EmbedBuilder()
                .setColor(`#${colors.main}`)
                .setTitle("User Info")
                .setThumbnail(avatar)
                .setAuthor({
                    name: member.user.tag,
                    iconURL: avatar ?? undefined
                })
                .setDescription(userMention(member.id))
                .addFields([
                    {
                        name: "Date Joined",
                        inline: true,
                        value: `${time(member.joinedAt as Date, "R")}`
                    },
                    {
                        name: "Date Created",
                        inline: true,
                        value: `${time(member.user.createdAt, "R")}`
                    },
                    {
                        name: "User ID",
                        inline: false,
                        value: `${member.id}`
                    }
                ])
                .setFooter({ text: embedFooter });

            if (avatar) {
                e.addFields([
                    {
                        name: "Avatar URL",
                        inline: true,
                        value: `${hyperlink("Click here!", avatar)}`
                    }
                ]);
            }

            await interaction.reply({ embeds: [e] });
            return;
        }

        if (subcommand === "bot") {
            const inviteLink = interaction.client.generateInvite({
                scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot]
            });

            const e = new EmbedBuilder()
                .setColor(`#${colors.main}`)
                .setTitle("Bot Info")
                .setThumbnail(interaction.client.user?.avatarURL() ?? null)
                .addFields([
                    {
                        name: "Uptime",
                        inline: true,
                        value: `${msToHMS(interaction.client.uptime ?? 0)}`
                    },
                    {
                        name: "Total Guilds",
                        inline: true,
                        value: `${interaction.client.guilds.cache.size}`
                    },
                    {
                        name: "Invite URL",
                        inline: false,
                        value: `${hyperlink("Click here!", inviteLink)}`
                    }
                ])
                .setFooter({ text: embedFooter });

            await interaction.reply({ embeds: [e] });
            return;
        }
    }
}
