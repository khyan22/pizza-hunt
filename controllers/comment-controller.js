const { Comment, Pizza } = require('../models');

const commentController = {
  //*comment methods
  createComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId},
          { $push: {comments: _id }},
          { new: true}
        )
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404),json({ message: 'Pizza not found.'});
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },
  //remove comment 
  deleteComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId})
      .then(deleteComment => {
        if (!deleteComment) {
          return res.status(404).json({ message: 'Comment not found.'});
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId},
          { $pull: { comments: params.commentId }},
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if(!dbPizzaData) {
          res.status(404).json({ message: 'Pizza not found.'});
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },
  //*reply methods
  createReply({ params, body }, res) {
    Comment.findOneAndUpdate(
        { _id: params.commentId }, 
        { $push: { replies: body } }, 
        { new: true, runValidators: true }
      )
    .then(dbPizzaData => {
      if (!dbPizzaData) {
        res.status(404).json({ message: 'Pizza not found.'});
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => res.json(err));
  },
  deleteReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: {replies: { replyId: params.replyId}}},
      { new: true }
      )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err)
      ); 
  },
};

module.exports = commentController;
