import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import ThemeSwitcher from '../components/common/ThemeSwitcher';
import MobileNavigation from '../components/common/MobileNavigation';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileTabs from '../components/profile/ProfileTabs';
import Post from '../components/feed/Post';
import UserList from '../components/profile/UserList';
import EditProfileModal from '../components/profile/EditProfileModal';

const Profile = () => {
  const { userId: paramUserId } = useParams();
  const { user: currentUser } = useAuth();

  // Resolve which user to display: "me" alias or explicit id
  const effectiveUserId = paramUserId && paramUserId !== 'me' ? paramUserId : (currentUser?.id || '');

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser && currentUser.id === effectiveUserId;

  // ---------------------------------------------------------------------
  // Data loading helpers
  // ---------------------------------------------------------------------
  const loadProfileData = async () => {
    setLoading(true);
    try {
      const { user } = await userAPI.getUserProfile(effectiveUserId);
      setProfileUser(user);

      // Determine follow state if applicable
      if (currentUser && user.followers) {
        setIsFollowing(user.followers.some(f => f._id === currentUser.id));
      }

      // Load posts by default
      await loadPosts();
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await userAPI.getUserPosts(effectiveUserId);
      setPosts(response.posts);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  const loadFollowers = async () => {
    try {
      const response = await userAPI.getFollowers(effectiveUserId);
      setFollowers(response.followers);
    } catch (err) {
      console.error('Error loading followers:', err);
    }
  };

  const loadFollowing = async () => {
    try {
      const response = await userAPI.getFollowing(effectiveUserId);
      setFollowing(response.following);
    } catch (err) {
      console.error('Error loading following:', err);
    }
  };

  // ---------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (effectiveUserId) {
      loadProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveUserId]);

  // ---------------------------------------------------------------------
  // UI Handlers
  // ---------------------------------------------------------------------
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === 'followers' && followers.length === 0) {
      await loadFollowers();
    } else if (tab === 'following' && following.length === 0) {
      await loadFollowing();
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userAPI.unfollowUser(effectiveUserId);
        setIsFollowing(false);
        setProfileUser(prev => ({
          ...prev,
          followersCount: (prev.followersCount || 0) - 1,
          followers: prev.followers?.filter(f => f._id !== currentUser.id) || []
        }));
      } else {
        await userAPI.followUser(effectiveUserId);
        setIsFollowing(true);
        setProfileUser(prev => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1,
          followers: [...(prev.followers || []), { _id: currentUser.id }]
        }));
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await userAPI.updateUserProfile(effectiveUserId, updatedData);
      setProfileUser(response.user);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postAPI.deletePost(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
      setProfileUser(prev => ({
        ...prev,
        postCount: (prev.postCount || 0) - 1
      }));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  if (loading) {
    return (
      <div className="_main_layout">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p style={{ color: 'var(--color7)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="_main_layout">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p style={{ color: 'var(--color7)' }}>User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="_main_layout">
      <Navbar />
      <ThemeSwitcher />
      <div className="_layout_inner_wrap_area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ProfileHeader
                user={profileUser}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                onEditClick={() => setShowEditModal(true)}
                onFollowClick={handleFollow}
              />
              <ProfileStats
                postCount={profileUser.postCount || 0}
                followersCount={profileUser.followersCount || 0}
                followingCount={profileUser.followingCount || 0}
              />
              <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />
              <div className="_mar_t24">
                {activeTab === 'posts' && (
                  <div>
                    {posts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color7)' }}>No posts yet</div>
                    ) : (
                      posts.map(post => (
                        <Post key={post._id} post={post} onDelete={handleDeletePost} />
                      ))
                    )}
                  </div>
                )}
                {activeTab === 'followers' && <UserList users={followers} currentUserId={currentUser?.id} />}
                {activeTab === 'following' && <UserList users={following} currentUserId={currentUser?.id} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileNavigation />
      {showEditModal && (
        <EditProfileModal user={profileUser} onClose={() => setShowEditModal(false)} onSave={handleProfileUpdate} />
      )}
    </div>
  );
};

export default Profile;
