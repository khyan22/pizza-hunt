const { Comment, Pizza } = require('../models');

const commentController = {
  //add comment to pizza
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
  //update comment
  updateComment({ params, body }, res) {
   Comment.findByIdAndUpdate( { _id: params.commentId }, body, { new: true })
    .then(dbCommentData => {
      if (!dbCommentData) {
        res.status(404).json({ message: 'Comment not found.'});
        return;
      }

      res.json(dbCommentData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  },
  createReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body }},
      { new: true }
    )
    .then(dbPizzaData => {
      if (!dbPizzaData) {
        res.status(404).json({ message: 'Pizza not found.'});
        return;
      }

      res.json(dbPizzaData);
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
  },
  deleteReply({ params }, res) {
    Comment.findByIdAndUpdate(
      { _id: params.commentId },
      { $pull: {replies: { replyId: params.replyId}}},
      { new: true }
      )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err)
      ); 
  },
  updateReply({ params, body }, res) {

  }
};

module.exports = commentController;