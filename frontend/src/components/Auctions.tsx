import { useQuery, gql } from '@apollo/client';
import { GET_AUCTIONS } from "../graphql/queries";
import { Box, Button, CircularProgress, Card, Typography } from "@material-ui/core";
import AuctionThumbnail from "./AuctionThumbnail";

export default function Auctions() {
    const { loading, error, data } = useQuery(GET_AUCTIONS);
    
    if (loading) return <CircularProgress color="primary"/>
    if (error) return <p>Error</p>;    
    return (
        <Box m={5}>
            {data.getAuctions.map((a : any) => {
                return (<AuctionThumbnail key={a.id} props={a}></AuctionThumbnail>)
            })}
        </Box>
    )
}



