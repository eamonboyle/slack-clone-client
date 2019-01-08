import React from 'react'
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';

export default class Sidebar extends React.Component {

    state = {
        openAddChannelModal: false,
        openInvitePeopleModal: false,
    }

    handleCloseAddChannelModal = () => {
        this.setState({
            openAddChannelModal: false
        });
    }

    handleAddChannelClick = () => {
        this.setState({
            openAddChannelModal: true
        });
    }

    handleCloseInvitePeopleModal = () => {
        this.setState({
            openInvitePeopleModal: false
        });
    }

    handleInvitePeopleClick = () => {
        console.log('Open invite poeple modal');
        this.setState({
            openInvitePeopleModal: true
        });
    }

    render() {
        const { teams, team } = this.props;
        const { openAddChannelModal, openInvitePeopleModal } = this.state;

        let username = '';
        try {
        const token = localStorage.getItem('token');
        const { user } = decode(token);
        // eslint-disable-next-line prefer-destructuring
        username = user.username;
        } catch (err) {}

        return [
            <Teams key="team-sidebar" teams={teams} />,
            <Channels
                key="channels-sidebar"
                teamId={team.id}
                teamName={team.name}
                username={username}
                channels={team.channels}
                users={[{ id: 1, name: "slackbot" }, { id: 2, name: "user2" }]}
                onAddChannelClick={this.handleAddChannelClick}
                onInvitePeopleClick={this.handleInvitePeopleClick}
            />,
            <AddChannelModal 
                teamId={team.id}
                onClose={this.handleCloseAddChannelModal}
                open={openAddChannelModal} 
                key="sidebar-add-channel-modal" 
            />,
            <InvitePeopleModal
                teamId={team.id}
                onClose={this.handleCloseInvitePeopleModal}
                open={openInvitePeopleModal}
                key="sidebar-invite-people-modal"
            />
        ]
    }
}