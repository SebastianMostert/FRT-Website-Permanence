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
import { Checkbox, Input, ListItemText, MenuItem, Select } from '@mui/material';

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
const positions = ['Chef Agres', 'Equipier Bin.', 'Stagiaire Bin.', 'None'];
const roles = ['admin', 'loge', 'member'];

export default function Users() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const apiClient = useApiClient();


  //#region Api calls
  const updateUser = async (updatedUser) => {
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
          verified: user.verified,
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
      width: 125,
      editable: true,
      type: 'string'
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 125,
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
      editable: false
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
      width: 120,
      editable: true,
      type: 'number'
    },
    {
      field: 'experienceFR',
      headerName: 'FR Experience',
      width: 120,
      editable: true,
      type: 'number'
    },
    {
      field: 'verified',
      headerName: 'Verified',
      width: 100,
      editable: true,
      type: 'boolean'
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