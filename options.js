function saveAPIKey() {

    chrome.storage.sync.clear();

    var obj = {
        key : document.getElementById('APIkey').value
    };

    chrome.storage.sync.set(obj, function(){
        var status = document.getElementById('status');
        status.textContent = 'Saved';
    });
}

document.getElementById('save').addEventListener('click', saveAPIKey);