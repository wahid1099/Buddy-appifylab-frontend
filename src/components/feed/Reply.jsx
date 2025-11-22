import React, { useState } from 'react';
import { likeAPI } from '../../services/api';

const Reply = ({ reply }) => {
  const [isLiked, setIsLiked] = useState(reply.isLiked);
  const [likesCount, setLikesCount] = useState(reply.likesCount);

  const handleLike = async () => {
    try {
      const response = await likeAPI.toggleLike({
        targetType: 'Reply',
        targetId: reply._id
      });
      setIsLiked(response.liked);
      setLikesCount(response.likesCount);
    } catch (error) {
      console.error('Failed to toggle like:', error);
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
    <div className="reply-item _mar_b12">
      <div className="d-flex">
        <img 
          src={reply.author.profileImage || "/images/profile.png"} 
          alt="User" 
          className="rounded-circle me-2" 
          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
        />
        <div className="flex-grow-1">
          <div className="bg-light p-2 rounded">
            <div className="d-flex justify-content-between align-items-start">
              <h6 className="mb-1" style={{ fontSize: '0.85em', fontWeight: '600' }}>
                {reply.author.firstName} {reply.author.lastName}
              </h6>
              <small className="text-muted" style={{ fontSize: '0.75em' }}>
                {formatDate(reply.createdAt)}
              </small>
            </div>
            <p className="mb-0" style={{ fontSize: '0.85em' }}>{reply.content}</p>
          </div>
          
          <div className="mt-1">
            <button 
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={handleLike}
              style={{ fontSize: '0.75em', color: isLiked ? '#ff6b6b' : '#666' }}
            >
              {isLiked ? 'Liked' : 'Like'} {likesCount > 0 && `(${likesCount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
