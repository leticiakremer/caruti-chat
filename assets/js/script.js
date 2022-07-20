//var user = prompt("Informe seu nome:")
var user = "Usuário"

console.log(user)

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://10.0.0.113:8080/chatHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();


async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

connection.onclose(async () => {
    await start();
});

connection.on("ReceiveMessage", function (message) {
    console.log(message)

    //Criando uma variavel com o elemento div com id history
    var historyDiv = document.getElementById("history")
    var pElement = document.createElement("p")
    var textElement = document.createTextNode(message.user + ": " + message.message)
    pElement.appendChild(textElement)
    historyDiv.appendChild(pElement)
})

function sendMessage() {
    console.log("entrou")

    var messageInput = document.getElementById("message")
    var value = messageInput.value
    var message = {
        connectionId: connection.connectionId,
        user: user,
        message: value
    }

    fetch("http://10.0.0.113:8080/api/message", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(message)
      }).then(res => {
        console.log("Request complete! response:", res);
      });
}

start()