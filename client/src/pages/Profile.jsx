/* eslint-disable react-hooks/exhaustive-deps */
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
import { getSelectMenuClass, getSelectMenuTraining, isClassValid, isPasswordValid, isTrainingValid } from '../utils';
import DropdownMenu from '../components/Inputs/DropdownMenu';
import InputField from '../components/Inputs/InputField';
import MultiSelectDropdown from '../components/Inputs/MultiSelectDropdown';
import InputLabel from '../components/Inputs/InputLabel';

export default function Profile() {
  const toastId = React.useRef(null);

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [classOptions, setClassOptions] = useState([]);

  const { currentUser, loading } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }

    const fetchData = async () => {
      try {
        const response = await getSelectMenuClass(); // Use your actual fetching function
        setClassOptions(response);
      } catch (error) {
        console.error('Error fetching class options:', error);
      }
    };

    fetchData();
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
        console.log(error);
        toast.error('An error occurred while uploading the image');
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

  const handleClassChange = (selectedClass) => {
    setFormData({ ...formData, studentClass: selectedClass });
  };

  const handleTrainingChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    setFormData({ ...formData, training: selectedValues });
  };

  const handleChange = (e) => {
    const { id, value } = e.target

    if (id === 'studentClass') {
      handleClassChange(value);
    } else {
      setFormData({ ...formData, [id]: value });
    }
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

      //#region Verify password, class, training
      // Verify password security
      if (updatedUserData.password) {
        const _isPasswordValid = await isPasswordValid(updatedUserData.password);
        if (!_isPasswordValid.success) {
          const msg = `Failed to update profile: ${_isPasswordValid.message}`
          dispatch(updateUserFailure(msg));
          return toast.update(toastId.current, { type: 'error', autoClose: 5000, render: msg });
        }
      }

      // Verify class
      if (updatedUserData.studentClass) {
        const _isClassValid = await isClassValid(updatedUserData.studentClass);
        if (!_isClassValid.success) {
          const msg = `Failed to update profile: ${_isClassValid.message}`
          dispatch(updateUserFailure(msg));
          return toast.update(toastId.current, { type: 'error', autoClose: 5000, render: msg });
        }
      }

      // Verify training
      if (updatedUserData.training) {
        const _isTrainingValid = await isTrainingValid(updatedUserData.training);
        if (!_isTrainingValid.success) {
          const msg = `Failed to update profile: ${_isTrainingValid.message}`
          dispatch(updateUserFailure(msg));
          return toast.update(toastId.current, { type: 'error', autoClose: 5000, render: msg });
        }
      }
      //#endregion

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      const data = await res.json();
      if (data.success === false) {
        toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `Failed to update profile: ${data.message}` });
        dispatch(updateUserFailure(data));
        return;
      }

      toast.update(toastId.current, { type: 'success', autoClose: 5000, render: `Successfully updated profile` });
      dispatch(updateUserSuccess(data));
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
    }
  };

  const trainingOptions = getSelectMenuTraining();

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        /> */}
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
        {/* First and Last Name */}
        <div className="flex gap-4">
          <div className="flex-1">
            <InputLabel text="First Name" />
            <InputField
              defaultValue={formData.firstName || currentUser.firstName}
              type='text'
              id='firstName'
              placeholder='First Name'
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <InputLabel text="Last Name" />
            <InputField
              defaultValue={formData.lastName || currentUser.lastName}
              type='text'
              id='lastName'
              placeholder='Last Name'
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Experience */}
        <div className="flex gap-4">
          <div className="flex-1">
            <InputLabel text="Experience RTW /h" />
            <InputField
              defaultValue={formData.experienceRTW || currentUser.experience.RTW}
              type='number'
              id='experienceRTW'
              placeholder='Experience RTW /h'
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <InputLabel text="Experience FR /h" />
            <InputField
              defaultValue={formData.experienceFR || currentUser.experience.FR}
              type='number'
              id='experienceFR'
              placeholder='Experience First Responder /h'
              onChange={handleChange}
            />
          </div>
        </div>
        <DropdownMenu
          label={'Class'}
          selectedValue={formData.studentClass || currentUser.studentClass}
          onChange={handleChange}
          options={classOptions}
        />
        <MultiSelectDropdown
          label={'Training'}
          id='training'
          selectedValues={formData.training || currentUser.training} // Assuming it expects an array of strings
          onChange={handleTrainingChange}
          options={trainingOptions}
        />
        <InputField
          label={'Email'}
          defaultValue={formData.email || currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          onChange={handleChange}
        />
        <InputField
          label={'Password'}
          type='password'
          id='password'
          placeholder='Password'
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
    </div>
  );
}

