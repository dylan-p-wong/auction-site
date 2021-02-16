import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import { Button, ButtonGroup, CircularProgress } from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { ME } from "../graphql/queries";
import { CLAIM_ITEM, CLAIM_COINS } from "../graphql/mutations";

export default function ClaimButtons(props: any){
    const { loading, error, data } = useQuery(ME);
    const { id, leaderId, ownerId, coinsClaimed, itemClaimed, currentBid, startingBid, auctionStart, endTime, card } = props.props;
    const [claimItem] = useMutation(CLAIM_ITEM);
    const [claimCoins] = useMutation(CLAIM_COINS);
    const [didMount, setDidMount] = useState(false); 
    const client = useApolloClient();

    useEffect(() => {
        setDidMount(true);
        return () => setDidMount(false);
    });

    if (loading) return <CircularProgress color="primary"/>
    if (error) return <p>Error</p>;    

    if (!data.me){
        return <p>You are not logged in</p>;
    }

    return (
        <Fragment>
            <ButtonGroup variant="contained" color="primary">
                {
                    (leaderId != null && data.me.id === ownerId && !coinsClaimed) ? (<Button 
                        onClick={async () => {
                            await claimCoins({variables: {auctionId: id}});
                            await client.resetStore();
                        }
                }>Claim Coins</Button>) : (<Button disabled>Claim Coins</Button>)
                }
                {
                    ((leaderId == null && data.me.id === ownerId && !itemClaimed) || (leaderId != null && data.me.id === leaderId && !itemClaimed)) ? (<Button 
                        onClick={async () => {
                            await claimItem({variables: {auctionId: id}});
                            await client.resetStore();
                        }
                }>Claim Item</Button>) : (<Button disabled>Claim Item</Button>)
                }
            </ButtonGroup>
        </Fragment>
    )
}