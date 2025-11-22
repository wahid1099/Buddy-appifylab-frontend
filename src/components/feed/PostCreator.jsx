import React, { useState } from 'react';
import { postAPI } from '../../services/api';

const PostCreator = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setImage(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write something');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('visibility', visibility);
      if (image) {
        formData.append('image', image);
      }

      await postAPI.createPost(formData);
      
      // Reset form
      setContent('');
      setImage(null);
      setVisibility('public');
      
      // Notify parent to refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img src="/images/txt_img.png" alt="Image" className="_txt_img" />
        </div>
        <div className="form-floating _feed_inner_text_area_box_form">
          <textarea 
            className="form-control _textarea" 
            placeholder="Write something ..." 
            id="floatingTextarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          ></textarea>
          <label className="_feed_textarea_label" htmlFor="floatingTextarea">
            Write something ...
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" fill="none" viewBox="0 0 23 24">
              <path fill="#666" d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z" />
            </svg>
          </label>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger _mar_t16" role="alert">
          {error}
        </div>
      )}

      {image && (
        <div className="_mar_t16">
          <div className="d-flex align-items-center justify-content-between p-2 border rounded">
            <span className="text-sm">{image.name}</span>
            <button 
              type="button" 
              className="btn btn-sm btn-danger"
              onClick={() => setImage(null)}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          <label htmlFor="imageUpload" className="_feed_inner_text_area_link" style={{ cursor: 'pointer' }}>
            <input 
              type="file" 
              id="imageUpload" 
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path fill="#666" d="M19.5 4h-15A2.5 2.5 0 002 6.5v11A2.5 2.5 0 004.5 20h15a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0019.5 4zm-15 1.5h15a1 1 0 011 1v8.586l-3.293-3.293a1 1 0 00-1.414 0l-3.586 3.586-1.293-1.293a1 1 0 00-1.414 0L5.5 17.086V6.5a1 1 0 011-1zM9 11a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            Photo
          </label>
        </div>
        <div className="_feed_inner_text_area_item">
          <select 
            className="form-select form-select-sm" 
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            disabled={loading}
            style={{ border: 'none', background: 'transparent', color: '#666' }}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="_feed_inner_text_area_item ms-auto">
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreator;
