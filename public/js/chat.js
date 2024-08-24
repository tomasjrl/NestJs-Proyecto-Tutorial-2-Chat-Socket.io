const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}

// Referencias HTML
const lblStatusOnline = document.querySelector('#status-online'); 
const lblStatusOffline = document.querySelector('#status-offline'); 


const socket = io({
  auth: {
    token: 'ABC-123',
    name: username,
  },
});

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
