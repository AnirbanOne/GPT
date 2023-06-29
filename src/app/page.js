"use client"; // This is a client component

import Image from "next/image";
import Head from "next/head";
import { Inter } from "next/font/google";
import { useState } from "react";
import axios from "axios";
import TypingAnimations from "./components/TypingAnimations";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = (message) => {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAPI_API_KEY}`,
    };

    const data = {
      model: "gpt-3.5-turbo-0613",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    };

    setIsLoading(true);

    axios
      .post(url, data, { headers: headers })
      .then((response) => {
        console.log(response);
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: "bot", message: response.data.choices[0].message.content },
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container mx-auto w-full min-h-screen">
        <div className="flex flex-col flex-grow h-[100vh] bg-gray-900">
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
            MyGPT
          </h1>
          
          <div className="flex-grow p-6">
            <div className="flex flex-col space-y-4">
              {chatLog.map((message, index) => (
                <div key={index} className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                <div className={`flex ${
                  message.type === 'user' ? 'bg-purple-500' : 'bg-gray-500'
                } rounded-lg p-4 text-white max-w-sm whitespace-pre-wrap`}>
                {message.message}
                </div>
                </div>
              ))}

              {
                isLoading && <div key={chatLog.length} className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                    <TypingAnimations />
                  </div>
                </div>
              }
            </div>
          </div>

<div>
<form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">
          <input
              type="text"
              placeholder="Type Your Message Here..."
              value={inputValue}
              className=" flex-grow px-4 py-2
              bg-transparent text-white focus:outline-none"
              onChange={(e) => setInputValue(e.target.value)}
            ></input>
            <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
          </div>
            
          </form>
</div>
          
        </div>
      </div>
    </>
  );
}
