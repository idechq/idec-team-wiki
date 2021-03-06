import React from "react";
import { Router } from "@reach/router";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
import { UserList, UserItem } from "../Users";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const Admin = () => (
  <div>
    <h1>Admin</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>

    <Router>
      <UserItem exact path={ROUTES.ADMIN_DETAILS} />
      <UserList exact path={ROUTES.ADMIN} />
    </Router>
  </div>
);

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Admin);
