import React, { useState, useEffect } from 'react';
import { commentAPI, likeAPI } from '../../services/api';
import Reply from './Reply';

const Comment = ({ comment, postId }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  const handleLike = async () => {
    try {
      const response = await likeAPI.toggleLike({
        targetType: 'Comment',
        targetId: comment._id
      });
      setIsLiked(response.liked);
      setLikesCount(response.likesCount);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const loadReplies = async () => {
    setLoadingReplies(true);
    try {
      const response = await commentAPI.getReplies(comment._id);
      setReplies(response.replies);
    } catch (error) {
      console.error('Failed to load replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleShowReplies = () => {
    if (!showReplies && replies.length === 0) {
      loadReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmittingReply(true);
    try {
      const response = await commentAPI.createReply(comment._id, { content: replyContent });
      setReplies([response.reply, ...replies]);
      setReplyContent('');
    } catch (error) {
      console.error('Failed to create reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="comment-item _mar_b16">
      <div className="d-flex">
        <img 
          src={comment.author.profileImage || "/images/profile.png"} 
          alt="User" 
          className="rounded-circle me-3" 
          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
        />
        <div className="flex-grow-1">
          <div className="bg-light p-3 rounded">
            <div className="d-flex justify-content-between align-items-start">
              <h6 className="mb-1" style={{ fontSize: '0.9em', fontWeight: '600' }}>
                {comment.author.firstName} {comment.author.lastName}
              </h6>
              <small className="text-muted">{formatDate(comment.createdAt)}</small>
            </div>
            <p className="mb-0" style={{ fontSize: '0.9em' }}>{comment.content}</p>
          </div>
          
          <div className="mt-2 d-flex gap-3" style={{ fontSize: '0.85em' }}>
            <button 
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={handleLike}
              style={{ color: isLiked ? '#ff6b6b' : '#666' }}
            >
              {isLiked ? 'Liked' : 'Like'} {likesCount > 0 && `(${likesCount})`}
            </button>
            <button 
              className="btn btn-link btn-sm p-0 text-decoration-none text-muted"
              onClick={handleShowReplies}
            >
              {showReplies ? 'Hide' : 'Reply'} {comment.repliesCount > 0 && `(${comment.repliesCount})`}
            </button>
          </div>

          {showReplies && (
            <div className="mt-3">
              <form onSubmit={handleReplySubmit} className="mb-3">
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    disabled={submittingReply}
                  />
                  <button 
                    className="btn btn-primary" 
                    type="submit"
                    disabled={submittingReply || !replyContent.trim()}
                  >
                    {submittingReply ? 'Sending...' : 'Reply'}
                  </button>
                </div>
              </form>

              {loadingReplies ? (
                <p className="text-muted">Loading replies...</p>
              ) : (
                <div className="replies-list">
                  {replies.map(reply => (
                    <Reply key={reply._id} reply={reply} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
