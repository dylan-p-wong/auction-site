import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, split, HttpLink } from '@apollo/client';
import {Box, Button} from "@material-ui/core";
import Auctions from "./components/Auctions";
import Auction from "./components/AuctionPage";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import Login from "./components/Login";
import Me from "./components/Me";
import Register from "./components/Register";
import CreateCard from "./components/CreateCard";
import CreateAuction from "./components/CreateAuction";
import Navbar from "./components/Navbar";

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache'
    },
    query: {
      fetchPolicy: 'no-cache'
    }
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Box fontFamily="Roboto">
          <Navbar />
          <Switch>
            <Route path="/me" exact>
              <Me />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/register" exact>
              <Register />
            </Route>
            <Route path="/create-auction">
              <CreateAuction />
            </Route>
            <Route path="/create-card" exact>
              <CreateCard />
            </Route>
            <Route path="/auction/:id">
              <Auction />
            </Route>
            <Route path="/auctions" exact>
              <Auctions />
            </Route>
            <Route path="/">
              <h1>
                Home
              </h1>
            </Route>
          </Switch>
        </Box>
      </Router>
    </ApolloProvider>
  );
}

export default App;
