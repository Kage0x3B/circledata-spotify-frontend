import MusicPlayerFill from "svelte-bootstrap-icons/lib/MusicPlayerFill";
import MusicPlayer from "svelte-bootstrap-icons/lib/MusicPlayer";

import DisplayFill from "svelte-bootstrap-icons/lib/DisplayFill";
import Display from "svelte-bootstrap-icons/lib/Display";
import TabletFill from "svelte-bootstrap-icons/lib/TabletFill";
import Tablet from "svelte-bootstrap-icons/lib/Tablet";
import PhoneFill from "svelte-bootstrap-icons/lib/PhoneFill";
import Phone from "svelte-bootstrap-icons/lib/Phone";
import SpeakerFill from "svelte-bootstrap-icons/lib/SpeakerFill";
import Speaker from "svelte-bootstrap-icons/lib/Speaker";
import TvFill from "svelte-bootstrap-icons/lib/TvFill";
import Tv from "svelte-bootstrap-icons/lib/Tv";
import HddNetworkFill from "svelte-bootstrap-icons/lib/HddNetworkFill";
import HddNetwork from "svelte-bootstrap-icons/lib/HddNetwork";
import HddFill from "svelte-bootstrap-icons/lib/HddFill";
import Hdd from "svelte-bootstrap-icons/lib/Hdd";
import Controller from "svelte-bootstrap-icons/lib/Controller";
import Cast from "svelte-bootstrap-icons/lib/Cast";
import Minecart from "svelte-bootstrap-icons/lib/Minecart";

const deviceIcons = {
    unknown: {
        active: MusicPlayerFill,
        inactive: MusicPlayer
    },
    computer: {
        active: DisplayFill,
        inactive: Display
    },
    tablet: {
        active: TabletFill,
        inactive: Tablet
    },
    smartphone: {
        active: PhoneFill,
        inactive: Phone
    },
    speaker: {
        active: SpeakerFill,
        inactive: Speaker
    },
    tv: {
        active: TvFill,
        inactive: Tv
    },
    avr: {
        active: HddNetworkFill,
        inactive: HddNetwork
    },
    stb: {
        active: HddFill,
        inactive: Hdd
    },
    audio_dongle: {
        active: MusicPlayerFill,
        inactive: MusicPlayer
    },
    game_console: {
        active: Controller,
        inactive: Controller
    },
    cast_video: {
        active: Cast,
        inactive: Cast
    },
    cast_audio: {
        active: Cast,
        inactive: Cast
    },
    automobile: {
        active: Minecart,
        inactive: Minecart
    }
};

export function getDeviceIcon(deviceType, isActive) {
    deviceType = deviceType.toLowerCase();

    if (deviceIcons[deviceType]) {
        return isActive ? deviceIcons[deviceType].active : deviceIcons[deviceType].inactive;
    }

    return isActive ? deviceIcons.unknown.active : deviceIcons.unknown.inactive;
}

export default deviceIcons;
