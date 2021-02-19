import { useMutation, useApolloClient, useQuery } from "@apollo/client";
import { AppBar, Box, List, ListItem, Typography, Button, Toolbar, Drawer } from "@material-ui/core";
import { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { ME } from "../graphql/queries";
import { LOGOUT } from "../graphql/mutations";
import { useEffect, useState } from "react";

function AuctionLink() {
    return (
    <Link to="/auctions" style={{textDecoration: "none"}}>
        <Box ml={2} mr={2}>
            <Button variant="contained">
                Auctions
            </Button>
        </Box>
    </Link>
)}

function LoginLink() {
    return (
        <Link to="/login" style={{textDecoration: "none"}}>
            <Box ml={2} mr={2}>
                <Button variant="contained">
                    Login
                </Button>
            </Box>
        </Link>
    )
}

function RegisterLink() {
    return (
    <Link to="/register" style={{textDecoration: "none"}}>
        <Box ml={2} mr={2}>
            <Button variant="contained">
                Register
            </Button>
        </Box>
    </Link>
    )
}

function AccountLink() {
    return (
    <Link to="/me" style={{textDecoration: "none"}}>
        <Box ml={2} mr={2}>
            <Button variant="contained">
                My Account
            </Button>
        </Box>
    </Link>
    )
}

export default function Navbar(){
    const { loading, error, data } = useQuery(ME);
    const [logout] = useMutation(LOGOUT);
    const client = useApolloClient();
    const history = useHistory();
    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false
    });

    useEffect(() => {
        const setResponsiveness = () => {
          return window.innerWidth < 620
            ? setState((prevState: any) => ({ ...prevState, mobileView: true }))
            : setState((prevState: any) => ({ ...prevState, mobileView: false }));
        };
        setResponsiveness();
        window.addEventListener("resize", () => setResponsiveness());
    }, []);

    const toggleDrawer =  (open: boolean) => (event : React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
              (event as React.KeyboardEvent).key === 'Shift')
          ) {
            return;
          }

          setState({...state, drawerOpen: open});
    } 

    function LogoutLink(){
        return (
            <Box ml={2} mr={2}>
                <Button variant="contained" onClick={async ()=>{
                    await logout();
                    client.resetStore().then(() => {
                        history.push("/");
                    });
                }}>
                    Logout
                </Button>
            </Box>
        )
    }

    function UserInfo(){
        return (
            <Fragment>
                <Typography>
                    {data.me.username} Coins: {data.me.coins}
                </Typography>
            </Fragment>
        )
    }

    const links = (
        <Fragment>
            {data ? (
                <AuctionLink />
            ) : <Typography>Error Connecting to Server</Typography>}
            {loading || !data ? null: !data.me ? (
                <Fragment>
                    <LoginLink />
                    <RegisterLink />
                </Fragment>
            ): (
                <Fragment>
                <AccountLink />
                <LogoutLink />
                <UserInfo />
                </Fragment>
            )}
        </Fragment>
    );

    const mobileLinks = (
        <Fragment>
            <Box display="flex" justifyContent="center">
                <List>
                {data ? (
                    <ListItem style={{justifyContent: "center"}}>
                        <AuctionLink/>
                    </ListItem>
                ) : <Typography>Error Connecting to Server</Typography>}
                {loading || !data ? null: !data.me ? (
                    <Fragment>
                        <ListItem style={{justifyContent: "center"}}>
                            <LoginLink />
                        </ListItem>
                        <ListItem style={{justifyContent: "center"}}>
                            <RegisterLink />
                        </ListItem>
                    </Fragment>
                ): (
                    <Fragment>
                        <ListItem>
                            <AccountLink />
                        </ListItem>
                        <ListItem style={{justifyContent: "center"}}>
                            <LogoutLink />
                        </ListItem>
                        <ListItem style={{justifyContent: "center"}}>
                            <UserInfo />
                        </ListItem>
                    </Fragment>
                )}
                </List>   
            </Box> 
        </Fragment>
    )

    if (!state.mobileView) 
    return (
    <AppBar position="static">
        <Toolbar>
            {links}
        </Toolbar>
    </AppBar>)

    return (
    <AppBar position="static">
        <Toolbar>
            <Button variant="contained" onClick={toggleDrawer(true)}>Menu</Button>
            <Drawer onClick={toggleDrawer(false)} anchor="top" open={state.drawerOpen} onClose={toggleDrawer(false)}> 
                {mobileLinks}
            </Drawer>
            {data && data.me ? (<Box mr={2} ml={2}><UserInfo/></Box>) : null}
        </Toolbar>
    </AppBar>)
}