import React from "react";

import "react-toastify/dist/ReactToastify.min.css";

const SourceCode = ({ saveChanges, setMarkdown, markdown }) => {
  return (
    <>
      <textarea
        value={markdown}
        onChange={(e) => {
          setMarkdown(e.target.value);
        }}
      />
      <button onClick={saveChanges} className="save-button">
        Save Changes
      </button>
    </>
  );
};

export default SourceCode;
