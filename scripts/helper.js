import { playNextSong, updateTags } from "./dom-helper.js";

async function getFolders() {
    const response = await fetch('http://localhost:8080/');
    const json = await response.json();
    return json.all_folders;
}

async function getFiles(folder) {
    const response = await fetch('http://localhost:8080/' + folder);
    const json = await response.json();
    return json;
}

async function getFolderArtists(folder){
    const response = await fetch('http://localhost:8080/' + folder + '/artists');
    const json = await response.json();
    return json.artists;
}

let audio;

let playAudio = (path, length) => {
    if (audio !== undefined) {
        audio.pause()
        audio = undefined
        audio = new Audio(path)
        audio.play();

        updateTags();
        audio.addEventListener('loaded', updateProgress(length))
    } else {
        audio = new Audio(path);
        audio.play();
        updateTags();
        audio.addEventListener('loaded', updateProgress(length))
    }
    audio.addEventListener('ended', () => {
        playNextSong();
    });
}


let playPause = () => {
    if (audio.paused) {
        audio.play();
        document.getElementById("play-pause").innerHTML = "pause_arrow";
    } else {
        audio.pause();
        document.getElementById("play-pause").innerHTML = "play_arrow";
    }
}

let updateProgress = (length) => {
    // console.log(length)
    audio.removeEventListener('timeupdate', updateProgress)
    let progress_bar = document.getElementById("seek-bar");
       
    audio.addEventListener('timeupdate', () => {
        let percentage = (audio.currentTime / length) * 1000;
        progress_bar.value = percentage
    });
}

export {
    getFolders,
    getFiles,
    getFolderArtists,
    playAudio,
    playPause,
}