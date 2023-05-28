import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import StoreContext from '../../..';

const UserDocumentCreate = ({model}) => {
  const { store } = useContext(StoreContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState(Object.freeze({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    age: null,
  }))

  useEffect (() => {
    store.setErrorStatus(null)
    store.setErrors([])
  }, [store])

  const handleChange = (event) => {
      setFormData({
        ...formData, 
        [event.target.name]: event.target.value.trim()
      })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await store.createUser(formData)
    if (response?.data?.status === 201) navigate(`/admin/${model}`)
  }

  return (
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: '#d21976' }}>
        <PersonAddIcon />
      </Avatar>
      <Typography component="h1" variant="h5" color={"#d21976"}>
       Create user
      </Typography>
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              color='neutral'
              autoFocus
              autoComplete="given-name"
              required
              fullWidth
              id="first_name"
              name="first_name"
              label="First Name"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              color='neutral'
              required
              fullWidth
              id="last_name"
              name="last_name"
              label="Last Name"
              autoComplete="family-name"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              color='neutral'
              required
              fullWidth
              id="username"
              name="username"
              label="Username"
              autoComplete="username"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              color='neutral'
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              autoComplete="email"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              color='neutral'
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              onChange={handleChange}
            />
          </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    color='neutral'
                    required
                    fullWidth
                    id="phone_number"
                    name="phone_number"
                    label="Phone number"
                    autoComplete="phonenumber"
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}sm={4}>
                <TextField
                    color='neutral'
                    required
                    fullWidth
                    id="age"
                    name="age"
                    label="Age"
                    type="number"
                    autoComplete="age"
                    onChange={handleChange}
                />
            </Grid>

            <Grid item>
            {store.errorStatus === 409 &&  store.errors.map((item, idx) => 
              <Typography key={idx} sx={{color: '#d21976'}} variant="caption" display="block"> 
                *&nbsp;{item.message}
              </Typography>)
            }

            {store.errorStatus === 400 && 
            <Typography sx={{color: '#d21976'}} variant="body2">
              *&nbsp;{store.errors.message}
            </Typography>
            }
            </Grid>

        </Grid>
        <Button
              color='neutral'
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Create
            </Button>
      </Box>
    </Box>
  </Container>
  )}

export default observer(UserDocumentCreate)