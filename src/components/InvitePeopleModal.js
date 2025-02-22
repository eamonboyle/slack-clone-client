import React from 'react'
import { Form, Modal, Input, Button } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import normalizeErrors from '../normalizeErrors';

const InvitePeopleModal = ({
    open,
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    touched,
    errors,
    resetForm
}) => (
        <Modal open={open} onClose={(e) => {
            resetForm();
            onClose(e);
        }}>
            <Modal.Header>
                Add People to your Team
        </Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <Input
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="email"
                            fluid
                            placeholder="User's email"
                        />
                    </Form.Field>
                    {touched.email && errors.email ? errors.email[0] : null}
                    <Form.Group widths="equal">
                        <Button disabled={isSubmitting} fluid onClick={(e) => {
                            resetForm();
                            onClose(e);
                        }}>Cancel</Button>
                        <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Invite User</Button>
                    </Form.Group>
                </Form>
            </Modal.Content>
        </Modal>
    );


const addTeamMemberMutation = gql`
    mutation($email:String!, $teamId:Int!) {
        addTeamMember(email:$email, teamId:$teamId) {
            ok,
            errors {
                path,
                message
            }
        }
    }
`;

export default compose(
    graphql(addTeamMemberMutation),
    withFormik({
        mapPropsToValues: () => ({ email: '' }),
        handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting, setErrors }) => {
            const response = await mutate({
                variables: { teamId, email: values.email },
            });
            const { ok, errors } = response.data.addTeamMember;
            if (ok) {
                onClose();
                setSubmitting(false);
            } else {
                setSubmitting(false);
                // add new error code here
                const errorsLength = errors.length;
                const filteredErrors = errors.filter(e => e.message !== 'user_id must be unique');
                if (errorsLength !== filteredErrors.length) {
                    filteredErrors.push({
                        path: 'email',
                        message: 'This user is already part of the team'
                    });
                }
                setErrors(normalizeErrors(filteredErrors));
            }
        },
    }),
)(InvitePeopleModal);