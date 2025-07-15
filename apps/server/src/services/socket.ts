import { Server } from "socket.io";

class SocketService {
    private _io: Server
    constructor(){
        console.log("SocketService initialized");
        // Initialize the Socket.IO server
        // Note: The server instance should be passed from the HTTP server in a real application
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
    }

    public initListeners(){
        const io = this._io;
        console.log("Initializing Socket.IO listeners...");
        // Listen for incoming connections
        io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);

            // Handle disconnection
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });

            // Example of handling a custom event
            socket.on("event:message", (data) => {
                const {message}  = data; // Destructure data if needed
                console.log("Message received:", data, "from user:", socket.id, "message:", message);
                // Broadcast the message to all connected clients
                io.emit("message", data);
            });
        });
    }

    get io(){
        return this._io;
    }
}

export default SocketService;

