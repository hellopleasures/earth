interface ChatBoxProps {
    messages: { sender: string; text: string }[];
  }
  
  const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => (
    <div className="flex-1 overflow-y-auto max-h-[500px]">
      <div className="flex flex-col gap-4 p-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-4 sm:max-w-[80%] ${
              message.sender === "user" ? "self-end flex-row-reverse" : ""
            }`}
          >
            <img 
              src={message.sender === "user" ? "/user.jpg" : "/globe.png"} 
              className="w-10 h-10 rounded-full object-cover"
              alt="Profile"
            />
            <div className={`
              px-3 py-2 rounded-[20px]
              ${message.sender === "user" 
                ? "bg-gray-600 text-white" 
                : "bg-pink-600 text-white"}
            `}>
              <span className="text-xs sm:text-sm leading-none">{message.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default ChatBox;
  
  
  
  