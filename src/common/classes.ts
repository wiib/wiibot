// Default embed
import { EmbedBuilder } from "discord.js";
import { colors, embedFooter } from "./constants";

export class DefaultEmbed extends EmbedBuilder {
    constructor() {
        super();
        this.setColor(`#${colors.main}`);
        this.setFooter({ text: embedFooter });
    }
}
