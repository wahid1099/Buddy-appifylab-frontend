import React from 'react';

const ProfileStats = ({ postCount, followersCount, followingCount }) => {
  return (
    <div style={{
      background: 'var(--bg2)',
      padding: '20px 24px',
      borderRadius: '8px',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-around',
      gap: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color6)' }}>
          {postCount}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--color7)', marginTop: '4px' }}>
          Posts
        </div>
      </div>
      <div style={{ textAlign: 'center', cursor: 'pointer' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color6)' }}>
          {followersCount}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--color7)', marginTop: '4px' }}>
          Followers
        </div>
      </div>
      <div style={{ textAlign: 'center', cursor: 'pointer' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color6)' }}>
          {followingCount}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--color7)', marginTop: '4px' }}>
          Following
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
