import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";

const withAuthorization = (condition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        (authUser) => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.SIGN_IN);
          }
        },
        () => this.props.history.push(ROUTES.SIGN_IN)
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return condition(this.props.authUser) ? (
        <Component {...this.props} />
      ) : null;
    }
  }

  return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
