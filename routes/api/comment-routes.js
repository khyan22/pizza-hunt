const router = require('express').Router();
const { createComment, deleteComment, updateComment, createReply, deleteReply, updateReply } = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router
  .route('/:pizzaId')
  .post(createComment);

// /api/comments/<pizzaId>/<commentId>
router
  .route('/:pizzaId/:commentId')
  .put(updateComment)
  .put(createReply)
  .delete(deleteComment)

router
  .route('/:pizzaId/:commentId/:replyId')
  .put(updateReply)
  .delete(deleteReply)

module.exports = router;