import { Command } from "../../common/types";
import { msToHMS } from "../../common/utils";
import { DefaultEmbed } from "../../common/classes";
import { OAuth2Scopes, SlashCommandBuilder, hyperlink, time, userMention } from "discord.js";
import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export default class Info implements Command {
    data = new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays different types of information")
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
        const e = new DefaultEmbed();

        if (subcommand === "user") {
            const member = interaction.options.getMember("target") as GuildMember;
            const fUser = await member.user.fetch(true);

            const avatar = member.user.avatarURL({ size: 4096, extension: "png" });
            const banner = fUser.bannerURL({ size: 4096, extension: "png" });

            e.setTitle("User Info")
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
                ]);

            if (avatar) {
                e.addFields([
                    {
                        name: "Avatar URL",
                        inline: true,
                        value: `${hyperlink("Click here!", avatar)}`
                    }
                ]);
            }

            if (banner) {
                e.addFields([
                    {
                        name: "Banner URL",
                        inline: true,
                        value: `${hyperlink("Click here!", banner)}`
                    },
                    {
                        name: "Accent Color",
                        inline: true,
                        value: `${fUser.hexAccentColor}`
                    }
                ]).setImage(banner);
            }

            await interaction.reply({ embeds: [e] });
            return;
        }

        if (subcommand === "bot") {
            const inviteLink = interaction.client.generateInvite({
                scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot]
            });

            e.setTitle("Bot Info")
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
                ]);

            await interaction.reply({ embeds: [e] });
            return;
        }
    }
}
