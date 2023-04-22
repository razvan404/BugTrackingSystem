import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Dashboard, Settings, Help, ExitToApp } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import ManageAccountsPage from './ManageAccountsPage';

function MainPage() {
  const navigate = useNavigate();
  const [employeeType, setEmployeeType] = useState('');

  useEffect( () => {
    (async () => {
      await fetch('/api/get-employee')
        .then((response) => {
          if (!response.ok) {
            navigate('/login', {replace: true});
          }
          return response.json();
        })
        .then((data) => {
          setEmployeeType(data.type);
        });
    })();
  }, []);

  const handleLogout = () => {
    fetch('/api/logout-employee', { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          navigate('/login', {replace: true});
        }
      });
  }

  return (
    <div className='mainRoot'>
      <AppBar className='mainAppBar'>
        <Toolbar>
          <Typography variant='h6' noWrap>
            Bug Tracking System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className='mainDrawer'
        variant='permanent'
        classes={{
          paper: 'drawerPaper'
        }}
      >
        <Toolbar />
        <div className='mainDrawerContainer'>
          <List>
            <ListItem button>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary='Bugs List' />
            </ListItem>
            {employeeType === 'administrator' ?
                <ListItem button>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary='Manage Accounts' />
                </ListItem> : null
            }
            {employeeType === 'tester' ?
                <ListItem button>
                  <ListItemIcon>
                    <Help />
                  </ListItemIcon>
                  <ListItemText primary='Submitted Bugs' />
                </ListItem> : null
            }
            {employeeType === 'programmer' ?
                <ListItem button>
                  <ListItemIcon>
                    <Help />
                  </ListItemIcon>
                  <ListItemText primary='Your Tasks' />
                </ListItem> : null
            }
          </List>
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className='mainContent'>
        <Toolbar />
        <ManageAccountsPage />
      </main>
    </div>
  );
}

export default MainPage;