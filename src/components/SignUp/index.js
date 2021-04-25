import React, { useState } from "react";
import { Link, navigate } from "@reach/router";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const SignUp = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  firstname: "",
  lastname: "",
  email: "",
  team: "",
  passwordOne: "",
  passwordTwo: "",
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const SignUpFormBase = ({ firebase }) => {
  const [
    { firstname, lastname, team, email, passwordOne, passwordTwo },
    setState,
  ] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    const roles = {};

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create a user in your Firebase realtime database
        const userId = authUser.user.uid;
        return firebase
          .user(userId)
          .set(
            {
              firstname,
              lastname,
              team,
              email,
              roles,
            },
            { merge: true }
          )
          .then(() => {
            setState({ ...INITIAL_STATE });
            navigate(`/user/${userId}`);
          });
      })
      // .then(() => {
      //   return this.props.firebase.doSendEmailVerification();
      // })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        console.log(error);

        setError(error);
      });

    event.preventDefault();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    firstname === "" ||
    lastname === "" ||
    team === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="firstname"
        value={firstname}
        onChange={onChange}
        type="text"
        placeholder="First Name"
      />
      <input
        name="lastname"
        value={lastname}
        onChange={onChange}
        type="text"
        placeholder="Last Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="team"
        value={team}
        onChange={onChange}
        type="text"
        placeholder="Team Name"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />

      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = withFirebase(SignUpFormBase);

export default SignUp;

export { SignUpForm, SignUpLink };
