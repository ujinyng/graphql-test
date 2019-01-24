var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema } = require('graphql');

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
    //args : query에 쓰는 인자,
    //info : 스키마의 정보
    persons: (args, context, info) => {
    //콘솔에 context 출력
    //context를 사용하여 비인가된 사용자에게 api를 제공하지 않을수 있음
    //그러나 resolver에서 session검증을 하기보다는 비즈니스 로직단에서 검증하는것을 권장
        console.log(context);

        return [
            {   name: "kim", age:20},
            {   name: "lee", age:30},
            {   name: "yoo", age:40},
        ];
    }
};

var app = express();
var session = {id: "1001", expires: 20000};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    context: session,
    graphiql: true,
}));

app.listen (4000, ()=> console.log('Now browse to localhost:4000/graphql'));
