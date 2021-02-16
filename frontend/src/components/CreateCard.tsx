import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Box, Button, CircularProgress, LinearProgress } from "@material-ui/core";
import { TextField } from 'formik-material-ui';
import { LOGIN } from "../graphql/mutations";
import { useMutation, useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { CREATE_CARD } from "../graphql/mutations";
import { useAuth } from "../helpers/useIsAuth";

interface Values {
    name: string;
    description: string;
}  

export default function CreateCard() {
    useAuth();
    const [createCard, { data, error }] = useMutation(CREATE_CARD);
    const history = useHistory();

    return (
        <Box m={5} display="flex" justifyContent="center">
            <Formik
            initialValues={{
                name: '',
                description: '',
            }}
            validate={values => {
                const errors: Partial<Values> = {};
                if (!values.name) {
                    errors.name = 'Required';
                } 

                if (!values.description) {
                    errors.description = 'Required';
                }

                return errors;
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
                let result;

                try {
                    result = await createCard({ variables: {name: values.name, description: values.description}});
                } catch (e) {
                    const errs: Partial<Values> = {};
                    errs.name = e.message;
                    errs.description = e.message;
                    setErrors(errs);
                    return errs;
                }

                if (result) {
                    await history.push("/me");
                }

                setSubmitting(false);
            }}
            >
            {({ submitForm, isSubmitting }) => (
                <Form style={{padding: '20px'}}>
                <Field
                    component={TextField}
                    name="name"
                    type="name"
                    label="Name"
                />
                <br />
                <Field
                    component={TextField}
                    type="description"
                    label="Description"
                    name="description"
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
                    Submit
                </Button>
                </Form>
            )}
            </Formik>
        </Box>
    )
}
