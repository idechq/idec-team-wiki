import React, { useState, useEffect } from "react";

import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import MessageList from "./MessageList";

const Messages = ({ firebase }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = firebase
      .messages()
      .orderBy("createdAt", "desc")
      .limit(limit)
      .onSnapshot((snapshot) => {
        if (snapshot.size) {
          let messages = [];
          snapshot.forEach((doc) =>
            messages.push({ ...doc.data(), uid: doc.id })
          );
          messages.reverse();
          setLoading(false);
        } else {
          setMessages([]);
          setLoading(true);
        }
      });
    return () => {
      unsubscribe();
    };
  }, []);

  const onCreateMessage = (event, authUser) => {
    firebase.messages().add({
      text: text,
      userId: authUser.uid,
      createdAt: firebase.fieldValue.serverTimestamp(),
    });

    setText("");

    event.preventDefault();
  };

  const onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    firebase.message(message.uid).update({
      ...messageSnapshot,
      text,
      editedAt: firebase.fieldValue.serverTimestamp(),
    });
  };

  const onRemoveMessage = (uid) => {
    firebase.message(uid).delete();
  };

  const onNext = () => {
    setLimit(limit + 5);
  };

  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <div>
          {!loading && messages && (
            <button type="button" onClick={onNext}>
              More
            </button>
          )}

          {loading && <div>Loading ...</div>}

          {messages && (
            <MessageList
              authUser={authUser}
              messages={messages}
              onEditMessage={onEditMessage}
              onRemoveMessage={onRemoveMessage}
            />
          )}

          {!messages && <div>There are no messages ...</div>}

          <form onSubmit={(event) => onCreateMessage(event, authUser)}>
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

export default withFirebase(Messages);
