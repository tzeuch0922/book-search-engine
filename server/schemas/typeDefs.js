// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
    type User
    {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book
    {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth
    {
        token: ID!
        user: User
    }

    type Test
    {
        value: String
    }

    type Query
    {
        me: User
        test: Test
    }

    type Mutation
    {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String]!, description: String!, title: String!, bookId: String!, image: String!, link: String!): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;