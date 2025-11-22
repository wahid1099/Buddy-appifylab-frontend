import React from 'react';

const ProfileHeader = ({ user, isOwnProfile, isFollowing, onEditClick, onFollowClick }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Cover Photo */}
      <div style={{
        width: '100%',
        height: '300px',
        background: user.coverImage 
          ? `url(${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.coverImage}) center/cover`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px 8px 0 0',
        position: 'relative'
      }}>
        {isOwnProfile && (
          <button
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📷 Change Cover
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div style={{
        background: 'var(--bg2)',
        padding: '24px',
        borderRadius: '0 0 8px 8px',
        position: 'relative',
        marginTop: '-60px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
          {/* Profile Picture */}
          <div style={{ position: 'relative' }}>
            <img
              src={user.profileImage 
                ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.profileImage}`
                : '/images/profile.png'}
              alt={`${user.firstName} ${user.lastName}`}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                border: '5px solid var(--bg2)',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* User Info */}
          <div style={{ flex: 1, paddingTop: '60px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              margin: '0 0 8px 0',
              color: 'var(--color6)'
            }}>
              {user.firstName} {user.lastName}
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: 'var(--color7)', 
              margin: '0 0 16px 0',
              maxWidth: '600px'
            }}>
              {user.bio || 'No bio yet'}
            </p>
          </div>

          {/* Action Button */}
          <div style={{ paddingTop: '60px' }}>
            {isOwnProfile ? (
              <button
                onClick={onEditClick}
                style={{
                  background: 'var(--color5)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#1a6fd8'}
                onMouseLeave={(e) => e.target.style.background = 'var(--color5)'}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                onClick={onFollowClick}
                style={{
                  background: isFollowing ? 'transparent' : 'var(--color5)',
                  color: isFollowing ? 'var(--color5)' : '#fff',
                  border: `2px solid var(--color5)`,
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {isFollowing ? 'Following' : '+ Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
