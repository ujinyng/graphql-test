var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema } = require('graphql');

/*
mutation test{
  createMessage(input:{
    author: "andy",
    content: "dfs",
  }){
    id
  }
}
*/

/*
mutation {
  updateMessage(id: "69a78ac13eff0c336d08", input: {content:"new", author: "jodsfhn doe"}) {
    content
    author
  }
}

/*
query {
  getMessage(id: "956ea83a4ac8e27ff0ec") {
    content
    author
  }
}
*/

/*
mutation{
 createMessage(input: {content:"this is content", author: "john"}) {
    id
    content
    author
  }
}
*/

var schema = buildSchema(`
    type Query{
        getMessage(id: ID!): Message
    }
    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
    
    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }
`);

//Message가 복잡한 fields를 가질경우 
class Message{
    constructor(id,{content, author}){
        this.id = id;
        this.content = content;
        this.author = author;
    }
};

//id와 input 매핑
var fakeDatabase = {};

var root = {
    getMessage: function({id}){
        if(!fakeDatabase[id]){
            throw new Error('no message exists with id' + id);
        }
        return new Message(id, fakeDatabase[id]);
    },
    createMessage: function ({input}){
        var id = require('crypto').randomBytes(10).toString('hex');

        fakeDatabase[id]=input;
        return new Message(id, input);
    },
    updateMessage: function({id,input}){
        if (!fakeDatabase[id]){
            throw new Error('no message exists with id' +id);
        }
        fakeDatabase[id] = input;
        return new Message(id,input);
    },
};


var app = express();
//var session = {id: "1001", expires: 20000};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
  //  context: session,
    graphiql: true,
}));

app.listen (4000, ()=> console.log('Running a GraphQL API server at localhost:4000/graphql'));

