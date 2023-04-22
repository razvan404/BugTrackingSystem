import React, { useState, useEffect } from "react";
import {
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel, ButtonGroup, Collapse,
} from "@material-ui/core";
import MaterialTable from 'material-table';
import { tableIcons } from "./Utils";
import { Alert } from "@material-ui/lab";

const ManageAccountsPage = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [employeeType, setEmployeeType] = useState('');
  const [employeeTypeError, setEmployeeTypeError] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');


  const [employees, setEmployees] = useState([]);
  const loadEmployees = () => {
    fetch('/api/get-all-employees')
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      });
  }
  useEffect(() => {
    loadEmployees();
  }, []);


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const handleEmployeeTypeChange = (event) => {
    setEmployeeType(event.target.value);
    setEmployeeTypeError('');
  };

  const handleCreateAccount = () => {
      if (validateInput()) {
          const requestOptions = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  username: username,
                  password: password,
                  type: employeeType
              })
          };
          fetch('/api/create-employee', requestOptions)
              .then((response) => {
                  if (!response.ok) {
                      response.json().then((data) => setErrorMsg(data.error));
                  }
                  else {
                      response.json().then((data) => setSuccessMsg(data.msg));
                      loadEmployees();
                  }
              });
      }
  };

  const handleUpdateAccount = () => {
      if (validateInput() && selectedRow !== null) {
            const requestOptions = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: selectedRow.id,
                    username: username,
                    password: password,
                    type: employeeType
                })
            };
            fetch('/api/update-employee', requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        response.json().then((data) => setErrorMsg(data.error));
                    }
                    else {
                        response.json().then((data) => setSuccessMsg(data.msg));
                        loadEmployees();
                        setSelectedRow(null);
                    }
                });
      }
  };

  const handleDeleteAccount = () => {
    // TODO: implement delete account functionality
  };


  const validateInput = () => {
    let isValid = true;
    if (username.length < 3 || username.length > 24) {
        setUsernameError('Username must be between 3 and 24 characters');
        isValid = false;
    }
    if (password.length < 3 || username.length > 24) {
        setPasswordError('Password must be between 3 and 24 characters');
        isValid = false;
    }
    if (employeeType === "") {
        setEmployeeTypeError('Please select an employee type');
        isValid = false;
    }
    return isValid;
  }


  const [selectedRow, setSelectedRow] = useState(null);
  const getEmployeesTable = () => {
    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Username', field: 'username' },
        { title: 'Type', field: 'type' }
    ];

    return (
          <MaterialTable
              title='Employees'
              columns={columns}
              data={employees}
              icons={tableIcons}
              onRowClick={(evt, currentSelectedRow) => {
                  if (selectedRow === currentSelectedRow) {
                        setSelectedRow(null);
                        setEmployeeType('');
                        setUsername('');
                        setPassword('');
                        return;
                  }
                  setSelectedRow(currentSelectedRow);
                  setEmployeeType(currentSelectedRow.type);
                  setUsername(currentSelectedRow.username);
                  setPassword('');
              }}
              options={{
                rowStyle: (rowData) => ({
                    backgroundColor: selectedRow === rowData ? "#5972FF" : "#FFF",
              })
              }}
          />
    );
  }

  return (
      <div>
        <Typography variant="h4">
          Manage Accounts
        </Typography>

        <FormControl fullWidth margin='normal'>
          <InputLabel>Employee Type</InputLabel>
          <Select
              value={employeeType}
              onChange={handleEmployeeTypeChange}
              error={employeeTypeError !== ''}
              helperText={employeeTypeError}
          >
            <MenuItem value="administrator">Administrator</MenuItem>
            <MenuItem value="tester">Tester</MenuItem>
            <MenuItem value="programmer">Programmer</MenuItem>
          </Select>
          <TextField
              label='Username'
              value={username}
              onChange={handleUsernameChange}
              error={usernameError !== ''}
              helperText={usernameError}
          />
          <TextField
              label='Password'
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError !== ''}
              helperText={passwordError}
          />
        </FormControl>

        <ButtonGroup fullWidth style={{gap: 20}}>
          <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAccount}>
            Create Account
          </Button>
          <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateAccount}
              disabled={selectedRow === null}
          >
            Update Account
          </Button>
          <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteAccount}
              disabled={selectedRow === null}>
            Delete Account
          </Button>
        </ButtonGroup>

        <Collapse in={successMsg !== '' || errorMsg !== ''}>
            <Alert severity={successMsg !== '' ? 'success' : 'error'} onClose={ () => {
                setErrorMsg('');
                setSuccessMsg('');
                }}>
                {successMsg !== '' ? successMsg : errorMsg}
            </Alert>
        </Collapse>

        <div>
          {getEmployeesTable()}
        </div>

      </div>
  );
};

export default ManageAccountsPage;