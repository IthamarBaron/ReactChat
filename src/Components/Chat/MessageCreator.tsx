import React from "react";

import { useState } from "react";

const MessageCreator = ({ userName }: { userName: string }) => {
  const [userInput, setUserInput] = useState("");

  const SendMessage = async () => {
    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            purpose: "addMessage",
            content: { username: userName, message: userInput },
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const data = await response.json();

      console.log(`Server response: ${data}`);
      setUserInput("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type='text'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button
        onClick={() => {
          SendMessage();
        }}
      >
        Send to server
      </button>
    </div>
  );
};

export default MessageCreator;
