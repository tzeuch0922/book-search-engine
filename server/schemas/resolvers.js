const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers =
{
    Query:
    {    
        me: async(parent, args, context) =>
        {
            if(context.user)
            {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedBooks');

                return userData;
            }
        },
        test: async(parent, args) =>
        {
            console.log("test entered");
            return {value: "success"};
        }
    },
    Mutation:
    {
        login: async (parent, { email, password }) =>
        {
            const user = await User.findOne({ email });
            if(!user)
            {
                throw new AuthenticationError('Incorrect username');
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw)
            {
                throw new AuthenticationError('Incorrect password');
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) =>
        {
            console.log("add-user", args);
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, args, context) =>
        {
            if(context.user)
            {
                const user = await User.findByIdAndUpdate({ _id: context.user._id}, {$addToSet: { savedBooks: args.input }}, { new: true });
                return user;
            }
        },
        removeBook: async (parent, args, context) =>
        {
            if(context.user)
            {
                const user = await User.findByIdAndUpdate({ _id: context.user.id }, {$pull: { savedBooks: { bookId: args.bookId }}}, { new: true });
                return user;
            }
        }
    }
};

module.export = resolvers;