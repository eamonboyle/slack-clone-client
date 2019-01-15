import React from 'react'
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';

const SendMessageWrapper = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px;
`;

const ENTER_KEY = 13;

const SendMessage = ({ placeholder, values, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
    <SendMessageWrapper>
        <Input
            name="message"
            value={values.message}
            fluid
            placeholder={`Message #${placeholder}`}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if (e.keyCode === ENTER_KEY && !isSubmitting) {
                    handleSubmit(e);
                    values.message = ''
                }
            }}
        />
    </SendMessageWrapper>
);

export default withFormik({
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (values, { props: { onSubmit }, setSubmitting, resetForm }) => {

        if (!values.message || !values.message.trim()) {
            setSubmitting(false);
            return;
        }

        await onSubmit(values.message);

        resetForm();
    },
})(SendMessage);