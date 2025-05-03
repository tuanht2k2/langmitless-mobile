import Stomp from "stompjs";

class SocketManager {
  private clients: Stomp.Client[] = [];

  addClient(client: Stomp.Client) {
    this.clients.push(client);
  }

  removeClient(client: Stomp.Client) {
    this.clients = this.clients.filter((c) => c !== client);
  }

  disconnectAll() {
    this.clients.forEach((client) => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("Client disconnected");
        });
      }
    });
    this.clients = [];
  }
}

const socketManager = new SocketManager();
export default socketManager;
