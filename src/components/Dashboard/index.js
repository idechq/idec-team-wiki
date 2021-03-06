import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { Link } from "@reach/router";
import { withFirebase } from "../Firebase";

const Dashboard = ({ firebase, userId }) => {
  // const getFiles = props.firebase.getUserFiles();
  const [nameValue, setNameValue] = useState("");
  const { data, error } = useSWR(userId, firebase.getUserFiles);

  if (error) return <p>Error loading data!</p>;
  else if (!data) return <p>Loading...</p>;
  else {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (nameValue) {
              setNameValue("");
              firebase.createFile(userId, nameValue);
              mutate(userId);
            }
          }}
          className="new-file-form"
        >
          <input
            type="text"
            placeholder="Your new files name..."
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
          <button type="submit" className="add-button">
            Create
          </button>
        </form>
        <ul className="files-list">
          {data.map((file) => {
            return (
              <li key={file.id} className="file">
                <Link to={`/user/${userId}/editor/${file.id}`} className="link">
                  {file.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};

export default withFirebase(Dashboard);
