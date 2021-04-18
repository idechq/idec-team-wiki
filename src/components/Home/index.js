import React from "react";

import { withAuthorization } from "../Session";
import Messages from "../Messages";

const Home = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>

    <Messages />
  </div>
);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(Home);
