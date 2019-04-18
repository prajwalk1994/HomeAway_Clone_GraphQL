import {gql} from 'apollo-boost'

const getSearchResults = gql`
    query searchProperties($City : String, $NumberOfGuests : Int){
        searchProperties(City : $City, NumberOfGuests : $NumberOfGuests){
            id
            Title
            Owner
            Address
            City
            Rate
            Zip
            Rate
            Bedrooms
        }
    }
`;

const getProperty = gql`
    query property($id : ID!){
        property(id : $id){
            id
            Title
            Owner
            Address
            City
            State
            Zip
            Rate
            Bedrooms
            Bathrooms
            Description
            NumberOfGuests
        }
    }
`;

export {getSearchResults, getProperty};