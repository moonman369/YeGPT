import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useCookies } from "react-cookie";

function YeChat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [cookies, setCookies] = useCookies({
    messages: [],
  });
  const [kanyeTyping, setKanyeTyping] = useState(false);
  const msgContainer = useRef(null);

  useEffect(() => {
    const lastMsg = msgContainer?.current?.lastElementChild;
    console.log(lastMsg);
    lastMsg?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const local = localStorage.getItem("messages");
    localStorage.clear();
    localStorage.setItem("messages", local);

    setMessages(
      JSON.parse(localStorage.getItem("messages")) || cookies?.messages || []
    );
  }, []);

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };
  // console.log(messages);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userInput) {
      const newMessage = { user: true, text: userInput };
      setMessages([...messages, newMessage, { user: false, text: "loading" }]);
      setKanyeTyping(true);
      axios
        .post(
          // "http://localhost:8080/bot",
          "https://ye-gpt-backend.vercel.app/bot",
          {
            message: userInput,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          // Update messages and setKanyeTyping to false when you receive the response
          const botResponse = {
            user: false,
            text: response.data.results[0].response,
          };
          setCookies("messages", [...messages, newMessage, botResponse]);
          localStorage.setItem(
            "messages",
            JSON.stringify([...messages, newMessage, botResponse])
          );
          setMessages([...messages, newMessage, botResponse]);
          setKanyeTyping(false);
        })
        .catch((error) => {
          console.error(error);
          // Update messages and setKanyeTyping to false when you receive an error
          const botResponse = {
            user: false,
            text: "Oops! Something went wrong.",
          };
          setCookies("messages", [...messages, newMessage, botResponse]);
          localStorage.setItem(
            "messages",
            JSON.stringify([...messages, newMessage, botResponse])
          );
          setMessages([...messages, newMessage, botResponse]);
          setKanyeTyping(false);
        });
      setUserInput("");
      setKanyeTyping(true);
    }
  };

  return (
    <>
      <Head>
        <title>YeGPT - Kanye West AI Chatbot</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>
      <div className="chat-container">
        <div className="header">
          <i className="fa fa-chevron-left back-button"></i>
          <div className="contact-info">
            <img
              className="header-image"
              src="https://imageio.forbes.com/specials-images/imageserve/5ed00f17d4a99d0006d2e738/0x0.jpg?format=jpg&crop=4666,4663,x154,y651,safe&height=416&width=416&fit=bounds"
              alt="Profile"
            />
            <h2 className="name">YeGPT</h2>
          </div>
          <i className="fa fa-video-camera video-icon"></i>
        </div>
        <div className="chat-window">
          {/* <div id="scroller" ref={chatWindowRef} onLoad={scrollBottom}>
            
          </div> */}

          <p className="chat-bot-header">
            Powered by{" "}
            <a
              className="ref-link"
              href="http://metaschool.so/"
              target="_blank"
              rel="noopener noreferrer"
            >
              metaschool 🔮
            </a>
          </p>
          <p className="chat-bot-header">
            Developed by{" "}
            <a
              className="ref-link"
              href="http://devfoliomoonman369.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              moonman369 🎆
            </a>
          </p>
          {messages.map((message, index) => (
            <div key={index} className="message-container" ref={msgContainer}>
              {message.user ? (
                <>
                  <div className="user-message message">
                    <div className="message-text">{message.text}</div>
                  </div>
                  <img
                    className="profile-image user-image"
                    src={
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                    }
                    alt="User Profile"
                  />
                </>
              ) : (
                <>
                  <img
                    className="profile-image bot-image"
                    src="https://imageio.forbes.com/specials-images/imageserve/5ed00f17d4a99d0006d2e738/0x0.jpg?format=jpg&crop=4666,4663,x154,y651,safe&height=416&width=416&fit=bounds"
                    alt="Bot Profile"
                  />
                  {message.text === "loading" ? (
                    <img
                      className="typing-bubble"
                      src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExODg3ZjFlNzQ1Mzc1ZTFlNTMyZTVjODIzMDYyODUwNDQ0ZDY3ZmU5YyZjdD1z/3tLfKrc4pLWiTkAAph/giphy.gif"
                    />
                  ) : (
                    <div className="bot-message message">
                      <div className="message-text">{message.text}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message here..."
            value={userInput}
            onChange={handleChange}
            disabled={kanyeTyping}
          />
          <button type="submit">
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </>
  );
}

export default YeChat;
