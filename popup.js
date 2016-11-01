'use strict';

document.getElementById('send').addEventListener('click', sendPriority);

function sendPriority() {

    var title = document.getElementById('priority').value;
    var description = document.getElementById('description').value;
    var dueDate = document.getElementById('dueDate').value.toString();

    var priority = 'title=' + title + '&description=' + description + '&due=' + dueDate;

    chrome.storage.sync.get('key', function(data) { 

        var APIkey = data.key;

        var request = new XMLHttpRequest();
        request.open('POST', 'https://www.yallahq.com/api/v1/priority?');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('API_KEY', APIkey);


        request.addEventListener('load', function() {
           document.getElementById('priority').value = '';
           document.getElementById('description').value = '';
           document.getElementById('dueDate').value = '';
        });

        request.addEventListener('error', function() {
            alert('nah');
            alert(request.responseText);
        });

        request.send(priority);

    });


}
