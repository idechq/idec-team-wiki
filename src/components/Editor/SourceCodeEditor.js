import React from "react";
import MarkdownEditor from "rich-markdown-editor";
import { ToastContainer, toast } from "react-toastify";
import { withFirebase } from "../Firebase";

import "react-toastify/dist/ReactToastify.min.css";

const SourceCodeEditor = ({
  firebase,
  saveChanges,
  setMarkdown,
  markdown,
  file,
  userId,
}) => {
  const uploadImage = async (file) => {
    console.log(file);
    if (file.size < 1000000) {
      const doc = await firebase.db
        .collection("users")
        .doc(userId)
        .collection("images")
        .add({
          name: file.name,
        });

      const uploadTask = await firebase.store
        .ref()
        .child(`users/${userId}/${doc.id}-${file.name}`)
        .put(file);
      console.log(uploadTask.ref.getDownloadURL());
      return uploadTask.ref.getDownloadURL();
    } else {
      console.log("File size too large!");
    }
  };

  return (
    <>
      <MarkdownEditor
        defaultValue={file.content}
        // readOnly={true}
        onChange={(text) => {
          setMarkdown(text());
        }}
        uploadImage={uploadImage}
        onShowToast={(message) => toast(message)}
      />
      <button onClick={saveChanges} className="save-button">
        Save Changes
      </button>
      <ToastContainer />
    </>
  );
};

export default withFirebase(SourceCodeEditor);
