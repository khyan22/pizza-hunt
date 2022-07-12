const { Comment, Pizza } = require('../models');

const commentController = {
  //add comment to pizza
  addComment({ params, body }, res) {
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
  removeComment({ params }, res) {
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
  //update comment
  updateComment() {
   //!add functionality
  }
};

module.exports = commentController;