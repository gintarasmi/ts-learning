var socket = io();

var messages = document.getElementById('messages');

socket.on('getCats', async function () {
  const response = await fetch('/cat/getAll');
  const data = await response.json();
  const cats = data.model;
  cats.forEach((element) => {
    var item = document.createElement('li');
    item.textContent = element.givenName;
    messages.appendChild(item);
  });
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('new cat', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
