import { useEffect, useRef, useState } from "react";
import {
  faMessage,
  faXmark,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Message = {
  text: string;
  sender: "user" | "bot";
};

const responses: string[] = [
  "Hello, how can I help you?",
  "I recommend Ender's Game, The Witcher, and Harry Potter!",
  "Let me know if you want more recommendations.",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");
  const [conversation, setConversation] = useState<Message[]>([
    { text: responses[0]!, sender: "bot" },
  ]);
  const [messageIndex, setMessageIndex] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setConversation((prev) => [...prev, { text: trimmed, sender: "user" }]);
    setInputText("");

    setTimeout(() => {
      try {
        const nextBotResponse = responses[messageIndex];
        if (typeof nextBotResponse === "string") {
          setConversation((prev) => [
            ...prev,
            { text: nextBotResponse, sender: "bot" },
          ]);
          setMessageIndex((prev) => prev + 1);
        } else {
          // fallback
          setConversation((prev) => [
            ...prev,
            { text: "Sorry, having trouble understanding.", sender: "bot" },
          ]);
        }
      } catch {
        setConversation((prev) => [
          ...prev,
          { text: "Sorry, something went wrong.", sender: "bot" },
        ]);
      }
    }, 1700);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-[#722420] p-4 px-5 text-white shadow-lg transition hover:bg-[#722420]"
        >
          <FontAwesomeIcon icon={faMessage} size="lg" />
        </button>
      ) : (
        <div className="flex h-[450px] w-96 flex-col overflow-hidden rounded-xl border border-gray-200 bg-[#722420] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#722420] px-4 py-2 text-white">
            <span className="font-semibold">Use our AI Chatbot!</span>
            <button onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3 text-sm">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] rounded-lg p-2 text-sm shadow ${
                  msg.sender === "user"
                    ? "ml-auto self-end bg-[#722420] text-white"
                    : "self-start bg-white text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex border-t bg-white p-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Recommendations, book info, etc..."
              className="flex-1 rounded-l border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="rounded-r bg-[#722420] px-4 py-2 text-white hover:bg-[#722420]"
            >
              <FontAwesomeIcon icon={faPaperPlane} size="lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
