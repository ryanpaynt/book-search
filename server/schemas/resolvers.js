const { User, Books } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {

    me: async (parent, args, context) => {
      if(context.user){
        const data = await User.findOne({})
        .select('__v -password')
        .populate('books')

        return data;
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return {token, user};
    },
  },
};

module.exports = resolvers;
