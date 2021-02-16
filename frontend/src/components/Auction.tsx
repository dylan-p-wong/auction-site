import classes from "*.module.css";
import { useMutation } from "@apollo/client";
import { Typography, CardHeader, Box, Card, CardContent, makeStyles, CardActions, Button, LinearProgress } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { BID } from "../graphql/mutations";
import { TextField } from 'formik-material-ui';
import { useEffect, useState } from "react";
import { timeLeftMS, formatTimeLeft } from "../helpers/timeHelpers";
import { Fragment } from "react";
import ClaimButtons from "./ClaimButtons";
import WatchLaterIcon from '@material-ui/icons/WatchLater';

interface Values {
    bid: string;
}  

export default function Auction(props : any){
    const { id, leaderId, currentBid, startingBid, auctionStart, endTime, card } = props.props;
    const [bid, { data }] = useMutation(BID);
    const [timeLeft, setTimeLeft] = useState(timeLeftMS(new Date(), new Date(endTime)));
    useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeftMS(new Date(), new Date(endTime)));
        }, 1000);

        return () => clearTimeout(timer);
    });
    
    return (
        <Box m={5}>
            <Card>
                <CardHeader title={`Auction ${id}`} subheader={`Item: ${card.name} (Id: ${card.id}) - ${card.description}`}/>
                <CardContent>
                    <Typography variant="body2">
                        Starting Bid: {startingBid}
                    </Typography>
                    <Typography variant="body2">
                        Current Bid: {currentBid} (User: {leaderId})
                    </Typography>
                    <Typography variant="body2">
                        Time Left: {timeLeft > 0 ? formatTimeLeft(timeLeft) : "00:00:00"}
                    </Typography>
                    {timeLeft > 0 ? null : (<ClaimButtons props={props.props}/>)}
                </CardContent>
                <CardActions>
                    <Formik
                    initialValues={{bid: ""}}
                    validate={values => {
                        const errors: Partial<Values> = {};
                        if (!values.bid){
                            errors.bid = "Required"
                        }
                        return errors;
                    }}
                    onSubmit={async (values, { setErrors, setSubmitting }) => {
                        let result;
                        try {
                            result = await bid({ variables: {bid: parseInt(values.bid), auctionId: id}});
                        } catch (e) {
                            const errs: Partial<Values> = {};
                            errs.bid = e.message;
                            setErrors(errs);
                            return errs;
                        }
                        
                        const info = result.data.bid;
        
                        if (info.errors){
                            const e: Partial<Values> = {};
                            
                            if (info.errors[0]){
                                e.bid = info.errors[0].message;
                            }
        
                            setErrors(e);
                        } 
        
                        setSubmitting(false);
                    }}
                    >
                    {({ submitForm, isSubmitting }) => (
                    <Form>
                    
                    {isSubmitting && <LinearProgress />}

                    {timeLeft > 0 ? 
                        <Box display="flex" p={1}>
                            <Field component={TextField} name="bid" type="bid" label="Enter Bid"/>
                            <Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>
                                Submit
                            </Button>
                        </Box>
                    : null}
                    </Form>
                    )}
                    </Formik>
                </CardActions>
            </Card>
        </Box>
    )
}