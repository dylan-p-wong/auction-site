import { Box, Button, Typography, Card, CardHeader, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import { timeLeftMS, formatTimeThumbnail } from "../helpers/timeHelpers";
import ClaimButtons from "./ClaimButtons";
import { ME } from "../graphql/queries";
import { Fragment, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

export default function AuctionThumbnail(props: any){
    const { id, leaderId, currentBid, startingBid, auctionStart, endTime, card } = props.props;
    const left = timeLeftMS(new Date(), new Date(endTime));

    return (
        <Box key={id} m={6}>
            <Card>
                <Box p={6} >
                <h2>Auction {id}</h2>
                <CardHeader title={`${card.name} (Id: ${card.id})`} subheader={card.description}/>
                    <CardContent>
                        { left > 0 ? 
                            <Box>
                            <p>${currentBid ? `${currentBid} (Current Bid)` : `${startingBid} (Starting Bid)`}</p>
                            <Typography>{formatTimeThumbnail(left)} left</Typography>
                            <Link to={`/auction/${id}`} style={{textDecoration: "none"}}>
                                <Button variant="contained" color="primary">
                                    Join Auction Room
                                </Button>
                            </Link>
                            </ Box>
                            : 
                            <Box>
                                {currentBid ? (<p style={{color: "green"}}> ${currentBid} (SOLD)</p>) : (<p style={{color: "red"}}>DID NOT SELL</p>)}
                                <ClaimButtons props={props.props}/>
                            </Box>
                        }
                        <br/>
                    </CardContent>
                </Box>
            </Card>
        </Box>
    )
}