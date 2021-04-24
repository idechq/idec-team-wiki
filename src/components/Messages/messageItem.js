import React, { useState, useEffect } from "react";

const MessageItem = ({ authUser, message, onEditMessage, onRemoveMessage }) => {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState();

  useEffect(() => {
    setEditText(message.text);
  }, []);

  const onToggleEditMode = () => {
    setEditMode(!editMode);
    setEditText(message.text);
  };

  const onSaveEditText = () => {
    onEditMessage(message, editText);

    setEditMode(false);
  };

  return (
    <li>
      {editMode ? (
        <input type="text" value={editText} onChange={(e) => {}} />
      ) : (
        <span>
          <strong>{message.userId}</strong> {message.text}
          {message.editedAt && <span>(Edited)</span>}
        </span>
      )}

      {authUser.uid === message.userId && (
        <span>
          {editMode ? (
            <span>
              <button onClick={onSaveEditText}>Save</button>
              <button onClick={onToggleEditMode}>Reset</button>
            </span>
          ) : (
            <button onClick={onToggleEditMode}>Edit</button>
          )}

          {!editMode && (
            <button type="button" onClick={() => onRemoveMessage(message.uid)}>
              Delete
            </button>
          )}
        </span>
      )}
    </li>
  );
};

export default MessageItem;
