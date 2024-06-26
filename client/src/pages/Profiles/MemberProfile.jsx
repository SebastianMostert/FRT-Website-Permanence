/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
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
import { Button, Col, FloatingLabel, Row, Form, FormLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NotAuthorized } from '../index';
import FullNameInput from '../../components/Inputs/FullName';
import { useApiClient } from '../../contexts/ApiContext';

export default function Profile() {
    const { t } = useTranslation();
    const toastId = React.useRef(null);

    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const [trainingFirstAidCourse, setTrainingFirstAidCourse] = useState(false);
    const [trainingSAP1, setTrainingSAP1] = useState(false);
    const [trainingSAP2, setTrainingSAP2] = useState(false);
    const [classesAPI, setClassesAPI] = useState(null);

    const { currentUser, loading } = useSelector((state) => state.user)
    const apiClient = useApiClient();

    useEffect(() => {
        async function fetchData() {
            const classes = await apiClient.exam.getClasses();
            setClassesAPI(classes);
        }

        fetchData();
    }, [apiClient.exam]);

    useEffect(() => {
        try {
            setTrainingFirstAidCourse(currentUser.training?.includes('First Aid Course'));
            setTrainingSAP1(currentUser.training?.includes('SAP 1'));
            setTrainingSAP2(currentUser.training?.includes('SAP 2'));

            setFormData({
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
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

    const handleTrainingChange = (e) => {
        const { id, checked } = e.target;
        const trainings = [];

        if (id === 'trainingFirstAidCourse') {
            setTrainingFirstAidCourse(checked)

            if (trainingSAP1) trainings.push('SAP 1');
            if (trainingSAP2) trainings.push('SAP 2');
            if (checked) trainings.push('First Aid Course');

            setFormData({ ...formData, training: trainings });
        } else if (id === 'trainingSAP1') {
            setTrainingSAP1(checked)

            if (checked) trainings.push('SAP 1');
            if (trainingSAP2) trainings.push('SAP 2');

            setFormData({ ...formData, training: trainings });
        } else if (id === 'trainingSAP2') {
            setTrainingSAP2(checked)

            if (trainingSAP1) trainings.push('SAP 1');
            if (checked) trainings.push('SAP 2');

            setFormData({ ...formData, training: trainings });
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
                const _isClassValid = await isClassValid(updatedUserData.studentClass, t, classesAPI);
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
            await apiClient.auth.signout();
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
                <div id='Experience'>
                    <Row>
                        <Col>
                            <Form.Group controlId='experienceRTW'>
                                <FloatingLabel
                                    label={t('profile.experience.rtw')}
                                    className="mb-3"
                                >
                                    <Form.Control
                                        type='number'
                                        defaultValue={formData.experienceRTW || currentUser.experience.RTW}
                                        placeholder={t('profile.experience.rtw')}
                                        onChange={handleChange}
                                        id='experienceRTW'

                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='experienceFR'>
                                <FloatingLabel
                                    label={t('profile.experience.fr')}
                                    className="mb-3"
                                >
                                    <Form.Control
                                        type='number'
                                        defaultValue={formData.experienceFR || currentUser.experience.FR}
                                        placeholder={t('profile.experience.fr')}
                                        onChange={handleChange}
                                        id='experienceFR'

                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                </div>

                <Form.Group controlId='training'>
                    <FormLabel className="mb-3 text-lg">
                        {t('profile.training.label')}
                    </FormLabel>
                    <Form.Check
                        checked={trainingFirstAidCourse}
                        label={t('profile.training.first_aid_course')}
                        type='checkbox'
                        name='group1'
                        id={`trainingFirstAidCourse`}
                        onChange={handleTrainingChange}
                    />
                    <Form.Check
                        checked={trainingSAP1}
                        label="SAP 1"
                        type='checkbox'
                        name='group1'
                        id={`trainingSAP1`}
                        onChange={handleTrainingChange}
                    />
                    <Form.Check
                        checked={trainingSAP2}
                        label="SAP 2"
                        type='checkbox'
                        name='group2'
                        id={`trainingSAP2`}
                        onChange={handleTrainingChange}
                    />
                </Form.Group>
                <Button
                    variant='primary'
                    type='submit'
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? `${t('button.loading')}` : `${t('button.update')}`}
                </Button>
            </Form>


            <Link to="/2fa" className="d-block text-center">
                <Button variant="outline-primary" className="w-100 mt-3">
                    {t('profile.manage_2fa')}
                </Button>
            </Link>
            <Link to="/sessions" className="d-block text-center">
                <Button variant="outline-primary" className="w-100 mt-3">
                    {t('profile.manage_sessions')}
                </Button>
            </Link>

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