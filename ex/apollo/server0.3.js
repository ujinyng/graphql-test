var express = require('express');
var uuid = require('uuid');
var graphqlHTTP = require('express-graphql');
var Graphql  = require('graphql');
//var { makeExecutableSchema } = require('graphql-tools');
//2
var { ApolloServer, gql } = require('apollo-server-express');
//var bodyParser = require('body-parser');
//const {gql, graphqlExpress, graphiqlExpress} = require('apollo-server-express$

var fakeDatabase = require('./fakedata.js');

var app = express();
var id = uuid.v4();
var port = 3000;
//2
const typeDefs = gql`
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

//axios로 바꿀수도있음
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
};

/*const schema = makeExecutableSchema({ //typeDefs와 resolvers를 결합해서 하나>$
  typeDefs,
  resolvers
});*/
//2 schema -> server
const server = new ApolloServer({
        typeDefs,
        resolvers,
        playground: {
                endpoint: "http://leekt.page:3000/graphql",
                settings: {
                        "editor.theme": "light"
                }
        }
});

const gpath = '/graphql';

//2
server.applyMiddleware({
        app, gpath
});

/*app.use('/graphql', bodyParser.json(), graphqlExpress( //request=>{
        {
                schema,
                tracing: true, //모니터링 위한 config
                cacheControl: true, //cache를 위한 config
        }       
        )
);
*/

//GraphiQL 시각화를 웨한 Endpoint
//app.use('/graphiql', graphiqlExpress({ endpointURL: "/graphql" }));



app.listen(port, function () {
  console.log('Express and GraphQL server has started on port: ' + port);
});

app.get('/', function (req,res) {
  res.send(id)
});




