import { useQuery, gql } from '@apollo/client';
import { GET_AUCTIONS } from "../graphql/queries";
import { Box, Button, CircularProgress, Card, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { timeLeftMS, formatTimeThumbnail } from "../helpers/timeHelpers";

export default function Auctions() {
    const { loading, error, data } = useQuery(GET_AUCTIONS);

    if (loading) return <CircularProgress color="primary"/>
    if (error) return <p>Error</p>;    


    return data.getAuctions.map((a : any) => {
        const left = timeLeftMS(new Date(), new Date(a.endTime));

        return (
        <Box key={a.id} m={6}>
                <Card>
                <Box p={6}>
                    <p>{`Item: ${a.card.name} (Id: ${a.card.id})`}</p>
                    <p>${a.currentBid ? `${a.currentBid}` : `${a.startingBid}`}</p>

                    {left > 0 ? 
                    <Box>
                        <Typography>{formatTimeThumbnail(left)} left</Typography>
                        <Link to={`/auction/${a.id}`}>
                            <Button variant="contained" color="primary">
                                Join Auction Room
                            </Button>
                        </Link>
                    </ Box>
                    : 
                        <Box>
                            <Button disabled>Auction Ended</Button>
                        </Box>
                    }
                </Box>
                </Card>
        </Box>
    )});
}



