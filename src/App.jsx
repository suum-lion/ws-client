import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const socketUrl = "ws://127.0.0.1:8000";
  const [text, setText] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const contentRef = useRef();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl
  );

  useEffect(() => {
    if (lastJsonMessage) {
      setMessageHistory(prev => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  const handleClickSendMessage = useCallback(() => {
    sendJsonMessage({ type: "contentchange", content: text });
    setText("");
    contentRef.current.focus();
  }, [text]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];

  return (
    <>
      <input
        ref={contentRef}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyPress={e => {
          if (e.code === "Enter") handleClickSendMessage();
        }}
      />
      <button
        type="button"
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      <p>Socket URL: {socketUrl}</p>
      <div>content: {text}</div>
      <div>The WebSocket is currently {connectionStatus}</div>
      {Boolean(lastJsonMessage) && (
        <p>Last message: {lastJsonMessage.data.content}</p>
      )}
      <ul>
        {messageHistory.map((message, idx) => (
          <li key={idx}>
            {idx}: {message.data.content}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
