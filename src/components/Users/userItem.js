import React, { useState, useEffect } from "react";

import { withFirebase } from "../Firebase";

const UserItem = ({ firebase, match }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      return;
    }

    setLoading(true);

    const unsubscribe = firebase
      .user(match.params.id)
      .onSnapshot((snapshot) => {
        setUser(snapshot.data());
        setLoading(false);
      });
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const onSendPasswordResetEmail = () => {
    firebase.doPasswordReset(user.email);
  };

  return (
    <div>
      <h2>User ({match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
          <span>
            <button type="button" onClick={onSendPasswordResetEmail}>
              Send Password Reset
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

export default withFirebase(UserItem);
