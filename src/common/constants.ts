import { execSync } from "child_process";

// NPM Package version
const packageVer = process.env.npm_package_version;

// Latest commit hash
const revHash = execSync("git rev-parse --short HEAD").toString().trim();

// Embed footer
export const embedFooter = `v${packageVer} - Commit #${revHash}`;

// Embed colors
export const colors = {
    main: "e95858"
};
