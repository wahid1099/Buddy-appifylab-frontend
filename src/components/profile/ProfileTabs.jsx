import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'posts', label: 'Posts', icon: '📝' },
    { id: 'followers', label: 'Followers', icon: '👥' },
    { id: 'following', label: 'Following', icon: '➕' }
  ];

  return (
    <div style={{
      background: 'var(--bg2)',
      borderRadius: '8px',
      padding: '8px',
      display: 'flex',
      gap: '8px'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            background: activeTab === tab.id ? 'var(--color5)' : 'transparent',
            color: activeTab === tab.id ? '#fff' : 'var(--color7)',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.target.style.background = 'var(--bg3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.target.style.background = 'transparent';
            }
          }}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
