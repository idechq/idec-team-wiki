import React, { useState } from "react";

import { navigate } from "@reach/router";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";

const SignIn = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
};

const SignInFormBase = ({ firebase }) => {
  const [{ email, password }, setState] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);

  const onSubmit = (e) => {
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setState({ ...INITIAL_STATE });
        navigate(`/user/${userCredential.user.uid}`);
      })
      .catch((error) => {
        setError(error);
      });

    e.preventDefault();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const isInvalid = password === "" || email === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInForm = withFirebase(SignInFormBase);

export default SignIn;

export { SignInForm };
