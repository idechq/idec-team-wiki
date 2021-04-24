import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const UserList = ({ firebase }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = firebase.users().onSnapshot((snapshot) => {
      let users = [];

      snapshot.forEach((doc) => users.push({ ...doc.data(), uid: doc.id }));

      setUsers(users);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading ...</div>}
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
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
              <Link
                to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`,
                  state: { user },
                }}
              >
                Details
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withFirebase(UserList);
