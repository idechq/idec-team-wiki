import React from "react";

import { PasswordForgetForm } from "../PasswordForget";
import { withAuthorization } from "../Session";
import PasswordChangeForm from "../PasswordChange";

const Account = ({ authUser }) => (
  <div>
    <h1>Account: {authUser.email}</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>
);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(Account);
