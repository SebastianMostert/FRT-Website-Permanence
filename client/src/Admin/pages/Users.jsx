import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { getSelectMenuClass } from '../../utils';
import { useTranslation } from 'react-i18next';
import { useApiClient } from '../../ApiContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // State for delete confirmation
  // eslint-disable-next-line no-unused-vars
  const [allRoles, setAllRoles] = useState(['admin', 'member', 'public', 'loge']);
  const [classOptions, setClassOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [classesAPI, setClassesAPI] = useState(null);

  const { t } = useTranslation();
  const apiClient = useApiClient();

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  useEffect(() => {
    async function fetchData() {
      const classes = await apiClient.exam.getClasses();
      console.log(classes)
      setClassesAPI(classes);
    }

    fetchData();
  }, [apiClient.exam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSelectMenuClass(t, classesAPI);
        setClassOptions(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [classesAPI, t]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/v1/user/fetch-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async (userId, updatedUserData) => {
    try {
      const response = await fetch(`/api/v1/user/update/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      await response.json();
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/v1/user/delete/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      fetchUsers();
      setDeleteConfirmation(false); // Close the confirmation modal after deletion
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditedUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedUser(null);
  };

  const handleDeleteConfirmation = (userId) => {
    if (editedUser) {
      alert('Are you sure you want to delete this user?');

      // Perform the delete operation
      deleteUser(userId);

      // Close the modal
      setDeleteConfirmation(false);
    }
  };

  const handleConfirmDelete = () => {
    if (editedUser) {
      deleteUser(editedUser);
    }
  };

  const handleSaveEdit = () => {
    if (editedUser) {
      updateUser(editedUser._id, editedUser);
      setShowEditModal(false);
      setEditedUser(null);
    }
  };


  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'verified') {
      setEditedUser({
        ...editedUser,
        verified: checked,
      });
    } else {
      setEditedUser({
        ...editedUser,
        [name]: value,
      });
    }
  };

  const handleRoleChange = (selectedOptions) => {
    const roles = selectedOptions.map((option) => option.value);
    setEditedUser({
      ...editedUser,
      roles,
    });
  };

  const handleClassChange = (selectedOption) => {
    setEditedUser({
      ...editedUser,
      studentClass: selectedOption ? selectedOption.value : null,
    });
  };

  const handleVerification = (userId) => {
    const userToUpdate = users.find((user) => user._id === userId);
    if (!userToUpdate) {
      console.error("User not found");
      return;
    }

    const updatedUserData = {
      ...userToUpdate,
      verified: !userToUpdate.verified, // Toggle verification status
    };
    updateUser(userId, updatedUserData);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: '50px',
    }),
  };

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to dynamically sort users based on current sortConfig
  const sortedUsers = users.sort((a, b) => {
    if (sortConfig.key && a[sortConfig.key] && b[sortConfig.key]) {
      if (sortConfig.direction === 'ascending') {
        return a[sortConfig.key].toString().localeCompare(b[sortConfig.key].toString());
      }
      if (sortConfig.direction === 'descending') {
        return b[sortConfig.key].toString().localeCompare(a[sortConfig.key].toString());
      }
    }
    return 0;
  });

  // Filter users based on search term
  const filteredUsers = sortedUsers.filter((user) => {
    const fullNameFirstName = `${user.firstName} ${user.lastName}`;
    const fullNameLastName = `${user.lastName} ${user.firstName}`;
    const fullNameEmail = `${user.email}`;


    return fullNameFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullNameLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullNameEmail.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className='users-container select-none'>
      <h2>{t('Users')}</h2>
      <FormControl
        type="text"
        placeholder={t('Search by name or email')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='search-input'
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => requestSort('firstName')}>
              {t('First Name')}{' '}
              {sortConfig.key === 'firstName' && (
                <>
                  {sortConfig.direction === 'ascending' ? (
                    <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
                  )}
                </>
              )}
            </th>
            <th onClick={() => requestSort('lastName')}>
              {t('Last Name')}{' '}
              {sortConfig.key === 'lastName' && (
                <>
                  {sortConfig.direction === 'ascending' ? (
                    <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
                  )}
                </>
              )}
            </th>
            <th onClick={() => requestSort('IAM')}>
              {t('IAM')}{' '}
              {sortConfig.key === 'IAM' && (
                <>
                  {sortConfig.direction === 'ascending' ? (
                    <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
                  )}
                </>
              )}
            </th>
            <th onClick={() => requestSort('email')}>
              {t('Email')}{' '}
              {sortConfig.key === 'email' && (
                <>
                  {sortConfig.direction === 'ascending' ? (
                    <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
                  )}
                </>
              )}
            </th>
            <th onClick={() => requestSort('roles')}>
              {t('Roles')}{' '}
              {sortConfig.key === 'roles' && (
                <>
                  {sortConfig.direction === 'ascending' ? (
                    <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
                  )}
                </>
              )}
            </th>
            <th onClick={() => requestSort('studentClass')}>
              {t('Student Class')}{' '}
              {sortConfig.key === 'studentClass' && (
                <>
                  {sortConfig.direction === 'ascending' ? (
                    <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
                  )}
                </>
              )}
            </th>
            <th onClick={() => requestSort('verified')}>
              {t('Verified')}{' '}
              {sortConfig.key === 'verified' && (
                <>
                  {sortConfig.direction === 'ascending' ? (
                    <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
                  )}
                </>
              )}
            </th>
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user._id}
              onDoubleClick={() => handleEditUser(user)}
              className='user-row'
            >
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.IAM}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(', ')}</td>
              <td>{user.studentClass}</td>
              <td>{user.verified ? t('Yes') : t('No')}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditUser(user)}>
                  {t('Edit')}
                </Button>
                <Button
                  variant={user.verified ? "danger" : "success"}
                  onClick={() => handleVerification(user._id)}
                  style={{ marginLeft: '10px' }}
                >
                  {user.verified ? t('Unverify') : t('Verify')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Edit User')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedUser && (
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>{t('First Name')}</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>{t('Last Name')}</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formIAM">
                <Form.Label>{t('IAM')}</Form.Label>
                <Form.Control
                  type="text"
                  name="IAM"
                  value={editedUser.IAM}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>{t('Email')}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formRoles">
                <Form.Label>{t('Roles')}</Form.Label>
                <Select
                  options={allRoles.map((role) => ({ value: role, label: role }))}
                  value={editedUser.roles.map((role) => ({ value: role, label: role }))}
                  isMulti
                  onChange={handleRoleChange}
                />
              </Form.Group>
              <Form.Group controlId="formStudentClass">
                <Form.Label>{t('Student Class')}</Form.Label>
                <Select
                  options={classOptions}
                  value={classOptions.find((option) => option.value === editedUser.studentClass)}
                  onChange={handleClassChange}
                  isClearable
                  styles={customStyles}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formVerified">
                <Form.Check
                  type="checkbox"
                  label={t('Verified')}
                  name="verified"
                  checked={editedUser.verified}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            {t('Close')}
          </Button>
          <Button variant="danger" onClick={() => handleDeleteConfirmation(editedUser._id)}>
            {t('Delete')}
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            {t('Save Changes')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteConfirmation} onHide={() => setDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Confirm Deletion')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('Are you sure you want to delete this user?')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirmation(false)}>
            {t('Cancel')}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {t('Delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

};

export default Users;