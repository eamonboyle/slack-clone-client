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

    toggleAddChannelModal = (e) => {
        if (e)
            e.preventDefault();

        this.setState({
            openAddChannelModal: !this.state.openAddChannelModal
        });
    }

    toggleInvitePeopleModal = (e) => {
        if(e)
            e.preventDefault();
            
        this.setState({
            openInvitePeopleModal: !this.state.openInvitePeopleModal
        });
    }

    render() {
        const { teams, team } = this.props;
        const { openAddChannelModal, openInvitePeopleModal } = this.state;

        let username = '';
        let isOwner = false;
        try {
            const token = localStorage.getItem('token');
            const { user } = decode(token);
            // eslint-disable-next-line prefer-destructuring
            username = user.username;
            isOwner = user.id === team.owner;
        } catch (err) {}

        return [
            <Teams key="team-sidebar" teams={teams} />,
            <Channels
                key="channels-sidebar"
                teamId={team.id}
                teamName={team.name}
                username={username}
                channels={team.channels}
                isOwner={isOwner}
                users={[{ id: 1, name: "slackbot" }, { id: 2, name: "user2" }]}
                onAddChannelClick={this.toggleAddChannelModal}
                onInvitePeopleClick={this.toggleInvitePeopleModal}
            />,
            <AddChannelModal 
                teamId={team.id}
                onClose={this.toggleAddChannelModal}
                open={openAddChannelModal} 
                key="sidebar-add-channel-modal" 
            />,
            <InvitePeopleModal
                teamId={team.id}
                onClose={this.toggleInvitePeopleModal}
                open={openInvitePeopleModal}
                key="sidebar-invite-people-modal"
            />
        ]
    }
}