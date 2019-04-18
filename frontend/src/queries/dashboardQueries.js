import { gql } from 'apollo-boost';

const travellerProperties = gql`
query travellerProperties($email : String!){
    travellerProperties(email : $email){
        bookedProperties{
            Title
            Description
            Bedrooms
            Bathrooms
            Rate
            StartDate
            EndDate
        }
    }
}
`;

const ownerProperties = gql`
query ownerProperties($Owner : String!){
    ownerProperties(Owner : $Owner){
        Title
        Description
        Bedrooms
        Bathrooms
        Rate
        Bookings{
            Traveller
        }
    }
}
`;

export {travellerProperties, ownerProperties};