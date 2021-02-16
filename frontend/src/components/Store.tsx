import { useApolloClient, useMutation } from "@apollo/client";
import { Button, Box } from "@material-ui/core";
import { GET_COINS } from "../graphql/mutations";

export default function Store(){
    const client = useApolloClient();
    const [getCoins] = useMutation(GET_COINS);

    return (        
        <Box m={5} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={async () => {
                    await getCoins();
                    await client.resetStore();
                }
            }>Claim 500 Coins</Button>
        </Box>
    )
}