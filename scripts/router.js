import { printFiles, prepareFolderView, prepareHomeView, playSongById } from './dom-helper.js'

let goToFolderItems = () => {
    prepareFolderView();
    printFiles(window.location.hash.split('/')[2]);
}

let goToHome = () => {
    prepareHomeView();
}
function get(){
    console.log("leggo")
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
        
    if (type == "f"){
        let folder_id = urlq.split('/')[2];
        let song_id = urlq.split('/')[3];

        if (folder_id) {
            route('/f/' + folder_id, 'folder')
        }

        if (song_id) {
            route('/f/'+ folder_id + '/' + song_id, 'play')
        }
    }

    const routeResolved = resolveRoute(url);
    
    routeResolved();
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

route('/', 'home');
// route('/folder', 'folder')
