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
import DirectMessageContainer from '../containers/DirectMessageContainer';

const DirectMessages = ({
    mutate,
    data: { loading, me, getUser },
    match: { params: { teamId, userId } },
}) => {

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

    userId = parseInt(userId, 10);

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
            <Header channelName={getUser.username} />
            <DirectMessageContainer teamId={team.id} userId={userId} />
            <SendMessage
                onSubmit={async (text) => {
                    await mutate({
                        variables: {
                            text,
                            receiverId: userId,
                            teamId: team.id
                        },
                        optimisticResponse: {
                            createDirectMessage: true
                        },
                        update: (store) => {
                            const data = store.readQuery({ query: meQuery });
                            const teamIdx2 = findIndex(data.me.teams, ['id', team.id]);
                            const notAlreadyThere = data.me.teams[teamIdx2].directMessageMembers.every(member => member.id !== parseInt(userId, 10));
                            if (notAlreadyThere) {
                                data.me.teams[teamIdx2].directMessageMembers.push({
                                    __typename: 'User',
                                    id: userId,
                                    username: getUser.username,
                                });
                                store.writeQuery({ query: meQuery, data });
                            }
                        },
                    });
                }}
                placeholder={userId}
            />
        </AppLayout>
    );
};

const createDirectMessageMutation = gql`
    mutation($receiverId:Int!, $text:String!, $teamId: Int!) {
        createDirectMessage(receiverId:$receiverId, text:$text, teamId:$teamId)
    }
`;

const directMessageMeQuery = gql`
    query($userId: Int!) {
        getUser(userId: $userId) {
            username
        }
        me {
            id
            username
            teams {
                id
                name
                admin
                directMessageMembers {
                    id
                    username
                }
                channels {
                    id
                    name
                }
            }
        }
    }
`;

export default compose(
    graphql(directMessageMeQuery, {
        options: props => ({
            variables: { userId: parseInt(props.match.params.userId, 10) },
            fetchPolicy: 'network-only'
        })
    }),
    graphql(createDirectMessageMutation),
)(DirectMessages);