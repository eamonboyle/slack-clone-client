import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ChannelWrapper = styled.div`
    grid-column: 2;
    grid-row: 1 / 4;
    background-color: #4e3a4c;
    color: #958993;
`;

const TeamNameHeader = styled.h1`
    color: #FFF;
    font-size: 20px;
`;

const SideBarList = styled.ul`
    width: 100%;
    list-style: none;
    padding-left: 0;
`;

const paddingLeft = 'padding-left: 10px';

const SideBarListItem = styled.li`
    padding: 2px;
    ${paddingLeft}
    &:hover {
        background: #3e313c;
    }
`;

const SideBarListHeader = styled.li`${paddingLeft}`;

const PushLeft = styled.div`${paddingLeft};`;

const Green = styled.span`color: #38978d;`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const channel = ({ id, name }, teamId) => (
    <Link key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
        <SideBarListItem>
            # {name}
        </SideBarListItem>
    </Link>
);

const user = ({ id, username }, teamId) => (
    <Link key={`user-${id}`} to={`/view-team/user/${teamId}/${id}`}>
        <SideBarListItem>
            <Bubble /> {username}
        </SideBarListItem>
    </Link>
);

export default ({
    teamId,
    teamName,
    username,
    channels,
    users,
    onAddChannelClick,
    onDirectMessageClick,
    onInvitePeopleClick,
    isOwner
}) => (
        <ChannelWrapper>
            <PushLeft>
                <TeamNameHeader>{teamName}</TeamNameHeader>
                {username}
            </PushLeft>
            <div>
                <SideBarList>
                    <SideBarListHeader>
                        Channels {isOwner ? <Icon onClick={onAddChannelClick} name="add circle" /> : null}
                    </SideBarListHeader>
                    {channels.map(c => channel(c, teamId))}
                </SideBarList>
            </div>
            <div>
                <SideBarList>
                    <SideBarListHeader>
                        Direct Messages <Icon onClick={onDirectMessageClick} name="add circle" />
                    </SideBarListHeader>
                    {users.map(u => user(u, teamId))}
                </SideBarList>
            </div>
            {isOwner &&
                <div>
                    <a href="#invite-people" onClick={onInvitePeopleClick}>
                        + invite people
                </a>
                </div>
            }
        </ChannelWrapper>
    );