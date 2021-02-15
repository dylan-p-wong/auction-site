import { gql } from '@apollo/client';

export const GET_CARDS = gql`
  query getCards {
    getCards {
      id
      name
      description
      user {
        username
        email
      }
      auctionId
    }
  }
`;

export const GET_AUCTIONS = gql`
  query getAuctions {
    getAuctions {
      id
      leaderId
      endTime
      auctionStart
      startingBid
      currentBid
      card {
        id
        name
        description
      }
    }
  }
`;

export const ME = gql`
  query me {
    me {
      id
      username
      email
      cards {
        id
        name
        description
        auctionId
      }
    }
  }
`;

export const GET_AUCTION = gql`
  query getAuction($auctionId:Float!){
    getAuction(auctionId: $auctionId){
      auction{
        id
        leaderId
        endTime
        auctionStart
        startingBid
        currentBid
        card {
          id
          name
          description
        }
      }
    }
  }
`