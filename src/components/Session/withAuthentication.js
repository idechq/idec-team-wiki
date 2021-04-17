import React from "react";
import { withFirebase } from "../Firebase";

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.props.onSetAuthUser(JSON.parse(localStorage.getItem("authUser")));
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        (authUser) => {
          localStorage.setItem("authUser", JSON.stringify(authUser));
          this.props.onSetAuthUser(authUser);
        },
        () => {
          localStorage.removeItem("authUser");
          this.props.onSetAuthUser(null);
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  return withFirebase(WithAuthentication);
};

export default withAuthentication;
