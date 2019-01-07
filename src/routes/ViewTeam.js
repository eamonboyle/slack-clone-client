import React, { Component } from 'react'

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';

import Sidebar from '../containers/Sidebar';

export default class ViewTeam extends Component {
    render() {
        return (
            <AppLayout>
                <Sidebar currentTeamId={4} />
                <Header channelName="announcements"/>
                <Messages>
                    <ul className="messages-list">
                        <li></li>
                        <li></li>
                    </ul>
                </Messages>
                <SendMessage channelName="announcements" />
            </AppLayout>
        )
    }
}
