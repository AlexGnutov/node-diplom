window.onload = () => {
    // LOGIN + LOGOUT
    const url = document.getElementById('url');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const login = document.getElementById('login-btn');
    const logout = document.getElementById('logout-btn');
    const serverReply = document.getElementById('server-reply');

    // Login HTTP request
    login.addEventListener('click', sendLoginReq);
    async function sendLoginReq() {
        const URL = url.value;

        const loginData = `email=${email.value}&password=${password.value}`;

        fetch(
            URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/html',
                    'Content-Type':'application/x-www-form-urlencoded',
                },
                body: loginData,
            }
        ).then(response => {
            console.log('Body: ', response.body);
            console.log('BodyUsed: ', response.bodyUsed);
            console.log('Headers: ', response.headers);
            console.log('Status Text: ', response.statusText);
            console.log('Status: ', response.status);
            return response.text()
        }).then(data => serverReply.innerText = data);
    }
    // Logout HTTP request
    logout.addEventListener('click', () => {
        fetch(
            'http://localhost:8080/api/auth/logout',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/html',
                    'Content-Type':'application/x-www-form-urlencoded',
                },
            },
        ).then(response => response.text())
            .then(data => serverReply.innerText = data);
    })

    // WEB SOCKETS init and operations

    // Pick-up page elements
    const messageName = document.getElementById('message-name');
    const messageData = document.getElementById('message-data');
    const sendButton = document.getElementById('send');
    const startSocket = document.getElementById('start-socket')
    const socketReply = document.getElementById('socket-reply');

    const socket = io('http://localhost:8080',{
        autoConnect: false,
        reconnection: false,
        timeout: 5000,
    });

    // Create socket connection
    startSocket.addEventListener('click', () => {
        socket.connect();// Start client socket
    });

    // Senders
    sendButton.addEventListener('click', () => {
        socket.emit(messageName.value, messageData.value);
    });

    // Receivers
    socket.on('server-reply', (data) => {
        socketReply.innerText = data;
    });

};

