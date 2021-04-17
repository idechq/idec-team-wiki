import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

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

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

const condition = (authUser) => !!authUser;

export default compose(
  connect(mapStateToProps),
  withAuthorization(condition)
)(Account);
