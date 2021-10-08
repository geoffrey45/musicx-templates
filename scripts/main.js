import { printFolders, playPreviousSong, playNextSong } from "./dom-helper.js";
import { playPause } from "./helper.js";

printFolders();

document.getElementById("skip-previous").addEventListener("click", playPreviousSong);
document.getElementById("skip-next").addEventListener("click", playNextSong);
document.getElementById("play-pause").addEventListener("click", playPause);


