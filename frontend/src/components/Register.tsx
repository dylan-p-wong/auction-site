import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Box, Button, CircularProgress, LinearProgress } from "@material-ui/core";
import { TextField } from 'formik-material-ui';
import { REGISTER } from "../graphql/mutations";
import { useMutation, useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';

interface Values {
    email: string;
    password: string;
    username: string;
}  

export default function Login() {
    const [register, { data }] = useMutation(REGISTER);
    const history = useHistory();
    const client = useApolloClient();

    return (
        <Box m={5} display="flex" justifyContent="center">
            <Formik
            initialValues={{
                email: '',
                username: '',
                password: '',
            }}
            validate={values => {
                const errors: Partial<Values> = {};
                if (!values.email) {
                errors.email = 'Required';
                } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
                ) {
                errors.email = 'Invalid email address';
                }
                return errors;
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
                const result = await register({ variables: {email: values.email, password: values.password, username: values.username}});
                const info = result.data.register;

                if (info.errors){
                    const e: Partial<Values> = {};

                    if (info.errors[0].field === "email"){
                        e.email = info.errors[0].message;
                    }

                    if (info.errors[0].field === "username"){
                        e.username = info.errors[0].message;
                    }

                    if (info.errors[0].field === "password"){
                        e.password = info.errors[0].message;
                    }

                    setErrors(e);
                } else {
                    client.resetStore().then(() => {
                        history.push("/me");
                    });
                }

                setSubmitting(false);
            }}
            >
            {({ submitForm, isSubmitting }) => (
                <Form style={{padding: '20px'}}>
                <Field
                    component={TextField}
                    name="username"
                    type="username"
                    label="Username"
                />
                <br />
                <Field
                    component={TextField}
                    name="email"
                    type="email"
                    label="Email"
                />
                <br />
                <Field
                    component={TextField}
                    type="password"
                    label="Password"
                    name="password"
                />
                {isSubmitting && <LinearProgress />}
                <br />
                <Button
                    style={{width: '100%', marginTop: '19px'}}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                >
                    Register
                </Button>
                </Form>
            )}
            </Formik>
        </Box>
    )
}
