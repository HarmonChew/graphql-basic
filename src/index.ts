import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "./schema.js"
import db from "./_db.js"

const PORT = 4000

const resolvers = {
  Query: {
    reviews: () => db.reviews,
    review: (_, args) => {
      return db.reviews.find((review) => {
        return review.id === args.id
      })
    },
    games: () => db.games,
    game: (_, args) => {
      return db.games.find((game) => {
        return game.id === args.id
      })
    },
    authors: () => db.authors,
    author: (_, args) => {
      return db.authors.find((author) => {
        return author.id === args.id
      })
    },
  },
  Game: {
    reviews: (parent) =>
      db.reviews.filter((review) => review.game_id === parent.id),
  },
  Author: {
    reviews: (parent) =>
      db.reviews.filter((review) => review.author_id === parent.id),
  },
  Review: {
    author: (parent) =>
      db.authors.find((author) => author.id === parent.author_id),
    game: (parent) => db.games.find((game) => game.id === parent.game_id),
  },
  Mutation: {
    deleteGame: (_, args) => db.games.filter((game) => game.id !== args.id),
    addGame: (_, args) => {
      const newId = db.games[db.games.length - 1].id + 1
      const newGame = {
        id: newId,
        ...args.game,
      }
      db.games.push(newGame)
      return newGame
    },
    editGame: (_, args) => {
      let newGame
      db.games = db.games.map((game) => {
        if (game.id === args.id) {
          newGame = { ...game, ...args.edits }
          return newGame
        }
        return game
      })
      return newGame
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
})

console.log("server ready at port:", url)
