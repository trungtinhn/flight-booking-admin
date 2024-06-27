export interface Message {
    id: number;
    createdAt: string | number | Date;
    senderId: string;
    receiverId: string;
    message: string;
}

export class WebSocketService {
    private ws: WebSocket;
    public onMessage: (msg: Message) => void = () => { };

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.ws.onmessage = (event) => {
            const message: Message = JSON.parse(event.data);
            this.onMessage(message);
        };
    }

    public sendMessage(message: Message) {
        this.ws.send(JSON.stringify(message));
    }

    public close() {
        this.ws.close();
    }
}
