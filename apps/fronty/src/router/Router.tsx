import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CreateRoom from '../pages/CreateRoom/CreateRoom';

import Home from '../pages/Home';
import Room from '../pages/Room';

const AppRouter = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/create" component={CreateRoom} />
      <Route exact path="/:roomId" component={Room} />
    </Switch>
  </Router>
);

export default AppRouter;
