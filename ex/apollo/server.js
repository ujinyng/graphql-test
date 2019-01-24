var express = require('express');
var { ApolloServer, gql } = require('apollo-server-express');

//var fakeDatabase = require('./fakedata.js');

var app = express();
var port = 3000;

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const typeDefs = gql`
        type Book {
                title: String
                author: String
        }

        type Query {
                books: [Book]
        }
`;

//axios로 바꿀수도있음
const resolvers = {
  Query: {
        books: () => books,
  },
};

const server = new ApolloServer({typeDefs,resolvers,
                engine: process.env.ENGINE_API_KEY,
        },
);
server.applyMiddleware({app});
app.listen(port, function () {
  console.log('Express and GraphQL server has started on port: ' + port);
});



