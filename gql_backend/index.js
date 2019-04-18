const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
var mongoose = require('./db/mongoose');
const {frontendIP} = require('./config/config');

app.use(cors({ origin: frontendIP, credentials: true }));

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', frontendIP);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));


app.listen(3002, () => {
    console.log("GraphQL server started on port 3001");
})