// import { useState, useEffect } from 'react';
// import { Button, Modal } from 'react-bootstrap';
// import { getSelectMenuClass } from '../../utils';
// import { useTranslation } from 'react-i18next';
// import { useApiClient } from '../../ApiContext';
// import { DataGrid } from '@mui/x-data-grid';
// import { toast } from 'react-toastify';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [editedUser, setEditedUser] = useState(null);
//   const [deleteConfirmation, setDeleteConfirmation] = useState(false); // State for delete confirmation
//   const [classOptions, setClassOptions] = useState([]);
//   const [classesAPI, setClassesAPI] = useState(null);

//   const { t } = useTranslation();
//   const apiClient = useApiClient();

//   useEffect(() => {
//     async function fetchData() {
//       const classes = await apiClient.exam.getClasses();
//       console.log(classes)
//       setClassesAPI(classes);
//     }

//     fetchData();
//   }, [apiClient.exam]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getSelectMenuClass(t, classesAPI);
//         setClassOptions(response);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchData();
//   }, [classesAPI, t]);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('/api/v1/user/fetch-all', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch users');
//       }
//       const users = await response.json();
//       setUsers(users);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const deleteUser = async (userId) => {
//     try {
//       const response = await fetch(`/api/v1/user/delete/${userId}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to delete user');
//       }
//       fetchUsers();
//       setDeleteConfirmation(false); // Close the confirmation modal after deletion
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);


//   const handleConfirmDelete = () => {
//     if (editedUser) {
//       deleteUser(editedUser);
//     }
//   };

//   const rows = [];
//   const columns = [
//     { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
//     { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
//     { field: 'email', headerName: 'Email', width: 150, editable: true },
//     { field: 'operationalPosition', headerName: 'Operational Position', width: 150, editable: true },
//     { field: 'training', headerName: 'Training', width: 150, editable: true },
//     { field: 'experienceRTW', headerName: 'RTW Experience', width: 150, editable: true },
//     { field: 'experienceFR', headerName: 'FR Experience', width: 150, editable: true },
//   ];

//   // Get the data from sortedUsers and push it to rows
//   users.forEach((user) => {
//     rows.push({
//       id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       operationalPosition: user.operationalPosition,
//       training: user.training.join(', '),
//       experienceRTW: user.experience.RTW,
//       experienceFR: user.experience.FR,
//     });
//   });

//   const onEditStop = async (params, event) => {
//     console.log(event);

//     //  Params:
//     //   {
//     //     "id": "661c2e1bad02f80a0e0aff5f",
//     //     "field": "firstName",
//     //     "row": {
//     //         "id": "661c2e1bad02f80a0e0aff5f",
//     //         "firstName": "Pol",
//     //         "lastName": "Nilles",
//     //         "email": "nillespol@icloud.com",
//     //         "operationalPosition": "Chef Agres",
//     //         "training": "SAP 1, First Aid Course",
//     //         "experienceRTW": 300,
//     //         "experienceFR": 0
//     //     },
//     //     "rowNode": {
//     //         "id": "661c2e1bad02f80a0e0aff5f",
//     //         "depth": 0,
//     //         "parent": "auto-generated-group-node-root",
//     //         "type": "leaf",
//     //         "groupingKey": null
//     //     },
//     //     "colDef": {
//     //         "width": 150,
//     //         "minWidth": 50,
//     //         "maxWidth": null,
//     //         "hideable": true,
//     //         "sortable": true,
//     //         "resizable": true,
//     //         "filterable": true,
//     //         "groupable": true,
//     //         "pinnable": true,
//     //         "aggregable": true,
//     //         "editable": true,
//     //         "type": "string",
//     //         "align": "left",
//     //         "filterOperators": [
//     //             {
//     //                 "value": "contains"
//     //             },
//     //             {
//     //                 "value": "equals"
//     //             },
//     //             {
//     //                 "value": "startsWith"
//     //             },
//     //             {
//     //                 "value": "endsWith"
//     //             },
//     //             {
//     //                 "value": "isEmpty",
//     //                 "requiresFilterValue": false
//     //             },
//     //             {
//     //                 "value": "isNotEmpty",
//     //                 "requiresFilterValue": false
//     //             },
//     //             {
//     //                 "value": "isAnyOf"
//     //             }
//     //         ],
//     //         "field": "firstName",
//     //         "headerName": "First Name",
//     //         "hasBeenResized": true,
//     //         "computedWidth": 150
//     //     },
//     //     "cellMode": "edit",
//     //     "hasFocus": true,
//     //     "tabIndex": 0,
//     //     "value": "Pol",
//     //     "formattedValue": "Pol",
//     //     "isEditable": true,
//     //     "reason": "enterKeyDown"
//     // }

//     const userID = params.id;

//     const newUser = {

//     }

//     return
//     await fetch(`/api/v1/user/update/${userID}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newUser),
//     })
//   };

//   return (
//     <div className='users-container select-none'>
//       <h2>{t('Users')}</h2>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         processRowUpdate={(updatedRow, originalRow) => {
//           // {
//           //   "id": "661c2e1bad02f80a0e0aff5f",
//           //   "firstName": "Pols",
//           //   "lastName": "Nilles",
//           //   "email": "nillespol@icloud.com",
//           //   "operationalPosition": "Chef Agres",
//           //   "training": "SAP 1, First Aid Course",
//           //   "experienceRTW": 300,
//           //   "experienceFR": 0
//           // }

//           console.log(updatedRow.training.split(', '))
//           const newUser = {
//             firstName: updatedRow.firstName,
//             lastName: updatedRow.lastName,
//             email: updatedRow.email,
//             operationalPosition: updatedRow.operationalPosition,
//             training: updatedRow.training.split(', '),
//             experience: {
//               RTW: updatedRow.experienceRTW,
//               FR: updatedRow.experienceFR
//             }
//           }

//           console.log(newUser)
//         }}
//         onProcessRowUpdateError={(e) => console.log(e)}
//       />

//       {/* Delete Confirmation Modal */}
//       <Modal show={deleteConfirmation} onHide={() => setDeleteConfirmation(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{t('Confirm Deletion')}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>{t('Are you sure you want to delete this user?')}</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setDeleteConfirmation(false)}>
//             {t('Cancel')}
//           </Button>
//           <Button variant="danger" onClick={handleConfirmDelete}>
//             {t('Delete')}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Users;

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomId,
} from '@mui/x-data-grid-generator';
import { useApiClient } from '../../contexts/ApiContext';
import { toast } from 'react-toastify';

function EditToolbar(props) {
  // eslint-disable-next-line react/prop-types
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add user
      </Button>
    </GridToolbarContainer>
  );
}

const trainings = ['SAP 1', 'SAP 2', 'First Aid Course'];
const positions = ['Chef Agres', 'Equipier Bin.', 'Stagiaire Bin.'];

export default function Users() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const apiClient = useApiClient();


  //#region Api calls
  const updateUser = async (updatedUser) => {
    console.log(updatedUser)
    await apiClient.user.update(updatedUser);
  }

  const deleteUser = async (id) => {
    await apiClient.user.delete(id);
  }
  //#endregion

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await apiClient.user.get();
      const newRows = [];

      // Create rows
      users.forEach((user) => {
        console.log(user)
        //   {
        //     "experience": {
        //         "RTW": 24,
        //         "FR": 0
        //     },
        //     "notifications": {
        //         "securityEmails": true,
        //         "shiftEmails": true,
        //         "otherEmails": true,
        //         "newsletterEmails": true
        //     },
        //     "_id": "6635fbed255df8fbffff156d",
        //     "firstName": "Emily",
        //     "lastName": "O'Dwyer",
        //     "IAM": "odwem569",
        //     "studentClass": "S5DE2",
        //     "training": [
        //         "SAP 1",
        //         "First Aid Course"
        //     ],
        //     "operationalPosition": "Equipier Bin.",
        //     "administratifPosition": "None",
        //     "email": "odwem569@school.lu",
        //     "verified": true,
        //     "onBoarded": true,
        //     "twoFactorAuth": false,
        //     "roles": [
        //         "member"
        //     ],
        //     "createdAt": "2024-05-04T09:12:13.183Z",
        //     "updatedAt": "2024-05-04T09:17:54.911Z",
        //     "__v": 0
        // }
        // TODO: Add more fields
        newRows.push({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          operationalPosition: user.operationalPosition,
          training: user.training.join(', '),
          experienceRTW: user.experience.RTW,
          experienceFR: user.experience.FR,
        });
      });

      setRows(newRows);
    }

    fetchUsers();
  }, [apiClient.user]);


  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    // TODO: Send delete request to backend
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    // Check the trainings
    const arrayOfEditedTrainings = updatedRow.training.split(', ');

    // Ensure each training is valid
    for (let i = 0; i < arrayOfEditedTrainings.length; i++) {
      if (!trainings.includes(arrayOfEditedTrainings[i])) {
        toast.error('Invalid training');
        return;
      }
    }

    // Check the positions 
    const arrayOfEditedPositions = updatedRow.operationalPosition.split(', ');

    // Ensure each position is valid
    for (let i = 0; i < arrayOfEditedPositions.length; i++) {
      if (!positions.includes(arrayOfEditedPositions[i])) {
        toast.error('Invalid position');
        return;
      }
    }
    const { experienceRTW, experienceFR } = updatedRow;
    if (experienceRTW < 0 || experienceFR < 0) {
      toast.error('Invalid experience');
      return;
    }

    const updatedUser = {
      ...updatedRow,
      experience: {
        RTW: experienceRTW,
        FR: experienceFR
      }
    }

    updateUser(updatedUser);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: 'firstName',
      headerName: 'First name',
      width: 180,
      editable: true,
      type: 'string'
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 180,
      editable: true,
      type: 'string'
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 180,
      editable: true,
      type: 'email'
    },
    {
      field: 'operationalPosition',
      headerName: 'Operational Position',
      width: 150,
      editable: true,
      type: 'string'
    },
    {
      field: 'training',
      headerName: 'Training',
      width: 150,
      editable: true,
      type: 'string'
    },
    {
      field: 'experienceRTW',
      headerName: 'RTW Experience',
      width: 150,
      editable: true,
      type: 'number'
    },
    {
      field: 'experienceFR',
      headerName: 'FR Experience',
      width: 150,
      editable: true,
      type: 'number'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={0}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={1}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={1}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={2}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="select-none">
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
    </div>
  );
}