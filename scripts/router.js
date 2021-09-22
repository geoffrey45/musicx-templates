import { printFiles, prepareFolderView, prepareHomeView, playSongById, prepareArtistView } from './dom-helper.js'

let goToFolderItems = () => {
    prepareFolderView();
    printFiles(window.location.hash.split('/')[2]);
}

let goToHome = () => {
    prepareHomeView();
}

let goToArtist = () => {
    let name = window.location.hash.split('/')[2];
    prepareArtistView(decodeURIComponent(name));
}

let playSong = () => {
    // prepareFolderView();
    // printFiles(window.location.hash.split('/')[2]);

    let song_id = window.location.hash.split('/')[3];
    playSongById(decodeURIComponent(song_id));
    
};

let routes = {};
let templates = {};

let template = (name, templateFunction) => {
    return templates[name] = templateFunction;
}

let route = (path, template) => {
    if (typeof template == "function") {
        return routes[path] = template;
    }
    else if (typeof template == "string") {
        return routes[path] = templates[template];
    }
    else {
        return;
    }
};

template('home', () => {
    goToHome();
});

template('artist', () => {
    goToArtist();
})

// template('folder', () => {
//     goToFolder();
// });

template('play', ()=> {
    playSong();
});

template ('folder', () => {
    goToFolderItems();
});

let resolveRoute = (path) => {
    try {
        return routes[path];
    } catch (error) {
        throw new Error(`Route ${path} not found`);
    };
};
let router = (evt) => {
    const urlq = window.location.hash;

    let url = urlq.slice(1) || '/';
    let type = urlq.split('/')[1];
        
    if (type == "folder"){
        let folder_id = urlq.split('/')[2];
        console.log(folder_id)
        let song_id = urlq.split('/')[3];

        if (folder_id) {
            route('/folder/' + folder_id, 'folder')
        }

        if (song_id) {
            route('/folder/'+ folder_id + '/' + song_id, 'play')
        }
    }
    else if (type == "artist"){
        let artist_id = urlq.split('/')[2];
        console.log(artist_id)

        if (artist_id) {
            route('/artist/' + urlq.split('/')[2], 'artist')
        }
    }

    const routeResolved = resolveRoute(url);
    
    routeResolved();
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

route('/', 'home');
// route('/folder', 'folder')
