import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from "../helpers/useIsAuth";
import { AUCTION_SUBSCRIPTION } from "../graphql/subscriptions";
import { useQuery, useSubscription } from '@apollo/client';
import { GET_AUCTION } from "../graphql/queries";
import { Box, Button, CircularProgress } from "@material-ui/core";
import Auction from "./Auction";

interface ParamTypes {
    id: string
}

export default function AuctionPage() {
    useAuth();
    const { id } = useParams<ParamTypes>();
    const { loading, error, data } = useQuery(GET_AUCTION, {variables: { auctionId: parseInt(id)}});
    const { data: dataSub, loading: loadingSub } = useSubscription(AUCTION_SUBSCRIPTION, {variables: {auctionId: parseInt(id)}});

    if (loading) return <CircularProgress color="primary"/>
    if (error) return <p>Error</p>;  

    const info = data.getAuction.auction;

    if (!loadingSub && dataSub){
        const infoSub = dataSub.newBid;
        infoSub.card = info.card;

        return (        
            <Auction props={infoSub}></Auction>
        )
    }

    if (!info){
        return <p>This auction does not exist</p>
    }

    return <Auction props={info}></Auction>
}

