'use strict';

document.addEventListener('DOMContentLoaded', populateDropdowns);
document.getElementById('send').addEventListener('click', sendPriority);
document.getElementById('task1').addEventListener('keydown', addTaskInput);

function sendPriority() {

    var title = document.getElementById('priority').value;

    if (title == '') {
        remindTitle();
        return;
    }

    var description = document.getElementById('description').value;
    var dueDate = document.getElementById('dueDate').value.toString();
    var user_id = '';
    var client_id = '';

    if (document.getElementById('userSelect').value != 'Me') {
        user_id = document.getElementById('userSelect').value;
    }
    if (document.getElementById('clientSelect').value != 'None') {
        client_id = document.getElementById('clientSelect').value;
    }

    if (document.getElementById('task1').value != '') {
        var tasks = collectTasks();
    }

    var priority = 'title=' + title + '&description=' + description + '&due=' + dueDate + '&user_id=' + user_id + '&client_id=' + client_id + '&tasks=' + tasks;

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

    function collectTasks() {
        var string = '';

        string += document.getElementById('task1').value;
        string += ',';

        var tasks = document.getElementById('taskBox').getElementsByTagName('input');

        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].value != '') {
                string += tasks[i].value;
                string += ',';
            }
        }

        string = string.slice(0, -1);

        return string;
    }

}


function populateDropdowns() {

    chrome.storage.sync.get('key', function(data) {

        var APIkey = data.key;

        populateUsers();
        populateClients();


        function populateClients() {
            var clientRequest = new XMLHttpRequest();
            clientRequest.open('GET', 'https://www.yallahq.com/api/v1/client?');
            clientRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            clientRequest.setRequestHeader('API_KEY', APIkey);

            clientRequest.addEventListener('load', function() {
                var clientObject = JSON.parse(clientRequest.responseText);

                for (var i = 0; i < clientObject.length; i++) {
                    var clientName = clientObject[i].name;
                    var clientID = clientObject[i].id;

                    var option = document.createElement('option');
                    option.setAttribute('value', clientID);
                    option.innerText = clientName;

                    document.getElementById('clientSelect').appendChild(option);
                }
            });

            clientRequest.addEventListener('error', function() {
                alert(clientRequest.responseText);
            });

            clientRequest.send();
        }

        function populateUsers() {
            var userRequest = new XMLHttpRequest();
            userRequest.open('GET', 'https://www.yallahq.com/api/v1/user?');
            userRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            userRequest.setRequestHeader('API_KEY', APIkey);

            userRequest.addEventListener('load', function() {
                var userObject = JSON.parse(userRequest.responseText);

                for (var i = 0; i < userObject.length; i++) {
                    var userName = userObject[i].name;
                    var userID = userObject[i].user_id;

                    var option = document.createElement('option');
                    option.setAttribute('value', userID);
                    option.innerText = userName;

                    document.getElementById('userSelect').appendChild(option);
                }
            });

            userRequest.addEventListener('error', function() {
                alert(userRequest.responseText);
            });

            userRequest.send();
        }



    });

}


function clearFields() {
    document.getElementById('priority').value = '';
    document.getElementById('description').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('userSelect').selectedIndex = 0;
    document.getElementById('clientSelect').selectedIndex = 0;
    document.getElementById('task1').value = '';

    var taskBox = document.getElementById('taskBox');

    while (taskBox.firstChild) {
        taskBox.removeChild(taskBox.firstChild);
    }


}

function addTaskInput(event) {
    if (event.which == 13 || event.keyCode == 13) {

        this.removeEventListener('keydown', addTaskInput);

        var newTask = document.createElement('input');
        newTask.setAttribute('type', 'text');
        newTask.setAttribute('size', 28);

        newTask.addEventListener('keydown', addTaskInput);

        document.getElementById('taskBox').appendChild(newTask);
        newTask.focus();
    }
}

//Add page=2, page=3 etc to get next 15 clients