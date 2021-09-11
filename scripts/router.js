import { printFiles, prepareFolderView, prepareHomeView } from './dom-helper.js'

let goToFolderItems = () => {
    prepareFolderView();
    printFiles(window.location.hash.slice(9) || '/');
}

let goToHome = () => {
    prepareHomeView();
}

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

    let folder_id = urlq.slice(9) || '/';

    if (folder_id) {
        route('/folder/' + folder_id, 'folder')
    }

    const routeResolved = resolveRoute(url);
    
    routeResolved();
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

route('/', 'home');
route('/folder', 'folder')
