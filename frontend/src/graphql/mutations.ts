import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation login($email: String!, $password: String!){
        login(email:$email, password: $password) {
            user {
            username
            email
            }
            errors {
                field
                message
            }
        }
    }
`

export const REGISTER = gql`
    mutation register($email: String!, $username: String!, $password: String!){
        register(email:$email, username: $username, password: $password) {
                user {
                username
                email
            }
            errors {
                field
                message
            }
        }
    }
`

export const BID = gql`
    mutation bid($bid: Float!, $auctionId: Float!){
        bid(bid: $bid, auctionId: $auctionId){
            auction {
                leaderId
                endTime
                currentBid
            }
            errors{
                field
                message
            }
        }
    }
`
 
export const CREATE_CARD = gql`
    mutation createCard($name:String!, $description: String!){
    createCard (name:$name, description: $description){
        card {
            id
            name
            description
            auctionId
        }
        errors {
            field
            message
        }
    }
}
`

export const CREATE_AUCTION = gql`
    mutation createAuction($length:Float!, $cardId:Float!, $startingBid: Float!){
        createAuction(length: $length, cardId: $cardId, startingBid: $startingBid){
            auction {
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
            errors {
                field
                message
            }
        }
    }
`

export const LOGOUT = gql`
    mutation logout {
        logout
    }
`
 
export const CLAIM_ITEM = gql`
    mutation claimItem($auctionId:Float!){
        claim(auctionId: $auctionId){
            auction {
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
            errors {
            field
            message
            }
        }
    }
`

export const CLAIM_COINS = gql`
mutation claimCoins($auctionId:Float!){
        claimCoins(auctionId: $auctionId){
            auction {
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
            errors {
            field
            message
            }
        }
    }
`

export const GET_COINS = gql`
mutation getCoins{
    getCoins
}
`
 