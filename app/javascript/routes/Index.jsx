import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import News from "../components/News";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={News} />
    </Switch>
  </Router>
);