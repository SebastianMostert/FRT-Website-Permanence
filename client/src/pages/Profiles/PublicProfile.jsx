/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOut,
} from '../../redux/user/userSlice';
import { toast } from 'react-toastify';
import { isClassValid, isPasswordValid } from '../../utils';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { NotAuthorized } from '../index';
import FullNameInput from '../../components/Inputs/FullName';

const defaultValue = {
    firstName: '',
    lastName: '',
};

export default function Profile() {
    const { t } = useTranslation();
    const toastId = React.useRef(null);

    const dispatch = useDispatch();
    const [formData, setFormData] = useState(defaultValue);
    const { currentUser, loading } = useSelector((state) => state.user)

    // Set the initial values
    useEffect(() => {
        try {
            setFormData({
                firstName: currentUser?.firstName || '',
                lastName: currentUser?.lastName || '',
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    if (!currentUser?.IAM) {
        return <NotAuthorized />
    }

    const handleClassChange = (selectedClass) => {
        try {
            setFormData({ ...formData, studentClass: selectedClass });
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        try {
            const { id, value } = e.target

            if (id === 'studentClass') {
                handleClassChange(value);
            } else {
                setFormData({ ...formData, [id]: value });
            }
        } catch (error) {
            console.error(error)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            toastId.current = toast.info(`${t('toast.profile.update.loading')}`, { autoClose: false });
            dispatch(updateUserStart());

            const updatedUserData = {
                ...currentUser,  // Keep existing user data
                ...formData,    // Include the changed fields
            };

            //#region Verify password, class, training
            // Verify password security
            if (updatedUserData.password) {
                const _isPasswordValid = await isPasswordValid(updatedUserData.password, t);
                if (!_isPasswordValid.success) {
                    const msg = `${t('toast.profile.update.failed', { reason: _isPasswordValid.message })}`
                    dispatch(updateUserFailure(msg));
                    return toast.update(toastId.current, { type: 'error', autoClose: 5000, render: msg });
                }
            }

            // Verify class
            if (updatedUserData.studentClass) {
                const _isClassValid = await isClassValid(updatedUserData.studentClass, t);
                if (!_isClassValid.success) {
                    const msg = `${t('toast.profile.update.failed', { reason: _isClassValid.message })}`
                    dispatch(updateUserFailure(msg));
                    return toast.update(toastId.current, { type: 'error', autoClose: 5000, render: msg });
                }
            }
            //#endregion

            const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            const data = await res.json();
            if (data.success === false) {
                toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `${t('toast.profile.update.failed', { reason: data.message })}` });
                dispatch(updateUserFailure(data));
                return;
            }

            toast.update(toastId.current, { type: 'success', autoClose: 5000, render: `${t('toast.profile.update.success')}` });
            dispatch(updateUserSuccess(data));
        } catch (error) {
            toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `${t('toast.profile.update.failed', { reason: error.message })}` });
            dispatch(updateUserFailure(error));
        }
    };

    const handleDeleteAccount = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/v1/user/delete/${currentUser._id}`, {
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
            await fetch('/api/v1/auth/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            dispatch(signOut())
            toast.info(`${t('toast.profile.signed_out')}`);
        } catch (error) {
            toast.info(`${t('toast.profile.signed_out.error')}`);
        }
    };


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>{t('profile.title')}</h1>
            <Form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <FullNameInput formData={formData} handleChange={handleChange} />
                <Button
                    variant='primary'
                    type='submit'
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? `${t('button.loading')}` : `${t('button.update')}`}
                </Button>
            </Form>

            <div className='flex justify-between mt-5'>
                <span
                    onClick={handleDeleteAccount}
                    className='text-red-700 cursor-pointer'
                >
                    {t('profile.delete')}
                </span>
                <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
                    {t('profile.sign_out')}
                </span>
            </div>
        </div>
    );
}