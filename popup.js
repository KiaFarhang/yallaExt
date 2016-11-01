'use strict';

document.getElementById('send').addEventListener('click', sendPriority);

function sendPriority() {

    var title = 'title=' + document.getElementById('priority').value;

    chrome.storage.sync.get('key', function(data) {

        var APIkey = data.key;

        var request = new XMLHttpRequest();
        request.open('POST', 'https://www.yallahq.com/api/v1/priority?');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('API_KEY', APIkey);


        request.addEventListener('load', function() {
            // alert('it worked!');
        });

        request.addEventListener('error', function() {
            // alert('nah');
        });

        request.send(title);

    });


}
