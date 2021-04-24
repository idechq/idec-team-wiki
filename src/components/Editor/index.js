import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
// import MarkdownEditor from "rich-markdown-editor";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { ToastContainer, toast } from "react-toastify";
import { withFirebase } from "../Firebase";

import "react-toastify/dist/ReactToastify.min.css";
import SourceCode from "./SourceCode";

const Editor = ({ firebase, userId, fileId }) => {
  const { data: file, error } = useSWR([userId, fileId], firebase.getFile);
  const [markdown, setMarkdown] = useState(null);

  useEffect(() => {
    if (file !== undefined && markdown === null) {
      setMarkdown(file.content);
    }
  }, [file, markdown]);

  const onUnload = (event) => {
    event.preventDefault();
    event.returnValue = "You have unsaved changes!";
    return "You have unsaved changes!";
  };

  useEffect(() => {
    if (file && !(file.content === markdown)) {
      window.addEventListener("beforeunload", onUnload);
    } else {
      window.removeEventListener("beforeunload", onUnload);
    }

    return () => window.removeEventListener("beforeunload", onUnload);
  });

  const saveChanges = () => {
    firebase.updateFileMarkdownContent(userId, fileId, markdown);
    mutate([userId, fileId]);
    toast.success("🎉 Your changes have been saved!");
  };

  if (error) return <p>We had an issue while getting the data</p>;
  else if (!file) return <p>Loading...</p>;
  else {
    return (
      <div>
        <header className="editor-header">
          <h3>{file.name}</h3>
        </header>
        <SourceCode
          markdown={markdown}
          saveChanges={saveChanges}
          setMarkdown={setMarkdown}
        />
        <ReactMarkdown remarkPlugins={[gfm]} children={markdown} />
        <ToastContainer />
      </div>
    );
  }
};

export default withFirebase(Editor);
