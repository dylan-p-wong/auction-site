import { useHistory, useLocation } from "react-router-dom";
import { CREATE_AUCTION } from "../graphql/mutations";
import { useAuth } from "../helpers/useIsAuth";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Box, Button, CircularProgress, LinearProgress} from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { TextField } from 'formik-material-ui';

interface Values {
    length: string;
    startingBid: string;
}  

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Login() {
    useAuth();
    const history = useHistory();
    const query = useQuery();
    const cardId = query.get("cardId");
    const [createAuction, { data }] = useMutation(CREATE_AUCTION);

    if (!cardId){
        history.push("/me");
    }

    return (
        <Box m={5} display="flex" justifyContent="center">
            <Formik
            initialValues={{
                length: '',
                startingBid: '',
            }}
            validate={values => {
                const errors: Partial<Values> = {};
                if (!values.length) {
                    errors.length = 'Required';
                } else if (!/^[0-9]{1,45}$/i.test(values.length)){
                    errors.length = 'Must be a number'
                }

                if (!values.startingBid) {
                    errors.startingBid = 'Required';
                } else if (!/^[0-9]{1,45}$/i.test(values.length)){
                    errors.startingBid = 'Must be a number'
                }

                return errors;
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
                let result;

                try {
                    result = await createAuction({ variables: {length: parseInt(values.length), cardId: parseInt(cardId!), startingBid: parseInt(values.startingBid)}});
                } catch (e) {
                    const errs: Partial<Values> = {};
                    errs.startingBid = e.message;
                    errs.length = e.message;
                    setErrors(errs);
                    return errs;
                }

                if (result.data.createAuction.errors){
                    const errs: Partial<Values> = {};
                    errs.startingBid = result.data.createAuction.errors[0].message;
                    errs.length = result.data.createAuction.errors[0].message;
                    setErrors(errs);
                    return errs;
                }

                if (result.data.createAuction) {
                    history.push(`/auction/${result.data.createAuction.auction.id}`);
                }

                setSubmitting(false);
            }}
            >
            {({ submitForm, isSubmitting }) => (
                <Form style={{padding: '20px'}}>
                <Field
                    component={TextField}
                    name="length"
                    type="length"
                    label="Length (Minutes)"
                />
                <br />
                <Field
                    component={TextField}
                    type="startingBid"
                    label="Starting Bid"
                    name="startingBid"
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
