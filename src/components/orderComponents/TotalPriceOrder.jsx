import React, { useCallback, useContext, useState, useEffect } from 'react'
import { observer} from 'mobx-react-lite';

import StoreContext from '../..'
import FoodService from '../../services/FoodService'

const TotalPriceOrder = () => {
    const { store } = useContext(StoreContext)
    const [foodPrices, setFoodPrices] = useState([])
    const [totalQty, setTotalQty] = useState(0)

    const getFoodItemPrice = useCallback( async (id, qty) => {
        const response = await FoodService.getFoodItemById(id)
        setFoodPrices(oldArray => {
            return [...oldArray.filter(item  => item.id !== id), {id: id, price: parseFloat(response.data.item.price.$numberDecimal), count: qty}] 
        })
    }, [])

    useEffect(() => {
        store.order.forEach((value, key) => {
            getFoodItemPrice(key, value)
        })
    }, [store.order, getFoodItemPrice])

    useEffect(() => {
        setTotalQty(foodPrices.reduce((acc, item) => {
            if (store.order.has(item.id)) {
                return acc + item.price * item.count
            }
            return 0
        }, 0
        ))
    }, [foodPrices, store])

    return (
        <>
         {totalQty} 
        </>
  )
}

export default observer(TotalPriceOrder)