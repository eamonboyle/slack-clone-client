import React from 'react'

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import DirectMessageModal from '../components/DirectMessageModal';
import InvitePeopleModal from '../components/InvitePeopleModal';

export default class Sidebar extends React.Component {

    state = {
        openAddChannelModal: false,
        openDirectMessageModal: false,
        openInvitePeopleModal: false,
    }

    toggleAddChannelModal = (e) => {
        if (e) e.preventDefault();

        this.setState({
            openAddChannelModal: !this.state.openAddChannelModal
        });
    }

    toggleDirectMessageModal = (e) => {
        if (e) e.preventDefault();
        this.setState({
            openDirectMessageModal: !this.state.openDirectMessageModal
        });
    }

    toggleInvitePeopleModal = (e) => {
        if (e) e.preventDefault();

        this.setState({
            openInvitePeopleModal: !this.state.openInvitePeopleModal
        });
    }

    render() {
        const { teams, team, username } = this.props;
        const { openAddChannelModal, openDirectMessageModal, openInvitePeopleModal } = this.state;

        return [
            <Teams key="team-sidebar" teams={teams} />,
            <Channels
                key="channels-sidebar"
                teamId={team.id}
                teamName={team.name}
                username={username}
                channels={team.channels}
                users={team.directMessageMembers}
                onAddChannelClick={this.toggleAddChannelModal}
                onDirectMessageClick={this.toggleDirectMessageModal}
                onInvitePeopleClick={this.toggleInvitePeopleModal}
                isOwner={team.admin}
            />,
            <AddChannelModal
                teamId={team.id}
                onClose={this.toggleAddChannelModal}
                open={openAddChannelModal}
                key="sidebar-add-channel-modal"
            />,
            <DirectMessageModal
                teamId={team.id}
                onClose={this.toggleDirectMessageModal}
                open={openDirectMessageModal}
                key="sidebar-direct-message-modal"
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