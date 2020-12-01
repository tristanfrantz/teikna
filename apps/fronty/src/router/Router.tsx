import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Lobby from '../pages/Lobby/Lobby';

import Home from '../pages/Home';
import Room from '../pages/Room';

const AppRouter = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/room/:roomId?" component={Lobby} />
    </Switch>
  </Router>
);

export default AppRouter;
