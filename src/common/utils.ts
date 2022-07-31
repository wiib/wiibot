import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { PathLike } from "node:fs";

/**
 * Pads a number by adding `amount` times `padding` at the beginning
 * @param {number} num
 * @param {number} amount
 * @param {string} padding
 * @returns {string} `num` with the added padding
 */
export function padNumber(num: number, amount: number, padding = "0"): string {
    return num.toString().padStart(amount, padding);
}

/**
 * Converts an amount of milliseconds into HH:MM:SS notation
 * @param {number} ms
 * @returns {string} The amount of time in HH:MM:SS notation
 */
export function msToHMS(ms: number): string {
    let sec = Math.floor(ms / 1000);
    let min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);

    sec = sec % 60;
    min = min % 60;

    return `${padNumber(hr, 2)}:${padNumber(min, 2)}:${padNumber(sec, 2)}`;
}

/**
 * Recursively reads a directory, returning an array with files
 * @param {PathLike} dir - The directory to read
 * @param {string[]} filesArr
 * @returns {string[]} An array with the path of every file in the directory and its subdirectories
 */
export function readdirSyncRecursive(dir: PathLike, filesArr?: string[]): string[] {
    const files = readdirSync(dir);
    let arr = filesArr || [];

    for (const file of files) {
        const filePath = join(dir as string, file);

        if (statSync(filePath).isDirectory()) {
            arr = readdirSyncRecursive(filePath, arr);
        } else {
            arr.push(filePath);
        }
    }

    return arr;
}
