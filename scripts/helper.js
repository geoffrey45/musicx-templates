import { playNextSong, playPreviousSong, updateTags } from "./dom-helper.js";

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

async function getFolderArtists(folder) {
    const response = await fetch('http://localhost:8080/' + folder + '/artists');
    const json = await response.json();
    return json.artists;
}

async function getArtistData(artist) {
    const resonse = await fetch('http://localhost:8080/artist?q=' + artist)
    const json = await resonse.json()

    return json
}

let audio;

let playAudio = (path, length) => {
    let tryPlay = () => {
        audio.oncanplay = () => {
            updateTags();
            updateProgress(length);
            
            if (audio.oncanplay) {
                audio.play();
            } else {
                playNextSong();
            }
        }
    }

    if (audio !== undefined) {
        audio.pause()
        audio = undefined
        audio = new Audio(path)

        tryPlay();
    } else {
        audio = new Audio(path);

        tryPlay();
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
    audio.removeEventListener('timeupdate', updateProgress)
    let progress_bar = document.getElementById("seek-bar");

    audio.addEventListener('timeupdate', () => {
        let percentage = (audio.currentTime / length) * 1000;
        progress_bar.value = percentage
    });

}

let updateNotification = (title, artist, album) => {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist,
            album: album,
            artwork: [
                { src: '', sizes: '512x512', type: 'image/jpg' }
            ]
        });

        // navigator.mediaSession.setActionHandler('play', playPause());
        // navigator.mediaSession.setActionHandler('pause', playPause());

        navigator.mediaSession.setActionHandler('previoustrack', function () {
            playNextSong();
        });

        navigator.mediaSession.setActionHandler('nexttrack', function () {
            playPreviousSong();
        });
    };
};

export {
    getFolders,
    getFiles,
    getFolderArtists,
    getArtistData,

    playAudio,
    playPause,
    updateNotification
}