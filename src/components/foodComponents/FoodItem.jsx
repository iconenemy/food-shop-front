import React, {useCallback, useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { observer} from 'mobx-react-lite';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid  from '@mui/material/Grid';
import { CardActionArea, Pagination } from '@mui/material';

import MenuButtons from './MenuButtons';
import FoodService from '../../services/FoodService'

import StoreContext from '../../index'
import { Box, Stack } from '@mui/system';

const countPerPage = 3

const FoodItem = () => {
  const {store} = useContext(StoreContext)
  const location = useLocation()
  const { _id } = location.state.data
  
  const [foodItemList, setFoodItemList] = useState([])
  const [page, setPage] = useState(1)
  const [pageQty, setPageQty] = useState(0)
  const [id, setId] = useState('')

  const getFoodItemsListById = useCallback( async () => {
    setId(_id)
    if(id !== _id) setPage(1)

    const response = await FoodService.getFoodItemsById(_id, countPerPage, page)
    setFoodItemList(response.data.list)
    setPageQty(response.data.totalPage)
  }, [_id, page, id])

  useEffect(() => {
    getFoodItemsListById(_id, countPerPage, page)
  }, [getFoodItemsListById, _id, page])

  const handleOrder = (event, id) => {
    event.preventDefault()
    store.handleOrder(id)
  }

  return (
    <>
    <MenuButtons />
    <Grid container  rowSpacing={1} sx={{justifyContent: 'center', marginTop: 1}}>
      {foodItemList.map((item) => (
        <Grid item key={item._id} md={4} xs={12} sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', marginBottom: 2}}>
          <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="300"
              src={`images/${item.image}`}
              alt="red card"
              />
            <CardContent>
              <Typography gutterBottom variant='h6' component="h1" style={{color: '#ad160c', textTransform: 'uppercase'}}>
                {item.name} 
                
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
            </CardActionArea>
            <CardActions sx={{justifyContent: 'center'}}>
              <Button 
                variant="contained" 
                size="medium"
                onClick={event => handleOrder(event, item._id)}
              > 
                {item.price.$numberDecimal} ₴
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Box width='100%' style={{display: 'flex', justifyContent: 'center'}}>
      <Stack spacing={2}>
        {!!pageQty && (
          <Pagination
          color="primary"
          shape="rounded"
          count={pageQty}
            page={page}
            onChange={(event, numPage) => {
              event.preventDefault()
              setPage(numPage)}
            }
            />
            )}
    </Stack>
    </Box>
    </>
  )
}

export default observer(FoodItem)