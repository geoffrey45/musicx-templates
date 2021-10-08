import { getFolders, getFiles, playAudio, getFolderArtists, getArtistData, updateNotification } from './helper.js'


let album_of_the_day = document.getElementById('album-of-the-day');
let top_artists_card = document.getElementsByClassName('top-artists')[0];
let know_your_artist_card = document.getElementById('top-songs-right');
let top_songs_card = document.getElementsByClassName('top-songs')[0];
let album_of_the_day_grid = document.getElementById('album-of-the-day-grid');


let prepareHomeView = () => {
    album_of_the_day_grid.innerHTML = '';

    let album = album_of_the_day.content.cloneNode(true);

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
    "name": "",
    "type": "",
    "songs": []
}

let queue = {
    "songs": [],
    "current": 0
}

let prepareArtistView = () => {
    let artist_header = document.getElementById('artist-header').content.cloneNode(true);
    album_of_the_day_grid.innerHTML = '';

    document.getElementById('album-of-the-day-grid').appendChild(artist_header);
    document.getElementById('artist-header-artist-name').innerText = decodeURIComponent(window.location.hash.split('/')[2]);
    let artist_albums = document.getElementById('artist-page-albums').content.cloneNode(true);

    
    let album_node = document.getElementById('top-songs-right')
    album_node.style.display = 'unset';
    top_songs_card.classList = 'top-songs'
    album_node.innerHTML = '';
    album_node.appendChild(artist_albums);
    
    let artist_tracks = document.getElementById('folder-table')
    artist_tracks.classList.add('artist-tracks')
    artist_tracks.scrollTop = 0;

    document.getElementById('top-songs-inner').getElementsByClassName('card-header')[0].innerHTML = 'Top Tracks'
}

let printArtist = async (artist) => {
    playlist.songs = [];

    getArtistData(artist).then(
        data => {
            document.getElementById('artist-header-img').style.backgroundImage = `url(${data.artist[0].image})`

            let song_table = document.getElementsByClassName('artist-tracks')[0]
            song_table.innerHTML = '';
            song_table.scrollTop = 0;

            data.songs.map(song => {
                let list_item = createListItem(song);
                song_table.appendChild(list_item);

                playlist.songs.push(song);
            });
        }
    );
};

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

    document.getElementsByClassName('alb-no')[0].style.display = 'none'
    top_artists_card.style.display = 'unset';
};


let printFolders = async () => {
    let folder_dom = document.getElementsByClassName('context')[0]

    const folders = await getFolders();
    folders.map(folder => {
        let folder_item = document.createElement('span');
        folder_item.className = 'folder-item';

        let folder_link = document.createElement('a');
        folder_link.href = `#/folder/${folder.url}`;
        folder_link.innerText = folder.name;
        folder_link.setAttribute('type', 'folder')

        let icon = document.createElement('span');
        icon.classList.add('material-icons', 'material-icons-round');
        icon.innerText = 'folder';

        folder_item.appendChild(icon)
        folder_item.appendChild(folder_link);

        folder_dom.appendChild(folder_item);
    });
}

let printSongArtists = (array, element) => {
    element.innerHTML = ''

    array.forEach(function (artist, idx, array) {
        let artist_link = document.createElement('a')
        artist_link.href = '#/artist/' + encodeURIComponent(artist);
        artist_link.innerHTML = artist;

        if (idx !== array.length - 1) {
            artist_link.innerHTML = `${artist}, `
        }

        element.appendChild(artist_link)
    });
}

function createListItem(song) {
    let file_dom = document.getElementById('list-item')
    let list_item = file_dom.content.cloneNode(true)

    let title = list_item.getElementById('list-item-title')
    let artist_node = list_item.getElementById('list-item-artist')
    let album = list_item.getElementById('list-item-album')
    let image = list_item.getElementById('top-song-img')

    title.innerText = song.title
    title.setAttribute('href', `#/folder/${encodeURIComponent(song.folder)}/${encodeURIComponent(song.title)}`)
    title.setAttribute('data-folder', song.folder)
    title.setAttribute('data-link', song.filepath)
    
    album.innerText = song.album
    image.style.backgroundImage = `url(${song.image})`
    printSongArtists(song.artists, artist_node)

    return list_item
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

            folder_table.innerHTML = ''
            folder_table.scrollTop = 0;


            songs['all_files'].map(song => {
                playlist.songs.push(song)
                let list_item = createListItem(song)

                folder_table.appendChild(list_item)
            });

            (() => {
                let folder_header = document.getElementById('album-title-of-the-day')
                let folder_count = document.getElementById('album-artist-of-the-day')

                folder_header.innerText = folder_details['folder_name'];
                folder_count.innerText = `${folder_details['count']} Songs`
            })();

            playlist.type = 'folder';
            playlist.name = folder;
            localStorage.setItem('playlist', JSON.stringify(playlist));
        },
    )

    getFolderArtists(folder).then(
        artists => {
            let folder_artists_node = document.getElementById('folder-artists')
            folder_artists_node.innerText = ''

            let artist_node = document.getElementById('top-artists-item')

            artists.forEach(artist_array => {
                artist_array.map(artist => {
                    let artistits = artist_node.content.cloneNode(true)

                    let artist_link = artistits.getElementById('artist-name')
                    let artist_image = artistits.getElementById('artist-image')

                    artist_image.style.backgroundImage = `url(${artist.image})`
                    artist_link.innerText = artist.name
                    artist_link.href = `#/artist/${encodeURIComponent(artist.name)}`

                    folder_artists_node.appendChild(artistits)
                });
            });

        }
    );
};


let playSongById = (name) => {
    let findSong = () => {
        if (playlist.songs.length == 0) {
            setTimeout(() => {
                findSong();
            }, 1000)
        } else {
            updateQueue();
            queue.current = queue.songs.findIndex(song => song.title == name);
            let song = queue.songs[queue.current];

            localStorage.removeItem('queue');
            localStorage.setItem('queue', JSON.stringify(queue));
            // console.log(queue)

            if (song) {
                playAudio(song.filepath, song.length);
            }
        };
    };

    findSong();
};

let updateQueue = () => {
    queue.songs = [];

    playlist.songs.map(song => {
        queue.songs.push(song);
    })

    localStorage.setItem('queue', JSON.stringify(queue));
}

let playNextSong = () => {
    let queue_obj = JSON.parse(localStorage.getItem('queue'));
    // console.log(queue_obj.current)
    
    queue_obj.current ++;
    
    // localStorage.removeItem('queue');
    localStorage.setItem('queue', JSON.stringify(queue_obj));

    console.log(queue_obj.current + ' ~ ' + queue_obj.songs.length);
    
    if (queue_obj.current >= queue_obj.songs.length) {
        playAudio(queue_obj.songs[0].filepath, queue_obj.songs[0].length);
        queue_obj.current = 0;

        localStorage.setItem('queue', JSON.stringify(queue_obj));
    } else {
        playAudio(queue_obj.songs[queue_obj.current].filepath, queue_obj.songs[queue_obj.current].length);
        // localStorage.setItem('queue', JSON.stringify(queue_obj));
    }
}

let playPreviousSong = () => {
    let queue = JSON.parse(localStorage.getItem('queue'));
    
    queue.current--;
    localStorage.setItem('queue', JSON.stringify(queue));

    if (queue.current <= 0) {
        queue.current = queue.songs.length - 1;
        playAudio(queue.songs[queue.songs.length - 1].filepath, queue.songs[queue.songs.length - 1].length);

        localStorage.setItem('queue', JSON.stringify(queue));
    } else {
        playAudio(queue.songs[queue.current].filepath, queue.songs[queue.current].filepath)
    }
}

let updateTags = () => {
    let queue = JSON.parse(localStorage.getItem('queue'));
    let song = queue.songs[queue.current];

    let title = document.getElementById('now-playing-title')
    let artists = document.getElementById('now-playing-artist')
    let album_art = document.getElementById('now-playing-album-art')

    title.innerText = song['title']
    printSongArtists(song.artists, artists)
    album_art.style.backgroundImage = `url(${song['image']})`

    updateNotification(song['title'], song['artists'][0], song['album'], song['image']);
}

export {
    printFolders,
    printFiles,
    printArtist,

    prepareFolderView,
    prepareHomeView,
    prepareArtistView,

    playSongById,
    playNextSong,
    playPreviousSong,
    updateTags,

    playlist,
}