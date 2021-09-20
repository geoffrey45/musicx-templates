import { getFolders, getFiles, playAudio, getFolderArtists } from './helper.js'


let album_of_the_day = document.getElementById('album-of-the-day');
let top_artists_card = document.getElementsByClassName('top-artists')[0];
let know_your_artist_card = document.getElementById('top-songs-right');
let top_songs_card = document.getElementsByClassName('top-songs')[0];
let album_of_the_day_grid = document.getElementById('album-of-the-day-grid');

let prepareHomeView = () => {
    album_of_the_day_grid.innerHTML = '';

    let album = album_of_the_day.content.cloneNode(true);
    // console.log('album');

    top_artists_card.style.display = 'unset';
    know_your_artist_card.style.display = 'unset';
    top_songs_card.classList.replace('folder-list', 'top-songs');
    top_songs_card.getElementsByClassName('card-header')[0].innerHTML = "Top Songs"
    album_of_the_day_grid.appendChild(album);
}

let folder_details = {
    'folder_name': '',
    'url_safe_name': '',
    'count': 0
}

let playlist = {
    "name": "lil peep",
    "type": "",
    "songs": []
}

let queue = {
    "songs": [],
    "current": 0
}

let prepareFolderView = () => {
    let album = album_of_the_day.content.cloneNode(true);
    album_of_the_day_grid.innerHTML = '';
    album_of_the_day_grid.appendChild(album);

    know_your_artist_card.style.display = 'none';
    top_songs_card.classList.replace('top-songs', 'folder-list');
    document.getElementsByClassName('folder-list')[0].getElementsByClassName('card-header')[0].innerHTML = `Listing all songs in ${folder_details['folder_name']}`
    let folder_header = document.getElementById('album-title-of-the-day');
    folder_header.innerHTML = folder_details['folder_name'];
    album_of_the_day_grid.getElementsByClassName('card-header')[0].innerHTML = 'Folder'
    document.getElementById('album-artist-of-the-day').innerHTML = `${folder_details['count']} Songs`
    document.getElementById('album-art-of-the-day').style.width = '100%'
    document.getElementsByClassName('alb-no')[0].style.display = 'none'
};

let printFolders = async () => {
    let folder_dom = document.getElementsByClassName('context')[0]
    // console.log(folder_dom)

    const folders = await getFolders();
    folders.map(folder => {
        let folder_item = document.createElement('span');
        folder_item.className = 'folder-item';

        let folder_link = document.createElement('a');
        folder_link.href = `#/f/${folder.url}`;
        folder_link.innerText = folder.name;
        folder_link.setAttribute('type', 'folder')

        folder_item.appendChild(folder_link);
        folder_dom.appendChild(folder_item);
    });
    // console.log(`Retrieved ${folders.length} folders`);
}

let printSongArtists = (array, element) => {
    // console.log(array)

    element.innerHTML = ''

    array.forEach(function (artist, idx, array) {
        let artist_link = document.createElement('a')
        artist_link.href = encodeURIComponent(artist);
        artist_link.innerHTML = artist;

        if (idx !== array.length - 1) {
            artist_link.innerHTML = `${artist}, `
        }

        element.appendChild(artist_link)
    });
}
let printFiles = async (folder) => {
    playlist.songs = [];
    getFiles(folder).then(
        songs => {

            folder_details['folder_name'] = songs['folder_name'];
            folder_details['count'] = songs['count'];
            folder_details['url_safe_name'] = songs['url_safe_name']
            prepareFolderView();

            let folder_table = document.getElementById('folder-table')
            let file_dom = document.getElementById('list-item')

            folder_table.innerHTML = ''
            folder_table.scrollTop = 0;

            songs['all_files'].map(song => {
                playlist.songs.push(song)

                let list_item = file_dom.content.cloneNode(true)

                let title = list_item.getElementById('list-item-title')
                let artist_node = list_item.getElementById('list-item-artist')
                let album = list_item.getElementById('list-item-album')
                let image = list_item.getElementById('top-song-img')

                printSongArtists(song.artists, artist_node)
                // console.log(song.artists)

                // artist.innerText = song.artist
                title.innerText = song.title
                title.setAttribute('href', `#/f/${encodeURIComponent(folder_details['name'])}/${song.title}`)
                album.innerText = song.album
                image.style.backgroundImage = `url(${song.image})`

                folder_table.appendChild(list_item)
            });

            (() => {
                let folder_header = document.getElementById('album-title-of-the-day')
                let folder_count = document.getElementById('album-artist-of-the-day')

                folder_header.innerText = folder_details['folder_name'];
                folder_count.innerText = `${folder_details['count']} Songs`
            })();

            // console.log(playlist.songs.length)
        }
    )
    getFolderArtists(folder).then(
        artists => {
            let folder_artists_node = document.getElementById('folder-artists')
            folder_artists_node.innerText = ''
            
            let artist_node = document.getElementById('top-artists-item')

            artists.forEach(artist_array => {
                artist_array.map (artist => {
                    let artistits = artist_node.content.cloneNode(true)
    
                    let artist_link = artistits.getElementById('artist-name')
                    let artist_image = artistits.getElementById('artist-image')
    
                    artist_image.style.backgroundImage = `url(${artist.image})`
                    artist_link.innerText = artist.name
    
                    folder_artists_node.appendChild(artistits)
                })
            })
           
        }
    )
}

let playSongById = (name) => {
    let findSong = () => {
        if (playlist.songs.length == 0) {
            // console.log(`looking for ${name}`)

            setTimeout(() => {
                findSong();
            }, 1000)
        } else {
            queue.songs = playlist.songs;

            let song = playlist.songs.find(song => {
                return song['title'] == name;
            });

            queue.current = queue.songs.indexOf(song);
            // console.log(queue.current)

            if (song) {
                playAudio(song.filepath, song.length);
            }
        };
    };

    findSong();
};

let playNextSong = () => {
    queue.current++;
    console.log(queue);

    if (queue.current >= queue.songs.length) {
        playSongById(queue.songs[0]['title'])
    } else {
        playSongById(queue.songs[queue.current]['title'])
    }
}

let playPreviousSong = () => {
    queue.current--;

    if (queue.current < 0) {
        playSongById(queue.songs[queue.songs.length - 1]['title'])
    } else {
        playSongById(queue.songs[queue.current]['title'])
    }
}

let updateTags = () => {
    let song = queue.songs[queue.current];

    console.log(song)

    let title = document.getElementById('now-playing-title')
    let artists = document.getElementById('now-playing-artist')
    let album_art = document.getElementById('now-playing-album-art')



    title.innerText = song['title']
    printSongArtists(song.artists, artists)
    album_art.style.backgroundImage = `url(${song['image']})`
}

export {
    printFolders,
    printFiles,
    prepareFolderView,
    prepareHomeView,
    playSongById,
    playNextSong,
    playPreviousSong,
    updateTags
}