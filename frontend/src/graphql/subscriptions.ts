import { gql } from '@apollo/client';

export const AUCTION_SUBSCRIPTION = gql`
subscription newBid($auctionId: Float!){
  newBid (auctionId: $auctionId){
    id
    leaderId
    ownerId
    endTime
    auctionStart
    startingBid
    currentBid
    coinsClaimed
    itemClaimed
  }
}
`