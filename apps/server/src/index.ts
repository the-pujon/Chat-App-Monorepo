import http from 'http';

const init = async () =>{
const httpServer = await http.createServer()
const port = process.env.PORT || 6000;
    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}::: ${new Date().toLocaleString()} \n :::: http://localhost:${port}`);
    });
}

init().catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
});
export default init;