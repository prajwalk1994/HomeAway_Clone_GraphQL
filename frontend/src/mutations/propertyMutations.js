import {gql} from 'apollo-boost';

const bookPropertyMutation = gql`
    mutation bookProperty($email : String!, $propertyId : ID!){
        bookProperty(email : $email, propertyId : $propertyId){
            bookedProperties{
                Title
            }
        }
    }
`;

export {bookPropertyMutation};