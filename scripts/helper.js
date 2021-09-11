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

export {
    getFolders,
    getFiles
}