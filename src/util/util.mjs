export function leftPadZero(num, padLength) {
    const n = Math.abs(num);
    const zeros = Math.max(0, padLength - Math.floor(n).toString().length);
    let zeroString = (10 ** zeros).toString().substr(1);

    if (num < 0) {
        zeroString = "-" + zeroString;
    }

    return zeroString + n;
}

export const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i;
