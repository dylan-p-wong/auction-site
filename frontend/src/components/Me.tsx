import { useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";
import { Box, Card, CircularProgress, Button, CardContent, Typography, CardHeader } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import AuctionThumbnail from "./AuctionThumbnail";
import Item from "./Card";

export default function Me(){
    const { loading, error, data } = useQuery(ME);
    const [didMount, setDidMount] = useState(false); 

    useEffect(() => {
        setDidMount(true);
        return () => setDidMount(false);
    });
    
    if (loading) return <CircularProgress color="primary"/>
    if (error) return <p>Error</p>;    

    if (!data.me) return (
        <Fragment>
            <Link to="/login">
                <Button variant="contained" color="primary">
                    Login
                </Button>
            </Link>
            <Link to="/register">
                <Button variant="contained" color="primary">
                    Register
                </Button>
            </Link>
        </Fragment>
    );
    
    return (
        <Box m={5}>
            <h1>My Cards</h1>
            <Box mb={4} mt={4}>
                <Link to="/create-card">
                    <Button variant="contained" color="primary">
                        Create Card
                    </Button>
                </Link>
            </Box>
            {data.me.cards.map((c : any) => (
                <Item key={c.id} props={c}></Item>
            ))}
            <br />
            <h1>My Auctions</h1>
            {data.me.auctions.map((a : any) => (
                <AuctionThumbnail key={a.id} props={a}></AuctionThumbnail>
            ))}
            <h1>My Bids/Watches</h1> 
        </Box>
    );
}