import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './Home';
import Register from './Register';
import Login from './Login';
import ViewTeam from './ViewTeam';
import CreateTeam from './CreateTeam';
import DirectMessages from './DirectMessages';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        decode(token);
        decode(refreshToken);
    } catch(err) {
        return false;
    }

    return true;
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (isAuthenticated() ? (
                <Component {...props} />
            ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                        }}
                    />
                ))}
    />
);

export default () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            <PrivateRoute path="/view-team/user/:teamId?/:userId?" exact component={DirectMessages} />
            <PrivateRoute path="/view-team/:teamId?/:channelId?" exact component={ViewTeam} />
            <PrivateRoute path="/create-team" exact component={CreateTeam} />
        </Switch>
    </BrowserRouter>
);