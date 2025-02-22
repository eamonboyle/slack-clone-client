import React from 'react'
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import { meQuery } from '../graphql/team';

import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';

const ViewTeam = ({ mutate, data: { loading, me }, match: { params: { teamId, channelId } } }) => {

    if (loading) {
        return null;
    }

    const { username, teams } = me;

    if (!teams.length) {
        return (<Redirect to="/create-team" />);
    }

    const teamIdInteger = parseInt(teamId, 10);
    const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
    const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

    const channelIdInteger = parseInt(channelId, 10);
    const channelIdx = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
    const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

    return (
        <AppLayout>
            <Sidebar
                teams={teams.map(t => ({
                    id: t.id,
                    letter: t.name.charAt(0).toUpperCase(),
                }))}
                team={team}
                username={username}
            />
            {channel ? <Header channelName={channel.name} /> : null}
            {channel && <MessageContainer channelId={channel.id} />}
            {channel && (
                <SendMessage
                    placeholder={channel.name}
                    onSubmit={async (text) => {
                        await mutate({ variables: { text, channelId: channel.id } });
                    }}
                />
            )}
        </AppLayout>
    );
};

const createMessageMutation = gql`
    mutation($channelId:Int!, $text:String!) {
        createMessage(channelId:$channelId, text:$text)
    }
`;

export default compose(
    graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
    graphql(createMessageMutation)
)(ViewTeam);