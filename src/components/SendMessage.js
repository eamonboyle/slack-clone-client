import React from 'react'
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const SendMessageWrapper = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px;
`;

const ENTER_KEY = 13;

const SendMessage = ({ channelName, values, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
    <SendMessageWrapper>
        <Input
            name="message"
            value={values.message}
            fluid
            placeholder={`Message #${channelName}`}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if (e.keyCode === ENTER_KEY && !isSubmitting) {
                    handleSubmit(e);
                }
            }}
        />
    </SendMessageWrapper>
);

const createMessageMutation = gql`
    mutation($channelId:Int!, $text:String!) {
        createMessage(channelId:$channelId, text:$text)
    }
`;

export default compose(
    graphql(createMessageMutation),
    withFormik({
        mapPropsToValues: () => ({ message: '' }),
        handleSubmit: async (values, { props: { channelId, mutate }, setSubmitting }) => {

            if (!values.message || !values.message.trim()) {
                setSubmitting(false);
                return;
            }

            await mutate({
                variables: { channelId, text: values.message },
            });

            setSubmitting(false);
        },
    })
)(SendMessage);