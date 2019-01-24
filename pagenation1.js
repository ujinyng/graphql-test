var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema } = require('graphql');

var schema = buildSchema(`
    type Query{
        hero(id: Int!): [Friend]
    }
    
    type Friend{
        name: String
    }

    type fragment 
`);

var root = {
    hero: (args, context, info) => {
    
        console.log(context);
        console.log(args);
        //query에 arguments를 넣음으로써 조건을 넣을수 있음.
        const {name, age} = args;
        //조건은 스키마에 명시
        return [
            {   name: "kim", friends:20},
            {   name: "lee", friends:30},
            {   name: "yoo", age:40},
        ]
    }
};

var app = express();
var session = {id: "1001", expires: 20000};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    context: session,
    graphiql: process.env.NODE_ENV === 'development',
}));

app.listen (4000, ()=> console.log('Now browse to localhost:4000/graphql'));
