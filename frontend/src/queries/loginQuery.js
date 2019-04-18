import {gql} from 'apollo-boost';

const loginQuery = gql`
    query user($email : String!, $password : String!, $role : String!){
        user(email : $email, password : $password, role : $role){
            email
        }
    }
`;

const getProfile = gql`
    query getProfile($email : String!){
        getProfile(email : $email){
            profile{
                aboutMe
                phoneNumber
                gender
                language
                hometown
                company
                city
                country
                school
            }
        }
    }
`;

export {loginQuery, getProfile}