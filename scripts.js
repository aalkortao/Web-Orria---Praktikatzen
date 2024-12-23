// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('/events')
        .then(response => response.json())
        .then(events => {
            const eventList = document.getElementById('event-list');
            events.forEach(event => {
                const listItem = document.createElement('li');
                listItem.textContent = `${event.name} - ${new Date(event.date).toLocaleDateString()}`;
                const form = document.createElement('form');
                form.action = `/register/${event._id}`;
                form.method = 'post';
                const input = document.createElement('input');
                input.type = 'text';
                input.name = 'name';
                input.placeholder = 'Zure izena';
                const button = document.createElement('button');
                button.type = 'submit';
                button.textContent = 'Apuntatu';
                form.appendChild(input);
                form.appendChild(button);
                listItem.appendChild(form);
                eventList.appendChild(listItem);
            });
        });
});
