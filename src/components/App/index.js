import React from "react";
import { Router } from "@reach/router";

import Navigation from "../Navigation";
import Landing from "../Landing";
import SignUp from "../SignUp";
import SignIn from "../SignIn";
import PasswordForget from "../PasswordForget";
import Home from "../Home";
import Dashboard from "../Dashboard";
import Editor from "../Editor";
import Account from "../Account";
import Admin from "../Admin";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";

const App = ({ user }) => (
  <>
    <Navigation />

    <Router>
      <Landing exact path={ROUTES.LANDING} />
      <SignUp path={ROUTES.SIGN_UP} />
      <SignIn path={ROUTES.SIGN_IN} />
      <PasswordForget path={ROUTES.PASSWORD_FORGET} />
      <Home path={ROUTES.HOME} />
      <Dashboard path="/user/:userId" />
      <Editor path="user/:userId/editor/:fileId" />
      <Account path={ROUTES.ACCOUNT} />
      <Admin path={ROUTES.ADMIN} />
    </Router>
  </>
);

export default withAuthentication(App);
