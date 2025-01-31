const express = require("express"); // Use require for CommonJS modules
const cors = require("cors");
const app = express();

app.use(cors());
// Middleware to parse JSON
app.use(express.json());

let messages = [
  {
    username: "john",
    message: "hello",
  },
];

let clients = new Map();

async function addMessage(message) {
  await messages.push(message);
}

app.get("/GetMessage", (req, res) => {
  // check if the client has already requested to get all the messages
  const clientId = req.query.clientId;
  if (clientId && !clients.has(clientId)) {
    clients.set(clientId, messages[messages.length - 1]);
    res.json({ message: messages });
    return;
  }
  if (clients.get(clientId) !== messages[messages.length - 1]) {
    res.json({ message: messages });
    clients.set(clientId, messages[messages.length - 1]);
    return;
  }
  res.json({ message: "no new messages" });
});

// the same as getMessage but it will return the message even if it is the same as the last one
app.get("/GetMessageForce", (req, res) => {
  const clientId = req.query.clientId;
  if (clientId && !clients.has(clientId)) {
    clients.set(clientId, messages[messages.length - 1]);
    res.json({ message: messages });
    return;
  }

  res.json({ message: messages });
  clients.set(clientId, messages[messages.length - 1]);
});

app.get("/hi", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  const { message } = req.body;

  if (message.purpose) {
      console.log(message.purpose);
      //added a check to see if a message is empty and avoids adding a empty message box if so
      if (message.purpose === "addMessage" && message.content.message.length != 0) { 
          messages.push(message.content);
          console.log(message);
      }
  }

  console.log(`Received message: ${message}`);

  if (message === "GetMessage") {
      res.json({ message: messages });
  } else {
      // Process the message and send a response
      const responseMessage = `Server received: ${message} successfully`;
      res.json({ message: responseMessage });
  }
});

// this is an example of how to send a JSON response back to the client
app.get("/api/users", (req, res) => {
  // Send a JSON response back to the client
  res.json([
    { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com" },
    { id: 2, firstName: "Jane", lastName: "Doe", email: "jane@example.com" },
    { id: 3, firstName: "Jim", lastName: "Beam", email: "jim@example.com" },
  ]);
});


const path = require("path");

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
