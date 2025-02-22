import React from 'react'
import { Form, Modal, Input, Button } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import { meQuery } from '../graphql/team';

const AddChannelModal = ({
    open,
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm
}) => (
<Modal open={open} onClose={(e) => { 
    resetForm(); 
    onClose(e); 
    }}>
        <Modal.Header>
            Add Channel
        </Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <Input
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="name"
                            fluid
                            placeholder="Channel Name"
                        />
                    </Form.Field>
                    <Form.Group widths="equal">
                        <Button disabled={isSubmitting} fluid onClick={(e) => {
                            resetForm();
                            onClose(e);
                        }}>Cancel</Button>
                        <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Create Channel</Button>
                    </Form.Group>
                </Form>
            </Modal.Content>
        </Modal>
    );


const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
        ok,
        channel {
            id
            name
        }
    }
  }
`;

export default compose(
    graphql(createChannelMutation),
    withFormik({
        mapPropsToValues: () => ({ name: '' }),
        handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting }) => {
            await mutate({
                variables: { teamId, name: values.name },
                optimisticResponse: {
                    createChannel: {
                        __typename: 'Mutation',
                        ok: true,
                        channel: {
                            __typename: 'Channel',
                            id: -1,
                            name: values.name,
                        },
                    },
                },
                update: (store, { data: { createChannel } }) => {
                    const { ok, channel } = createChannel;
                    
                    if (!ok) {
                        return;
                    }

                    const data = store.readQuery({ query: meQuery });
                    const teamIdx = findIndex(data.me.teams, ['id', teamId]);
                    data.me.teams[teamIdx].channels.push(channel);
                    store.writeQuery({ query: meQuery, data });
                }
            });
            onClose();
            setSubmitting(false);
        },
    }),
)(AddChannelModal);