const router = require('express').Router();
const { 
  createComment, 
  deleteComment, 
  createReply, 
  deleteReply,
} = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router
  .route('/:pizzaId')
  .post(createComment);

// /api/comments/<pizzaId>/<commentId>
router
  .route('/:pizzaId/:commentId')
  .put(createReply)
  .delete(deleteComment)

router
  .route('/:pizzaId/:commentId/:replyId')
  .delete(deleteReply)

module.exports = router;