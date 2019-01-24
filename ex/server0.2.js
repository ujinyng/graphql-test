var express = require('express');
var uuid = require('uuid');
var graphqlHTTP = require('express-graphql');
var Graphql  = require('graphql');
var { makeExecutableSchema } = require('graphql-tools');

var fakeDatabase = require('./fakedata.js');

var app = express();
var id = uuid.v4();
var port = 3000;

const typeDefs = `
type geo{
  lat:Float,
  lng:Float
}
type company{
  name:String
 catchPhrase:String
  bs:String
}
type address{
  street:String
  suite:String
  city:String
  zipcode:String
  geo:geo
}
type user{
  id:Int
  name:String
  username:String
  email:String
  address:address
  phone:String
  website:String
  company:company
}

type Query{
  user(id:Int!):user
  allUser:[user]
}
`;

const resolvers = {

Query: {
    user(_, { id }) {
      const data = Object.keys(fakeDatabase).filter(element => {
        if (fakeDatabase[element].id == id) {
         return element;
        }
      });
      return fakeDatabase[data];
    },
    allUser() {
      return fakeDatabase;
    }
  }

const schema = makeExecutableSchema({ //typeDefs와 resolvers를 결합해서 하나의 $
  typeDefs,
  resolvers
});

app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
        })
);

var server = app.listen(port, function () {
  console.log('Express and GraphQL server has started on port: ' + port);
});

app.get('/', function (req,res) {
  res.send(id)
});

