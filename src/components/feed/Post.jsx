import React, { useState } from 'react';
import { likeAPI, commentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentSection from './CommentSection';

const Post = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  const handleLike = async () => {
    try {
      const response = await likeAPI.toggleLike({
        targetType: 'Post',
        targetId: post._id
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
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const isAuthor = user && post.author._id === user.id;

  return (
    <div className="_feed_inner_post_card _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16" style={{ backgroundColor: 'var(--bg2)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
      {/* Post Header */}
      <div className="_feed_post_header" style={{ marginBottom: '12px' }}>
        <div className="_feed_post_user">
          <img 
            src={post.author.profileImage || "/images/profile.png"} 
            alt="User" 
            className="_post_user_img" 
            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%' }}
          />
          <div className="_feed_post_user_info" style={{ marginLeft: '12px' }}>
            <h4 className="_post_user_name" style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 2px 0', color: 'var(--color6)' }}>
              {post.author.firstName} {post.author.lastName}
            </h4>
            <p className="_post_time" style={{ fontSize: '13px', color: 'var(--color7)', margin: 0 }}>
              {formatDate(post.createdAt)} · {post.visibility === 'private' ? '🔒 Private' : '🌐 Public'}
            </p>
          </div>
        </div>
        {isAuthor && (
          <button 
            className="_feed_post_more"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this post?')) {
                onDelete(post._id);
              }
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--color7)" viewBox="0 0 20 20">
              <circle cx="10" cy="3" r="2"></circle>
              <circle cx="10" cy="10" r="2"></circle>
              <circle cx="10" cy="17" r="2"></circle>
            </svg>
          </button>
        )}
      </div>
      
      {/* Post Content */}
      <div className="_feed_post_content" style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '15px', lineHeight: '1.5', margin: 0, color: 'var(--color6)' }}>{post.content}</p>
      </div>
      
      {/* Post Image */}
      {post.image && (
        <div className="_feed_post_image" style={{ margin: '0 -24px 12px -24px' }}>
          <img 
            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${post.image}`} 
            alt="Post" 
            className="_post_img" 
            style={{ 
              width: '100%', 
              maxHeight: '600px', 
              objectFit: 'cover',
              display: 'block',
              animation: 'fadeIn 0.5s ease-in',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.01)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            onError={(e) => {
              console.error('Image failed to load:', post.image);
              e.target.style.display = 'none';
            }}
          />
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
      
      {/* Reactions Summary */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid var(--bg4)',
        marginBottom: '8px',
        fontSize: '14px',
        color: 'var(--color7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {likesCount > 0 && (
            <>
              <div style={{ display: 'flex', marginRight: '6px' }}>
                <span style={{ fontSize: '16px' }}>❤️</span>
              </div>
              <span>{likesCount}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {commentsCount > 0 && <span>{commentsCount} Comment{commentsCount !== 1 ? 's' : ''}</span>}
          <span>122 Share</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        borderBottom: '1px solid var(--bg4)',
        paddingBottom: '8px',
        marginBottom: '12px'
      }}>
        <button 
          onClick={handleLike}
          style={{ 
            flex: 1,
            background: isLiked ? 'var(--color9)' : 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '15px',
            fontWeight: '600',
            color: isLiked ? 'var(--color5)' : 'var(--color7)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--bg3)'}
          onMouseLeave={(e) => e.target.style.background = isLiked ? 'var(--color9)' : 'transparent'}
        >
          <span style={{ fontSize: '18px' }}>😊</span>
          <span>Haha</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          style={{ 
            flex: 1,
            background: 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--color7)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--bg3)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.083 18.333H5.417c-2.917 0-4.167-1.25-4.167-4.166V7.5c0-2.917 1.25-4.167 4.167-4.167h9.166c2.917 0 4.167 1.25 4.167 4.167v6.667c0 2.916-1.25 4.166-4.167 4.166h-1.666c-.259 0-.509.134-.659.35l-1.25 1.667c-.55.733-1.45.733-2 0l-1.25-1.667a.908.908 0 00-.675-.35z"/>
          </svg>
          <span>Comment</span>
        </button>

        <button 
          style={{ 
            flex: 1,
            background: 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#65676b',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#f2f3f5'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.367 2.517l-6.95 6.95c-.267.266-.525.791-.575 1.166l-.35 2.642c-.125.933.525 1.575 1.45 1.45l2.642-.35c.375-.05.9-.309 1.166-.575l6.95-6.95c1.2-1.2 1.767-2.592 0-4.359-1.766-1.766-3.158-1.2-4.333.026z"/>
          </svg>
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection 
          postId={post._id} 
          onCommentAdded={() => setCommentsCount(prev => prev + 1)}
        />
      )}
    </div>
  );
};

export default Post;
