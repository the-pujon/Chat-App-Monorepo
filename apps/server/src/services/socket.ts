import Redis from "ioredis";
import { Server } from "socket.io";


const pub = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379, // ✅ convert to number
  username: process.env.REDIS_USERNAME || undefined, // ✅ optional: omit if not needed
  // password: process.env.REDIS_PASSWORD || undefined, // 🔒 include if Redis has auth
});


const sub = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379, // ✅ convert to number
  username: process.env.REDIS_USERNAME || undefined, // ✅ optional: omit if not needed
  // password: process.env.REDIS_PASSWORD || undefined, // 🔒 include if Redis has auth
});
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
        sub.subscribe("MESSAGES")
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
            socket.on("event:message", async (data) => {
                const {message}  = data; // Destructure data if needed
                console.log("Message received:", data, "from user:", socket.id, "message:", message);
                // Broadcast the message to all connected clients
                io.emit("message", data);

                //publish the messages
                await pub.publish('MESSAGES', JSON.stringify({message}))
            });

            sub.on("message", (channel, message)=>{
                if(channel === "MESSAGES") io.emit("message", message)
            })
        });
    }

    get io(){
        return this._io;
    }
}

export default SocketService;

