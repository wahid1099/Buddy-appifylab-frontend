import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users, currentUserId }) => {
  const navigate = useNavigate();

  if (!users || users.length === 0) {
    return (
      <div style={{
        background: 'var(--bg2)',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        color: 'var(--color7)'
      }}>
        No users to display
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {users.map(user => (
        <div
          key={user._id}
          style={{
            background: 'var(--bg2)',
            padding: '20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onClick={() => navigate(`/profile/${user._id}`)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <img
            src={user.profileImage 
              ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.profileImage}`
              : '/images/profile.png'}
            alt={`${user.firstName} ${user.lastName}`}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: '0 0 4px 0',
              color: 'var(--color6)'
            }}>
              {user.firstName} {user.lastName}
            </h4>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--color7)', 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.bio || 'No bio'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
