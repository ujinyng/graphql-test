var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema } = require('graphql');

//String형태로 명시
var schema = buildSchema(`
    type Query{
        hello: String
        persons: [Person]
    }
    
    type Person{
        name: String
        age: Int

    }
`);

var root = {
    hello: () => 'Hello World',
    persons: () => {
        return [
            {   name: "kim", age:20},
            {   name: "lee", age:30},
            {   name: "yoo", age:40},
        ];
    }
};

var app = express();
//buildScema로 정의한 패턴에서는 graphqlHTTPl rootValue가 resolver의 집합이고,
//query와 매칭되는 rootValue가 실행됨
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen (4000, ()=> console.log('Now browse to localhost:4000/graphql'));
