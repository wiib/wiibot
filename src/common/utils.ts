export function padNumber(num: number, amount: number, padding: string) {
    return num.toString().padStart(amount, padding);
}

export function msToHMS(ms: number) {
    let sec = Math.floor(ms / 1000);
    let min = Math.floor(sec / 60);
    let hr = Math.floor(min / 60);

    sec = sec % 60;
    min = min % 60;

    return `${padNumber(hr, 2, "0")}:${padNumber(min, 2, "0")}:${padNumber(sec, 2, "0")}`;
}
