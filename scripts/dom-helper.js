import { getFolders, getFiles } from './helper.js'


let album_of_the_day = document.getElementById('album-of-the-day');
let top_artists_card = document.getElementsByClassName('top-artists')[0];
let know_your_artist_card = document.getElementById('top-songs-right');
let top_songs_card = document.getElementsByClassName('top-songs')[0];
let album_of_the_day_grid = document.getElementById('album-of-the-day-grid');

let prepareHomeView = () => {
    album_of_the_day_grid.innerHTML = '';

    let album = album_of_the_day.content.cloneNode(true);
    console.log('album');

    top_artists_card.style.display = 'unset';
    know_your_artist_card.style.display = 'unset';
    top_songs_card.classList.replace('folder-list', 'top-songs');
    top_songs_card.getElementsByClassName('card-header')[0].innerHTML = "Top Songs"
    album_of_the_day_grid.appendChild(album);
}

let folder_details = {
    'folder_name': '',
    'count': 0
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
    document.getElementById('artist-image').style.display = "none"
    document.getElementById('album-art-of-the-day').style.width = '100%'
};

let printFolders = () => {
    let folder_dom = document.getElementsByClassName('context')[0]
    // console.log(folder_dom)

    return getFolders().then(
        folders => {
            folders.map(folder => {
                let folder_item = document.createElement('span')
                folder_item.className = 'folder-item'

                let folder_link = document.createElement('a')
                folder_link.href = `#/folder/${folder.url}`
                folder_link.innerText = folder.name;

                folder_item.appendChild(folder_link)
                folder_dom.appendChild(folder_item)

            });
            console.log(`Retrieved ${folders.length} folders`)
        });
}

let printFiles = (folder) => {
    console.log(folder)
    getFiles(folder).then(
        songs => {
            folder_details['folder_name'] = songs['folder_name'];
            folder_details['count'] = songs['count'];

            console.log(songs)
            let folder_table = document.getElementById('folder-table')
            let file_dom = document.getElementById('list-item')

            folder_table.innerHTML = ''

            songs['all_files'].map(song => {
                let list_item = file_dom.content.cloneNode(true)

                let title = list_item.getElementById('list-item-title')
                let artist = list_item.getElementById('list-item-artist')
                let album = list_item.getElementById('list-item-album')

                artist.innerText = song.artist
                title.innerText = song.title
                album.innerText = song.album

                folder_table.appendChild(list_item)
            });

            (() => {
                console.log(`Retrieved ${songs.length} songs from ${songs['folder_name']}`)

                let folder_header = document.getElementById('album-title-of-the-day')
                let folder_count = document.getElementById('album-artist-of-the-day')

                folder_header.innerText = folder_details['folder_name'];
                folder_count.innerText = `${folder_details['count']} Songs`
            })();
        }
    )
}

export { printFolders, printFiles, prepareFolderView, prepareHomeView }