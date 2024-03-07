import { useSelector } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import { toast } from 'react-toastify';

export default function Profile() {
  const toastId = React.useRef(null);

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        toast.error('An error occurred while uploading the image');
        console.log(error);
        setImageError(true);
      },
      () => {
        toast.success('Image uploaded successfully!');
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toastId.current = toast.info("Updating profile...", { autoClose: false });
      dispatch(updateUserStart());

      const updatedUserData = {
        ...currentUser,  // Keep existing user data
        ...formData,    // Include the changed fields
      };

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `Failed to update profile: ${data.message}` });
        dispatch(updateUserFailure(data));
        return;
      }

      toast.update(toastId.current, { type: 'success', autoClose: 5000, render: `Successfully updated profile` });
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `Failed to update profile: ${error.message}` });
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
      toast.info("Signed out");
    } catch (error) {
      toast.info("Error signing out");
      console.log(error);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        {/* 
      firebase storage rules:  
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */}
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
        {/* First Name */}
        <input
          defaultValue={currentUser.firstName}
          type='text'
          id='firstName'
          placeholder='First Name'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {/* Last Name */}
        <input
          defaultValue={currentUser.lastName}
          type='text'
          id='lastName'
          placeholder='Last Name'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {/* Experience RTW /h */}
        <input
          defaultValue={currentUser.experience.RTW}
          type='number'
          id='experienceRTW'
          placeholder='Experience RTW /h'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {/* Experience FR /h */}
        <input
          defaultValue={currentUser.experience.FR}
          type='number'
          id='experienceFR'
          placeholder='Experience First Responder /h'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {/* Class */}
        <input
          defaultValue={currentUser.studentClass}
          type='text'
          id='studentClass'
          placeholder='Class (S5DE1)'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {/* Training */}
        <input
          defaultValue={currentUser.training}
          type='text'
          id='training'
          placeholder='Training sperated by commas (SAP 1, SAP 2)'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {/* Email */}
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {/* Password */}
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p>
    </div>
  );
}
