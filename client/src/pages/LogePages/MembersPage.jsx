/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useApiClient } from '../../contexts/ApiContext';
import { Container, Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faWalkieTalkie } from '@fortawesome/free-solid-svg-icons';

const MAX_KEYS = 3;
const MAX_PHONES = 3;

const MembersPage = () => {
  const [users, setUsers] = useState([]);
  const [usersOnCall, setUsersOnCall] = useState([]);
  const [keysContainer, setKeysContainer] = useState(0);
  const [phonesContainer, setPhonesContainer] = useState(0);
  const apiClient = useApiClient();

  const socket = useWebSocket();

  const fetchTeams = async () => {
    try {
      // Make a post request to the API
      const res = await fetch('/api/v1/team/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Get the data from the response
      const teams = await res.json();
      const users = [];

      for (const team of teams) {
        if (team.members.length > 0) {
          for (const member of team.members) {
            users.push(member.IAM);
          }
        }
      }

      setUsersOnCall(users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all the users
        const fetchedUsers = await apiClient.user.get();
        setUsers(fetchedUsers);

        // Get the all teams
        fetchTeams();

        // Calculate the initial distribution of keys and phones
        const keysInUse = fetchedUsers.reduce((total, user) => (user.hasKey ? total + 1 : total), 0);
        const phonesInUse = fetchedUsers.reduce((total, user) => (user.hasPhone ? total + 1 : total), 0);

        setKeysContainer(MAX_KEYS - keysInUse);
        setPhonesContainer(MAX_PHONES - phonesInUse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [apiClient.user]);


  // Fetch data on component mount and start polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await apiClient.user.get();
        setUsers(fetchedUsers);

        // Calculate the initial distribution of keys and phones
        const keysInUse = fetchedUsers.reduce((total, user) => (user.hasKey ? total + 1 : total), 0);
        const phonesInUse = fetchedUsers.reduce((total, user) => (user.hasPhone ? total + 1 : total), 0);

        setKeysContainer(MAX_KEYS - keysInUse);
        setPhonesContainer(MAX_PHONES - phonesInUse);
      } catch (error) {
        console.error(error);
      }
    };

    if (socket?.readyState !== 1) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'user') {
        console.log('Updating data');
        fetchData();
      }

      if (data.type === 'team') {
        console.log('Updating data');
        fetchTeams();
      }
    }
  }, [apiClient.user, socket]);

  const handleDropKey = (userIndex) => {
    if (keysContainer > 0 && !users[userIndex].hasKey) {
      setKeysContainer(keysContainer - 1);
      updateUserKey(true, users[userIndex]._id);
    }
  };

  const handleDropPhone = (userIndex) => {
    if (phonesContainer > 0 && !users[userIndex].hasPhone) {
      setPhonesContainer(phonesContainer - 1);
      updateUserPhone(true, users[userIndex]._id);
    }
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.setData('type', type);
  };

  const handleUserDropKey = (userIndex) => {
    // Only add to keys container if the user had a key initially
    if (users[userIndex].hasKey) {
      setKeysContainer(keysContainer + 1);
    }
    updateUserKey(false, users[userIndex]._id);
  };

  const handleUserDropPhone = (userIndex) => {
    // Only add to phones container if the user had a phone initially
    if (users[userIndex].hasPhone) {
      setPhonesContainer(phonesContainer + 1);
    }
    updateUserPhone(false, users[userIndex]._id);
  };


  const updateUserPhone = async (hasPhone, id) => {
    try {
      await apiClient.user.update({ id, hasPhone });
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserKey = async (hasKey, id) => {
    try {
      await apiClient.user.update({ id, hasKey });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className='select-none'>
      <h1 className="mt-4">Members Page</h1>
      <Row className="mt-4">
        <Col md={2}>
          <DragNDropContainers
            keysContainer={keysContainer}
            phonesContainer={phonesContainer}
            handleDragStart={handleDragStart}
          />
        </Col>
        <Col md={10}>
          <Row className="mt-4">
            {users.map((user, index) => (
              <UserCard
                key={user._id}
                handleDragStart={handleDragStart}
                handleDropKey={handleDropKey}
                handleDropPhone={handleDropPhone}
                handleUserDropKey={handleUserDropKey}
                handleUserDropPhone={handleUserDropPhone}
                user={user}
                onCallUsers={usersOnCall}
                index={index}
              />
            ))}
          </Row>
        </Col>
      </Row>
    </Container>

  );
};

const DragNDropContainers = ({ keysContainer, phonesContainer, handleDragStart }) => {
  const width = 'calc(50% - 10px)';
  const margin = '5px';

  const usedKeys = MAX_KEYS - keysContainer;
  const usedPhones = MAX_PHONES - phonesContainer;

  return (
    <div>
      <h3>Phones & Keys</h3>
      <div style={{ display: 'inline-block', width, marginRight: margin }}>
        <Card>
          <Card.Body style={{ display: 'flex', flexWrap: 'wrap' }}>
            {Array.from({ length: keysContainer }).map((_, index) => (
              <div key={`key-${index}`} draggable onDragStart={(e) => handleDragStart(e, 'key')} id={`key-${index}`} style={{ marginRight: '10px', marginBottom: '10px' }}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Drag Key</Tooltip>}
                >
                  <InventorySlot
                    hasItem={true}
                    icon={faKey}
                    handleDrop={() => { }}
                    index={index}
                    handleUserDragOver={() => { }}
                    type="key"
                    handleDragStart={() => { }}
                    handleUserDrop={() => { }}
                  />
                </OverlayTrigger>
              </div>
            ))}
            {/* Empty inventory for used keys */}
            {Array.from({ length: usedKeys }).map((_, index) => (
              <div key={`key-${index}`} style={{ marginRight: '10px', marginBottom: '10px' }}>
                <InventorySlot
                  hasItem={false}
                  icon={faKey}
                  handleDrop={() => { }}
                  index={index}
                  handleUserDragOver={() => { }}
                  type="key"
                  handleDragStart={() => { }}
                  handleUserDrop={() => { }}
                />
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
      <div style={{ display: 'inline-block', width, marginLeft: margin }}>
        <Card>
          <Card.Body style={{ display: 'flex', flexWrap: 'wrap' }}>
            {Array.from({ length: phonesContainer }).map((_, index) => (
              <div key={`phone-${index}`} draggable onDragStart={(e) => handleDragStart(e, 'phone')} id={`phone-${index}`} style={{ marginRight: '10px', marginBottom: '10px' }}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Drag Phone</Tooltip>}
                >
                  <InventorySlot
                    hasItem={true}
                    icon={faWalkieTalkie}
                    handleDrop={() => { }}
                    index={index}
                    handleUserDragOver={() => { }}
                    type="phone"
                    handleDragStart={() => { }}
                    handleUserDrop={() => { }}
                  />
                </OverlayTrigger>
              </div>
            ))}
            {/* Empty inventory for used phones */}
            {Array.from({ length: usedPhones }).map((_, index) => (
              <div key={`phone-${index}`} style={{ marginRight: '10px', marginBottom: '10px' }}>
                <InventorySlot
                  hasItem={false}
                  icon={faWalkieTalkie}
                  handleDrop={() => { }}
                  index={index}
                  handleUserDragOver={() => { }}
                  type="phone"
                  handleDragStart={() => { }}
                  handleUserDrop={() => { }}
                />
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

const UserCard = ({ user, index, handleDropKey, handleDropPhone, handleDragStart, handleUserDropKey, handleUserDropPhone, onCallUsers }) => {
  const handleUserDragOver = (e) => {
    e.preventDefault();
  };

  const {
    firstName,
    lastName,
    IAM,
    studentClass,
    hasKey,
    hasPhone,
  } = user;

  // Check if the current user is on call
  const onCall = onCallUsers.includes(IAM);

  const footer = (
    <Card.Footer style={{ display: 'flex', justifyContent: 'center' }}>
      <InventorySlot
        hasItem={hasKey}
        icon={faKey}
        handleDrop={handleDropKey}
        index={index}
        handleUserDragOver={handleUserDragOver}
        type="key"
        handleDragStart={handleDragStart}
        handleUserDrop={handleUserDropKey}
      />
      <div className='m-1'></div>
      <InventorySlot
        hasItem={hasPhone}
        icon={faWalkieTalkie}
        handleDrop={handleDropPhone}
        index={index}
        handleUserDragOver={handleUserDragOver}
        type="phone"
        handleDragStart={handleDragStart}
        handleUserDrop={handleUserDropPhone}
      />
    </Card.Footer>
  )

  return (
    <Col md={4}>
      <Card className={`mb-4 ${onCall ? 'border-danger' : ''}`} style={{ borderWidth: '2px' }}>
        <Card.Body>
          <Card.Title>{firstName[0].toUpperCase()}. {lastName}</Card.Title>
          <Card.Text className="text-sm text-muted">{IAM} - {studentClass}</Card.Text>
        </Card.Body>
        {footer}
      </Card>
    </Col>
  );
}

const InventorySlot = ({ hasItem, icon, handleDrop, index, handleUserDragOver, type, handleDragStart, handleUserDrop }) => {
  return (
    <div style={{
      width: '50px',
      height: '50px',
      backgroundColor: 'lightgray',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
    }}
      onDrop={(e) => e.dataTransfer.getData('type') == type ? handleDrop(index) : null}
      onDragOver={handleUserDragOver}

      onDragStart={(e) => handleDragStart(e, type)}
      onDragEnd={() => handleUserDrop(index)}
      draggable={hasItem}>
      {hasItem ?
        <FontAwesomeIcon icon={icon} size="2x" /> :
        <FontAwesomeIcon icon={icon} size="2x" style={{ color: 'rgba(128, 128, 128, 0.5)' }} />}
    </div>
  );
};

export default MembersPage;