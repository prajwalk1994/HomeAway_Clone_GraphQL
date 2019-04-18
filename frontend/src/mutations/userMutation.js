import {gql} from 'apollo-boost';

const signupMutation = gql`
    mutation addUser($email : String!, $password : String!, $fullName : String!, $role : String!){
        addUser(email : $email, password : $password, fullName : $fullName, role : $role){
            email
        }
    }
`;

const updateProfile = gql`
    mutation updateProfile($email : String, $aboutMe : String, $phoneNumber : String, $language : String, $gender : String){
        updateProfile(email : $email, aboutMe : $aboutMe, phoneNumber : $phoneNumber, language : $language, gender : $gender){
            email
        }
    }
`;

export {signupMutation, updateProfile};