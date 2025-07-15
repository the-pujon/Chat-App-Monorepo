import http from "http";
import SocketService from "./services/socket";

const init = async () => {
  const socketService = new SocketService()
  const httpServer = await http.createServer();
  const port = process.env.PORT || 5000;

  socketService.io.attach(httpServer)

  httpServer.listen(port, () => {
    console.log(
      `Server is running on port ${port}::: ${new Date().toLocaleString()} \n :::: http://localhost:${port}`
    );
  });

  socketService.initListeners();
};

init().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
export default init;
