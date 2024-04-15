import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
import { getSelectMenuClass } from '../../utils';
import { useTranslation } from 'react-i18next';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [allRoles, setAllRoles] = useState(['admin', 'user', 'public']);
  const [classOptions, setClassOptions] = useState([]); // Define classOptions state
  const { t } = useTranslation();

  // Placeholder for classOptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSelectMenuClass(t); // Use your actual fetching function
        setClassOptions(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [t]);

  // Fetch users data from API
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
      const data = await response.json();
      console.log(data);
      // Refresh users after update
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect to fetch users on component mount
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

  const handleSaveEdit = () => {
    // Update user data here
    if (editedUser) {
      updateUser(editedUser._id, editedUser);
      setShowEditModal(false);
      setEditedUser(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: '50px', // Adjust the height as needed
    }),
  };

  const handleRowDoubleClick = (user) => {
    handleEditUser(user);
  };

  return (
    <div>
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>IAM</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Student Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              onDoubleClick={() => handleRowDoubleClick(user)}
              style={{ cursor: 'pointer' }}
            >
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.IAM}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(', ')}</td>
              <td>{user.studentClass}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditUser(user)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedUser && (
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formIAM">
                <Form.Label>IAM</Form.Label>
                <Form.Control
                  type="text"
                  name="IAM"
                  value={editedUser.IAM}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formRoles">
                <Form.Label>Roles</Form.Label>
                <Select
                  options={allRoles.map((role) => ({ value: role, label: role }))}
                  value={editedUser.roles.map((role) => ({ value: role, label: role }))}
                  isMulti
                  onChange={handleRoleChange}
                />
              </Form.Group>
              <Form.Group controlId="formStudentClass">
                <Form.Label>Student Class</Form.Label>
                <Select
                  options={classOptions}
                  value={classOptions.find((option) => option.value === editedUser.studentClass)}
                  onChange={handleClassChange}
                  isClearable
                  styles={customStyles}
                  required
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
