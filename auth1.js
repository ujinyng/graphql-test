var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema} =require('graphql');

var schema= buildSchema(`
    type Query{
        ip: String
    }`
);

function loggingMiddleware(req,res,next){
    console.log('ip:',req.ip);
    next();
}

var root = {
    ip: function (args,request){
        return request.ip;
    }
};

var app = express();
app.use(loggingMiddleware);
app.use('/graphql',graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: process.env.NODE_ENV === 'development',
}));
app.listen (4000, ()=> console.log('Now browse to localhost:4000/graphql'));
