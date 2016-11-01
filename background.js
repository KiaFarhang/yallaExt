
chrome.runtime.onInstalled.addListener(function(object) {
    if (object.reason === 'install') {
        // chrome.tabs.create({
        //     url: '/installpage.html',
        //     active: true
        // });

        chrome.runtime.openOptionsPage();
    }
});
