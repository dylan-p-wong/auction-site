import { useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";
import { Box, Card, CircularProgress, Button, CardContent, Typography, CardHeader } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Fragment } from "react";

export default function Me(){
    const { loading, error, data } = useQuery(ME);

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
                <Card>
                    <CardHeader title={`${c.name} (Id: ${c.id})`} subheader={c.description}/>
                    <CardContent>           
                            {c.auctionId ? (
                                <Link to={`/auction/${c.auctionId}`}>
                                    <Button variant="contained" color="primary">
                                        View Auction
                                    </Button>
                                </Link>
                            ): 
                                <Link to={`/create-auction?cardId=${c.id}`}>
                                    <Button variant="contained" color="primary">
                                        Create Auction
                                    </Button>
                                </Link>
                            }
                    </CardContent>
                </Card>
                ))}
                
        </Box>
    );
}