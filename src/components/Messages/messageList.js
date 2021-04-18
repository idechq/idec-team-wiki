import React from "react";

import MessageItem from "./messageItem";

const MessageList = ({ messages, onEditMessage, onRemoveMessage }) => (
  <ul>
    {messages.map((message) => (
      <MessageItem
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

export default MessageList;
