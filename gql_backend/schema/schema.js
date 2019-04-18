const graphql = require('graphql');
const {Users} = require('../models/users');
const {Properties} = require('../models/properties');
const graphqlDate = require('graphql-iso-date');
const _ = require('lodash');
const crypt = require('../lib/crypt');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = graphql;

const {GraphQLDate} = graphqlDate;

const UserType = new GraphQLObjectType({
    name : 'User',
    fields : () => ({
        id : {type : GraphQLID},
        fullName : {type : GraphQLString},
        email : {type : GraphQLString},
        password : {type : GraphQLString},
        role : {type : GraphQLString},
        bookedProperties : {type : GraphQLList(PropertyType)},
        profile : {type : ProfileType},
    })
})

const ProfileType = new GraphQLObjectType({
    name : 'Profile',
    fields : () => ({
        aboutMe : {type : GraphQLString},
        phoneNumber : {type : GraphQLString},
        language : {type : GraphQLString},
        gender : {type : GraphQLString},
        hometown : {type : GraphQLString},
        company : {type : GraphQLString},
        city : {type : GraphQLString},
        country : {type : GraphQLString},
        school : {type : GraphQLString},
    })
})

const PropertyType = new GraphQLObjectType({
    name : 'Property',
    fields : () => ({
        id : {type : GraphQLID},
        Title : {type : GraphQLString},
        Owner : {type : GraphQLString},
        Address : {type : GraphQLString},
        City : {type : GraphQLString},
        State : {type : GraphQLString},
        Zip: { type: GraphQLString },
        Bedrooms: { type: GraphQLString },
        Bathrooms: { type: GraphQLString },
        Rate: { type: GraphQLString },
        Description: { type: GraphQLString },
        StartDate: { type: GraphQLDate },
        EndDate: { type: GraphQLDate },
        NumberOfGuests: { type: GraphQLInt},
        Bookings: {type : GraphQLList(BookingType)}
    })
})

const BookingType = new GraphQLObjectType({
    name : 'Booking',
    fields : () => ({
        Traveller : {type : GraphQLString},
        StartDate : {type : GraphQLDate},
        EndDate : {type : GraphQLDate},
        NumberOfGuests : {type : GraphQLString},
    })
})

var loginVar = null;

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        user : {
            type : UserType,
            args : { 
                email : { type : GraphQLString }, 
                password : {type : GraphQLString}, 
                role : {type : GraphQLString}
             },
            async resolve(parent, args){
                console.log("Inside user query");
                console.log("Params : " , args);
                await Users.findOne({email : args.email, role : args.role},(error, result) => {
                    if(error){
                        loginVar = error;
                    } else {
                        if(crypt.compareHashSync(args.password, result.password)){
                            loginVar = result;
                        }
                    }
                })
                return loginVar;
            }
        },

        users : {
            type : new GraphQLList(UserType),
            resolve(parent, args){
                console.log("Inside users query");
                console.log("Params : ", args);
                return Users.find({});
            }
        },

        property : {
            type : PropertyType,
            args : {id : {type : GraphQLID}},
            resolve(parent, args){
                console.log("Inside property query");
                console.log("Params : ", args);
                return Properties.findById(args.id);
            }
        },

        searchProperties: {
            type: new GraphQLList(PropertyType),
            args: { City: { type: GraphQLString }, NumberOfGuests : {type : GraphQLInt} },
            resolve(parent, args) {
                console.log("Inside searchProperties query");
                console.log("Params : ", args);
                return Properties.find({ City: args.City, NumberOfGuests : {$gte : args.NumberOfGuests} })
            }
        },

        ownerProperties : {
            type : new GraphQLList(PropertyType),
            args : {Owner : {type : GraphQLString}},
            resolve(parent, args){
                console.log("Inside ownerProperties query");
                console.log("Params : ", args);
                return Properties.find({Owner : args.Owner})
            }
        },

        travellerProperties : {
            type : UserType,
            args : {email : {type : GraphQLString}},
            resolve(parent, args){
                console.log("Inside travellerProperties query");
                console.log("Params : ", args);
                return Users.findOne({email : args.email})
            }
        },

        getProfile : {
            type: UserType,
            args: { email: { type: GraphQLString } },
            resolve(parent, args) {
                console.log("Inside getProfile query");
                console.log("Params : ", args);
                return Users.findOne({ email: args.email })
            }
        },

    }
})

const Mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields : {
        addUser : {
            type : UserType,
            args : {
                fullName : {type : GraphQLString},
                email : {type : GraphQLString},
                password : {type : GraphQLString},
                role : {type : GraphQLString},
            },
            resolve(parent, args){
                console.log("Inside addUser mutation");
                console.log("Params : ", args);
                crypt.generateHash(args.password,(err, hash)=>{
                    let newUser = new Users({
                        fullName: args.fullName,
                        email: args.email,
                        role: args.role,
                        password: hash,
                    })
                    return newUser.save();
                })
                
            }
        },

        bookProperty : {
            type : UserType,
            args : {
                email : {type : GraphQLString},
                propertyId : {type : GraphQLID},
            },
            resolve(parent, args){
                console.log("Inside bookProperty Mutation");
                console.log("Params : ", args);
                Properties.findById(args.propertyId, (error, results) => {
                    console.log(results);
                    return Users.findOneAndUpdate({ email: args.email }, 
                        { $push: { bookedProperties : results }},
                        (error, res) => {
                        console.log(res);
                    })
                });
                
            }
        },

        updateProfile: {
            type: UserType,
            args: {
                email : {type : GraphQLString},
                aboutMe: { type: GraphQLString },
                phoneNumber: { type: GraphQLString },
                language: { type: GraphQLString },
                gender: { type: GraphQLString },
                hometown: { type: GraphQLString },
                company: { type: GraphQLString },
                city: { type: GraphQLString },
                country: { type: GraphQLString },
                school: { type: GraphQLString },
            },
            resolve(parent, args) {
                console.log("Inside updateProfile mutation");
                console.log("Params : ", args);
                let profile = {
                    email: args.email,
                    aboutMe: args.aboutMe,
                    phoneNumber: args.phoneNumber,
                    language: args.language,
                    gender: args.gender,
                    hometown: args.hometown,
                    company: args.company,
                    city: args.city,
                    country: args.country,
                    school: args.school,
                } 
                return Users.findOneAndUpdate({email : args.email},{$set :{profile : profile}})
            }
        }, 
    
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation : Mutation,
})