import { useQuery, gql } from '@apollo/client';
import { GET_AUCTIONS } from "../graphql/queries";
import { Divider, Switch, Box, TextField, Button, CircularProgress, Card, Typography, FormControlLabel, FormGroup } from "@material-ui/core";
import AuctionThumbnail from "./AuctionThumbnail";
import { useEffect, useState } from 'react';
import { timeLeftMS } from "../helpers/timeHelpers";

export default function Auctions() {
    const { loading, error, data } = useQuery(GET_AUCTIONS);
    
    const [didMount, setDidMount] = useState(false); 

    useEffect(() => {
        setDidMount(true);
        return () => setDidMount(false);
    });
    
    const [state, setState] = useState({
        checked: false,
        search: ""
    });

    const handleChangeCheck = (e : any) => {
        setState({...state, checked: e.target.checked});
    }

    const handleChangeSearch = (e : any) => {
        setState({...state, search: e.target.value})
    }

    if (loading) return <CircularProgress color="primary"/>
    if (error) return <p>Error</p>;    

    const newData = data.getAuctions.filter((a : any) => {
        const left = timeLeftMS(new Date(), new Date(a.endTime));
        const completed = state.checked ? left < 0 : left > 0;
        return a.card.name.toLowerCase().includes(state.search.toLowerCase()) && completed;
    });

    return (
        <Box m={5}>
            <FormGroup row style={{margin: "15px"}}>
            <FormControlLabel
            control={
                <Switch
                    checked={state.checked}
                    onChange={handleChangeCheck}
                ></Switch>
            } 
            label="Completed"/>
            <TextField onChange={handleChangeSearch} variant="outlined" id="standard-search" label="Search" type="search" />            
            </FormGroup>
            <Divider />
            {newData.map((a : any) => {
                return (<AuctionThumbnail key={a.id} props={a}></AuctionThumbnail>)
            })}
        </Box>
    )
}



