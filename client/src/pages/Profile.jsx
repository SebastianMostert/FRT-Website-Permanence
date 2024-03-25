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
} from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import { getSelectMenuClass, isClassValid, isPasswordValid } from '../utils';
import { NotAuthorized } from './ErrorPages/Pages/401';
import { useTranslation } from 'react-i18next';
import { Button, Col, FloatingLabel, Row, Form, FormLabel } from 'react-bootstrap';

export default function Profile() {
  const { t } = useTranslation();
  const toastId = React.useRef(null);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [classOptions, setClassOptions] = useState([]);
  const [trainingFirstAidCourse, setTrainingFirstAidCourse] = useState(false);
  const [trainingSAP1, setTrainingSAP1] = useState(false);
  const [trainingSAP2, setTrainingSAP2] = useState(false);
  const { currentUser, loading } = useSelector((state) => state.user)

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const response = await getSelectMenuClass(); // Use your actual fetching function
          setClassOptions(response);

        } catch (error) {
          console.error(error);
        }
      };
      setTrainingFirstAidCourse(currentUser.firstAidCourse);
      setTrainingSAP1(currentUser.training?.includes('SAP 1'));
      setTrainingSAP2(currentUser.training?.includes('SAP 2'));
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!currentUser?.IAM) {
    return <NotAuthorized />
  }

  const handleClassChange = (selectedClass) => {
    try {
      console.log(selectedClass);
      setFormData({ ...formData, studentClass: selectedClass });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTrainingChange = (e) => {
    const { id, checked } = e.target;
    const trainings = [];

    if (id === 'trainingFirstAidCourse') {
      setTrainingFirstAidCourse(checked)

      if (trainingSAP1) trainings.push('SAP 1');
      if (trainingSAP2) trainings.push('SAP 2');

      setFormData({ ...formData, training: trainings, firstAidCourse: checked });
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
      console.log(error)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      { t('profile.update.loading') }
      toastId.current = toast.info(`${t('profile.update.loading')}`, { autoClose: false });
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
          const msg = `${t('profile.update.failed', { reason: _isPasswordValid.message })}`
          dispatch(updateUserFailure(msg));
          return toast.update(toastId.current, { type: 'error', autoClose: 5000, render: msg });
        }
      }

      // Verify class
      if (updatedUserData.studentClass) {
        const _isClassValid = await isClassValid(updatedUserData.studentClass);
        if (!_isClassValid.success) {
          const msg = `${t('profile.update.failed', { reason: _isClassValid.message })}`
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
        toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `${t('profile.update.failed', { reason: data.message })}` });
        dispatch(updateUserFailure(data));
        return;
      }

      toast.update(toastId.current, { type: 'success', autoClose: 5000, render: `${t('profile.update.success')}` });
      dispatch(updateUserSuccess(data));
    } catch (error) {
      toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `${t('profile.update.failed', { reason: error.message })}` });
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
      await fetch('/api/v1/auth/signout');
      dispatch(signOut())
      toast.info(`${t('profile.signed.out')}`);
    } catch (error) {
      toast.info(`${t('profile.signed.error')}`);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>{t('profile.title')}</h1>
      <Form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div id='Names'>
          <Row>
            <Col>
              <Form.Group controlId='firstName'>
                <FloatingLabel
                  label={t('profile.first.name')}
                  className="mb-3"
                >
                  <Form.Control
                    type='text'
                    defaultValue={formData.firstName || currentUser.firstName}
                    placeholder={t('profile.first.name')}
                    onChange={handleChange}
                    id='firstName'
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='lastName'>
                <FloatingLabel
                  label={t('profile.last.name')}
                  className="mb-3"
                >
                  <Form.Control
                    type='text'
                    defaultValue={formData.lastName || currentUser.lastName}
                    placeholder={t('profile.last.name')}
                    onChange={handleChange}
                    id='lastName'
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>
        </div>
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

        <Form.Group controlId='studentClass'>
          <FloatingLabel
            label={t('profile.dropdown.class.label')}
            className="mb-3"
          >
            <Form.Select id='studentClass' onChange={handleChange} value={formData.studentClass || currentUser.studentClass}>
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId='training'>
          <FormLabel className="mb-3 text-lg">
            {t('profile.multi.dropdown.training.label')}
          </FormLabel>
          <Form.Check
            checked={trainingFirstAidCourse}
            label="First Aid Course"
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
        <Form.Group controlId='email'>
          <FloatingLabel
            label={t('profile.email')}
            className="mb-3"
          >
            <Form.Control
              type='email'
              defaultValue={formData.email || currentUser.email}
              placeholder={t('profile.email')}
              onChange={handleChange}
              id='email'
            />
          </FloatingLabel>
        </Form.Group>
        <Button
          variant='primary'
          type='submit'
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? `${t('submit.btn.loading')}` : `${t('submit.btn.update')}`}
        </Button>
      </Form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          {t('profile.delete.account')}
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          {t('profile.sign.out')}
        </span>
      </div>
    </div>
  );
}