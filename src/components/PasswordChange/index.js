import React, { useState } from "react";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
};

const PasswordChangeForm = ({ firebase }) => {
  const [{ passwordOne, passwordTwo }, setState] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);
  const onSubmit = (event) => {
    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        setError(error);
      });

    event.preventDefault();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="New Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm New Password"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default withFirebase(PasswordChangeForm);
