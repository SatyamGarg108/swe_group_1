import { useEffect, useRef, useState } from "react";
import { faMessage, faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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
  
    setConversation(prev => [...prev, { text: trimmed, sender: "user" }]);
    setInputText("");
  
    setTimeout(() => {
      try {
        const nextBotResponse = responses[messageIndex];
        if (typeof nextBotResponse === "string") {
          setConversation(prev => [
            ...prev,
            { text: nextBotResponse, sender: "bot" },
          ]);
          setMessageIndex(prev => prev + 1);
        } else {
          // fallback
          setConversation(prev => [
            ...prev,
            { text: "Sorry, having trouble understanding.", sender: "bot" },
          ]);
        }
      } catch {
        setConversation(prev => [
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
          className="rounded-full bg-[#722420] p-4 px-5 text-white shadow-lg hover:bg-[#722420] transition"
        >
          <FontAwesomeIcon icon={faMessage} size="lg" />
        </button>
      ) : (
        <div className="w-96 h-[450px] bg-[#722420] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#722420] text-white">
            <span className="font-semibold">Use our AI Chatbot!</span>
            <button onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm bg-gray-50">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-2 rounded-lg shadow text-sm ${
                  msg.sender === "user"
                    ? "bg-[#722420] text-white self-end ml-auto"
                    : "bg-white text-gray-800 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex border-t p-2 bg-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Recommendations, book info, etc..."
              className="flex-1 p-2 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-[#722420] hover:bg-[#722420] text-white px-4 py-2 rounded-r"
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
