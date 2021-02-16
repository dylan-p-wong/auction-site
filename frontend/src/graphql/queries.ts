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
      ownerId
      endTime
      auctionStart
      startingBid
      currentBid
      coinsClaimed
      itemClaimed
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
      coins
      cards {
        id
        name
        description
        auctionId
      }
      auctions {
        id
        leaderId
        ownerId
        endTime
        auctionStart
        startingBid
        currentBid
        coinsClaimed
        itemClaimed
        card {
          id
          name
          description
        }
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
        ownerId
        endTime
        auctionStart
        startingBid
        currentBid
        coinsClaimed
        itemClaimed
        card {
          id
          name
          description
        }
      }
    }
  }
`