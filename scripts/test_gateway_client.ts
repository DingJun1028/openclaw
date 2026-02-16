import WebSocket from 'ws';

const GATEWAY_URL = "ws://localhost:19001";

const clientInfo = {
    id: 'test',
    version: '1.0.0',
    platform: 'node',
    mode: 'test',
};

const connectFrame = {
    minProtocol: 1,
    maxProtocol: 1,
    client: clientInfo,
    // auth: { token: '...' } // Optional if auth is not enforced for 'test' mode or loopback
};

const ws = new WebSocket(GATEWAY_URL);

ws.on('open', () => {
    console.log('Connected to Gateway');
    console.log('Sending connect frame:', JSON.stringify(connectFrame, null, 2));
    ws.send(JSON.stringify(connectFrame));
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString());
        console.log('Received message:', JSON.stringify(message, null, 2));

        if (message.type === 'hello-ok') {
            console.log('Handshake successful!');

            // Send a test chat message
            const chatReq = {
                type: 'req',
                id: 'req-' + Date.now(),
                method: 'chat.send',
                params: {
                    messages: [{ role: 'user', content: 'Hello from test client!' }],
                    model: 'claude-3-5-sonnet-20240620' // Use a default or configured alias
                }
            };

            console.log('Sending chat request:', JSON.stringify(chatReq, null, 2));
            ws.send(JSON.stringify(chatReq));
        }
    } catch (err) {
        console.error('Failed to parse message:', err);
    }
});

ws.on('error', (err) => {
    console.error('WebSocket error:', err);
});

ws.on('close', (code, reason) => {
    console.log(`Disconnected: ${code} ${reason}`);
});
