import React, { useState, useEffect } from 'react';
import { commentAPI } from '../../services/api';
import Comment from './Comment';

const CommentSection = ({ postId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await commentAPI.getComments(postId);
      setComments(response.comments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await commentAPI.createComment({
        postId,
        content: commentContent
      });
      setComments([response.comment, ...comments]);
      setCommentContent('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-section _mar_t24 _padd_t24" style={{ borderTop: '1px solid #e0e0e0' }}>
      <form onSubmit={handleSubmit} className="_mar_b24">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={submitting}
          />
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={submitting || !commentContent.trim()}
          >
            {submitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-muted">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
