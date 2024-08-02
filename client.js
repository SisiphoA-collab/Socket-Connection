const socket = io();

socket.on('load statuses', (statuses) => {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    statuses.forEach(status => {
        const statusElement = document.createElement('div');
        statusElement.innerText = `${status.user}: ${status.status} (${status.timestamp})`;
        feed.appendChild(statusElement);
    });
});

socket.on('update statuses', (data) => {
    const feed = document.getElementById('feed');
    const statusElement = document.createElement('div');
    statusElement.innerText = `${data.user}: ${data.status}`;
    feed.insertBefore(statusElement, feed.firstChild);
});

function sendStatus() {
    const user = document.getElementById('username').value;
    const status = document.getElementById('status').value;
    socket.emit('new status', { user, status });
    document.getElementById('status').value = '';
}
