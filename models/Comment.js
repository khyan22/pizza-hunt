const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
  {
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId
    },
    replyBody: {
      type: String,
      required: "Tell the world what you think.",
      trim: true
    }, 
    writtenBy: {
      type: String,
      required: "Don't be shy, tell us your name",
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const CommentSchema = new Schema({
    writtenBy: {
      type: String,
      required: "Don't be shy, tell us your name",
      trim: true
    },
    commentBody: {
      type: String,
      required: "Tell the world what you think.",
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [ReplySchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;