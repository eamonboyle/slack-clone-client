import React from 'react'

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
        const { teams, team, username } = this.props;
        const { openAddChannelModal, openInvitePeopleModal } = this.state;

        return [
            <Teams key="team-sidebar" teams={teams} />,
            <Channels
                key="channels-sidebar"
                teamId={team.id}
                teamName={team.name}
                username={username}
                channels={team.channels}
                users={[{ id: 1, name: "slackbot" }, { id: 2, name: "user2" }]}
                onAddChannelClick={this.toggleAddChannelModal}
                onInvitePeopleClick={this.toggleInvitePeopleModal}
                isOwner={team.admin}
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