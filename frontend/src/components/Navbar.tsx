import { useMutation, useApolloClient, useQuery } from "@apollo/client";
import { AppBar, Box, Typography, Button, Toolbar } from "@material-ui/core";
import { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { ME } from "../graphql/queries";
import { LOGOUT } from "../graphql/mutations";

export default function Navbar(){
    const { loading, error, data } = useQuery(ME);
    const [logout] = useMutation(LOGOUT);
    const client = useApolloClient();
    const history = useHistory();

    return (
        <AppBar position="static">
            <Toolbar>
                <Link to="/auctions">
                    <Box m={2}>
                        <Button variant="contained">
                            Auctions
                        </Button>
                    </Box>
                </Link>

                {loading ? null: !data.me ? (
                    <Fragment>
                        <Link to="/login">
                            <Box m={2}>
                                <Button variant="contained">
                                    Login
                                </Button>
                            </Box>
                        </Link>
                        <Link to="/register">
                            <Box m={2}>
                                <Button variant="contained">
                                    Register
                                </Button>
                            </Box>
                        </Link>
                    </Fragment>
                ): (
                    <Fragment>
                    <Link to="/me">
                        <Box m={2}>
                            <Button variant="contained">
                                My Account
                            </Button>
                        </Box>
                    </Link>
                    <Box m={2}>
                        <Button variant="contained" onClick={async ()=>{
                            await logout();
                            client.resetStore().then(() => {
                                history.push("/");
                            });
                        }}>
                            Logout
                        </Button>
                    </Box>
                    <Typography>
                        Coins: {data.me.coins}
                    </Typography>
                    </Fragment>
                )}
            </Toolbar>
        </AppBar>
    );
    

    
}