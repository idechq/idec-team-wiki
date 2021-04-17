import React from "react";
import Messages from "../Messages";
import { compose } from "recompose";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const Home = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>

    <Messages />
  </div>
);

const condition = (authUser) => !!authUser;

export default compose(withFirebase, withAuthorization(condition))(Home);
