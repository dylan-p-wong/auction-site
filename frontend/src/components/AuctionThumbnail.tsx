import { Box, Button, Typography, Card, CardHeader, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import { timeLeftMS, formatTimeThumbnail } from "../helpers/timeHelpers";
import ClaimButtons from "./ClaimButtons";

export default function AuctionThumbnail(props: any){
    const { id, leaderId, currentBid, startingBid, auctionStart, endTime, card } = props.props;
    const left = timeLeftMS(new Date(), new Date(endTime));

    return (
        <Box key={id} m={6}>
            <Card>
                <Box p={6} >
                <h2>{id}</h2>
                <CardHeader title={`${card.name} (Id: ${card.id})`} subheader={card.description}/>
                    <CardContent>
                    <p>${currentBid ? `${currentBid}` : `${startingBid} (Starting Bid)`}</p>
                        { left > 0 ? 
                            <Box>
                            <Typography>{formatTimeThumbnail(left)} left</Typography>
                            <Link to={`/auction/${id}`}>
                                <Button variant="contained" color="primary">
                                    Join Auction Room
                                </Button>
                            </Link>
                            </ Box>
                            : 
                            <ClaimButtons props={props.props}/>
                        }
                        <br/>
                    </CardContent>
                </Box>
            </Card>
        </Box>
    )
}