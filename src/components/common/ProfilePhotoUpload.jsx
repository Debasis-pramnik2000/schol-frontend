import React, { useState, useRef } from 'react';
import { Button, Spinner, Alert, Image } from 'react-bootstrap';
import { FaCamera, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ProfilePhotoUpload = ({ currentPhoto, onPhotoUpdate, userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const response = await api.post('/api/auth/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Profile photo updated successfully!');
        setPreview(null);
        if (onPhotoUpdate) {
          onPhotoUpdate(response.data.data.profilePicture);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload photo');
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.delete('/api/auth/remove-photo');
      if (response.data.success) {
        toast.success('Profile photo removed successfully');
        if (onPhotoUpdate) {
          onPhotoUpdate(null);
        }
      }
    } catch (error) {
      console.error('Remove error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove photo');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-photo-upload text-center">
      <div className="photo-container mb-3">
        <Image
          src={preview || currentPhoto || 'https://via.placeholder.com/150'}
          roundedCircle
          className="profile-photo"
          width={150}
          height={150}
          style={{ objectFit: 'cover' }}
        />
        {loading && (
          <div className="photo-loading">
            <Spinner animation="border" variant="light" />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
        style={{ display: 'none' }}
      />

      <div className="d-flex gap-2 justify-content-center flex-wrap">
        <Button
          variant="primary"
          onClick={triggerFileInput}
          disabled={loading}
        >
          <FaCamera className="me-2" />
          {loading ? 'Uploading...' : 'Change Photo'}
        </Button>

        {currentPhoto && (
          <Button
            variant="danger"
            onClick={handleRemovePhoto}
            disabled={loading}
          >
            <FaTrash className="me-2" />
            Remove
          </Button>
        )}
      </div>

      <small className="text-muted d-block mt-2">
        Supported formats: JPEG, PNG, GIF, WEBP (Max 5MB)
      </small>
    </div>
  );
};

export default ProfilePhotoUpload;