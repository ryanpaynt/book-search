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

    login: async (parent, {email, password}) => {
      const user = await User.findOne({email});

      if(!user) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if(!correctPw) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const token = signToken(user);
      return {token, user};
    }
  },
};

module.exports = resolvers;
