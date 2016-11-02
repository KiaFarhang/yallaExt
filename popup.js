'use strict';

document.addEventListener('DOMContentLoaded', populateUsers);
document.getElementById('send').addEventListener('click', sendPriority);

function sendPriority() {

    var title = document.getElementById('priority').value;

    if (title == '') {
        remindTitle();
        return;
    }

    var description = document.getElementById('description').value;
    var dueDate = document.getElementById('dueDate').value.toString();
    var user_id;

    if (document.getElementById('userSelect').value != 'Me') {
        user_id = document.getElementById('userSelect').value;
    }


    var priority = 'title=' + title + '&description=' + description + '&due=' + dueDate + '&user_id=' + user_id;

    chrome.storage.sync.get('key', function(data) {

        var APIkey = data.key;

        var request = new XMLHttpRequest();
        request.open('POST', 'https://www.yallahq.com/api/v1/priority?');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('API_KEY', APIkey);


        request.addEventListener('load', function() {
            clearFields();
        });

        request.addEventListener('error', function() {
            alert(request.responseText);
        });

        request.send(priority);

    });


    function remindTitle() {
        document.getElementById('priority').focus();
        var statusArea = document.getElementById('titleCheck');
        statusArea.innerText = 'Please enter a priority title';
        setTimeout(function() {
            statusArea.innerText = '';
        }, 2000);
        return;
    }

}


function populateUsers() {

    chrome.storage.sync.get('key', function(data) {

        var APIkey = data.key;

        var userRequest = new XMLHttpRequest();
        userRequest.open('GET', 'https://www.yallahq.com/api/v1/user?');
        userRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        userRequest.setRequestHeader('API_KEY', APIkey);

        userRequest.addEventListener('load', function() {
            var userObject = JSON.parse(userRequest.responseText);

            // alert(userObject[0].name);
            // alert(userObject[0].user_id);

            for (var i = 0; i < userObject.length; i++) {
                var userName = userObject[i].name;
                var userID = userObject[i].user_id;

                var option = document.createElement('option');
                option.setAttribute('value', userID);
                option.innerText = userName;

                document.getElementById('userSelect').appendChild(option);
            }
        })

        userRequest.addEventListener('error', function() {
            alert(userRequest.responseText);
        })

        userRequest.send();

    });



    // var selectBox = document.getElementById('userSelect');

    // for (var i = 0; i < 10; i++) {

    //     var val = i * 5;

    //     var option = document.createElement('option');
    //     option.setAttribute('value', val);
    //     option.innerText = val;
    //     selectBox.appendChild(option);
    // }

}



function clearFields() {
    document.getElementById('priority').value = '';
    document.getElementById('description').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('userSelect').selectedIndex = 0;
}


// user_id : to send a priority to someone else
