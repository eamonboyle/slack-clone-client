import React, { Component } from 'react'
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export class Register extends Component {

    state = {
        username: '',
        usernameError: '',
        email: '',
        emailError: '',
        password: '',
        passwordError: ''
    }

    onSubmit = async () => {
        this.setState({
            usernameError: '',
            passwordError: '',
            emailError: ''
        });

        const { username, email, password } = this.state;
        const response = await this.props.mutate({
            variables: { username, email, password },
        });

        const { ok, errors } = response.data.register;

        if (ok) {
            this.props.history.push('/login');
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            console.log('err', err);
            this.setState(err)
        }
    }

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        const { username, email, password, usernameError, emailError, passwordError } = this.state;

        const errorList = [];

        if (usernameError)
            errorList.push(usernameError);

        if (emailError)
            errorList.push(emailError);

        if (passwordError)
            errorList.push(passwordError);

        return (
            <Container text>
                <Header as="h2">Register</Header>
                <Form>
                    <Form.Field error={!!usernameError}>
                        <Input name="username" onChange={this.onChange} value={username} fluid placeholder="Username" />
                    </Form.Field>
                    <Form.Field error={!!emailError}>
                        <Input name="email" onChange={this.onChange} value={email} fluid placeholder="Email" />
                    </Form.Field>
                    <Form.Field error={!!passwordError}>
                        <Input name="password" onChange={this.onChange} value={password} type="password" fluid placeholder="Password" />
                    </Form.Field>
                    <Button onClick={this.onSubmit}>
                        Submit
                    </Button>
                </Form>
                {errorList.length ? <Message
                    error
                    header="There was some errors with your submission"
                    list={errorList}
                /> : null}
            </Container>
        )
    }
}

const registerMutation = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        register(username:$username, email:$email, password:$password) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(registerMutation)(Register)
