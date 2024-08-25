const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}

// Referencias HTML
const lblStatusOnline = document.querySelector('#status-online');
const lblStatusOffline = document.querySelector('#status-offline');
const usersUlElement = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');
const sendIcon = document.querySelector('.fa-paper-plane');
const chatElement = document.querySelector('#chat');
const nameElement = document.querySelector('.name');
const seenElement = document.querySelector('.seen');
const timeElement = document.querySelector('.time');
const currentTime = new Date().toLocaleTimeString('es-AR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const renderUsers = (users) => {
  usersUlElement.innerHTML = '';
  users.forEach((user) => {
    const liElement = document.createElement('li');
    liElement.innerText = user.name;
    usersUlElement.appendChild(liElement);
  });
};

const renderMessage = (payload) => {
  const { userId, message, name } = payload;

  const divElement = document.createElement('div');
  divElement.classList.add('message');

  if (userId !== socket.id) {
    divElement.classList.add('incoming');
  }

  divElement.innerHTML = `<small>${name}</small> <p>${message}</p>`;
  chatElement.appendChild(divElement);

  // Scroll al final de los mensajes
  chatElement.scrollTop = chatElement.scrollHeight;
};

sendIcon.addEventListener('click', () => {
  form.requestSubmit();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = input.value;
  input.value = '';
  socket.emit('send-message', message);
});

const socket = io({
  auth: {
    token: 'ABC-123',
    name: username,
  },
});

//cambio nombre defecto por el del usuario
nameElement.textContent = socket.auth.name;
// console.log(socket.auth.name);

//cambio hora por defecto por la del usuario
seenElement.textContent = `Hoy a las ${currentTime}`;
timeElement.textContent = `Hoy a las ${currentTime}`;

socket.on('connect', () => {
  lblStatusOnline.classList.remove('hidden');
  lblStatusOffline.classList.add('hidden');
  // console.log('Conectado');
});

socket.on('disconnect', () => {
  lblStatusOnline.classList.add('hidden');
  lblStatusOffline.classList.remove('hidden');
  // console.log('Desconectado');
});

socket.on('welcome-message', (data) => {
  console.log({ data });
});

socket.on('on-clients-changed', renderUsers);

// socket.on('on-message', (data) => {
//   console.log({ data });
// });

socket.on('on-message', renderMessage);
