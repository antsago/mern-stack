const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`  
  type User {
    id: ID!
    email: String
    givenName: String
    familyName: String
  }

  input UserInput {
    email: String
    givenName: String
    familyName: String
  }

  type Query {
    user(id: ID!): User
  }

  type Mutation {
    createUser(user: UserInput): User
    updateUser(id: ID!, user: UserInput): User
  }
`);

const fakeDatabase = {};
// The root provides a resolver function for each API endpoint
const root = {
  user: ({id}) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no users exists with id ${id}`);
    }
    return fakeDatabase[id];
  },
  createUser: ({input}) => {
    // Create a random id for our "database".
    const id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return { id, ...fakeDatabase[id] };
  },
  updateMessage: ({id, input}) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no users exists with id ${id}`);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return { id, ...fakeDatabase[id] };
  },
};

const app = express();
app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // disable in production
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/');