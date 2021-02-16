import { useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";
import { Box, FormControlLabel, Switch, Card, CircularProgress, Button, CardContent, Typography, CardHeader } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import AuctionThumbnail from "./AuctionThumbnail";
import Item from "./Card";

export default function Me(){
    const { loading, error, data } = useQuery(ME);
    const [didMount, setDidMount] = useState(false); 

    const [state, setState] = useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
    });
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        setDidMount(true);
        return () => setDidMount(false);
    });
    
    if (loading) return <CircularProgress color="primary"/>
    if (error) return <p>Error</p>;    

    if (!data.me) return (
        <Box m={5} display="flex" justifyContent="center">
            <Link to="/login">
                <Button style={{margin: "5px"}} variant="contained" color="primary">
                    Login
                </Button>
            </Link>
            <Link to="/register">
                <Button variant="contained"style={{margin: "5px"}} color="primary">
                    Register
                </Button>
            </Link>
        </Box>
    );

    const myBidsAndWatches = data.me.auctions.filter((a : any)=>{
        return a.ownerId !== data.me.id;
    });

    const myAuctions = data.me.auctions.filter((a : any)=>{
        return a.ownerId === data.me.id;
    });

    console.log(myBidsAndWatches);
    console.log(myAuctions);
    
    return (
        <Box m={5}>
            <h1>My Cards</h1>
            <FormControlLabel control={<Switch checked={state.checkedC} onChange={handleChange} name="checkedC"/>}label="Hide"/>
            {!state.checkedC ? (<Box>
                <Box mb={4} mt={4}>
                    <Link to="/create-card" style={{textDecoration: "none"}}>
                        <Button variant="contained" color="primary">
                            Create Card
                        </Button>
                    </Link>
                </Box>
                {data.me.cards.map((c : any) => (
                    <Item key={c.id} props={c}></Item>
                ))}
            </Box>) : null}
            
            <br />
            <Box>
                <h1>My Auctions</h1>
                <FormControlLabel control={<Switch checked={state.checkedA} onChange={handleChange} name="checkedA"/>}label="Hide"/>
                {!state.checkedA ? myAuctions.map((a : any) => (
                    <AuctionThumbnail key={a.id} props={a}></AuctionThumbnail>
                )) : null}
            </Box>
            <Box>
                <h1>My Bids/Watches</h1> 
                <FormControlLabel control={<Switch checked={state.checkedB} onChange={handleChange} name="checkedB"/>}label="Hide"/>
                {!state.checkedB ? myBidsAndWatches.map((a : any) => (
                    <AuctionThumbnail key={a.id} props={a}></AuctionThumbnail>
                )) : null}
            </Box>
        </Box>
    );
}