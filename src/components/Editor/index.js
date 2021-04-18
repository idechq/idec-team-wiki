import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Link } from "react-router-dom";
import MarkdownEditor from "rich-markdown-editor";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";

const Editor = ({ user, userId, fileId }) => {
  const { data: file, error } = useSWR(
    [userId, fileId],
    this.props.firebase.getFile
  );
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (file !== undefined && value === null) {
      console.log("Set initial content");
      setValue(file.content);
    }
  }, [file, value]);

  const onUnload = (event) => {
    event.preventDefault();
    event.returnValue = "You have unsaved changes!";
    return "You have unsaved changes!";
  };

  useEffect(() => {
    if (file && !(file.content === value)) {
      window.addEventListener("beforeunload", onUnload);
    } else {
      window.removeEventListener("beforeunload", onUnload);
    }

    return () => window.removeEventListener("beforeunload", onUnload);
  });

  const saveChanges = () => {
    this.props.firebase.db
      .collection("users")
      .doc(userId)
      .collection("files")
      .doc(fileId)
      .update({
        content: value,
      });
    mutate([userId, fileId]);
    toast.success("🎉 Your changes have been saved!");
  };

  const uploadImage = async (file) => {
    if (!file.size >= 1000000) {
      const doc = await this.props.firebase.db
        .collection("users")
        .doc(userId)
        .collection("images")
        .add({
          name: file.name,
        });

      const uploadTask = await this.props.firebase.store
        .ref()
        .child(`users/${userId}/${doc.id}-${file.name}`)
        .put(file);

      return uploadTask.ref.getDownloadURL();
    }
  };

  if (error) return <p>We had an issue while getting the data</p>;
  else if (!file) return <p>Loading...</p>;
  else {
    return (
      <div>
        <header className="editor-header">
          <Link className="back-button" to={`/user/${userId}`}>
            &lt;
          </Link>
          <h3>{file.name}</h3>
          <button
            disabled={file.content === value}
            onClick={saveChanges}
            className="save-button"
          >
            Save Changes
          </button>
        </header>
        <div className="editor">
          <MarkdownEditor
            defaultValue={file.content}
            onChange={(getValue) => {
              setValue(getValue());
            }}
            uploadImage={uploadImage}
            onShowToast={(message) => toast(message)}
          />
        </div>
        <ToastContainer />
      </div>
    );
  }
};

export default Editor;
