import React from 'react'
import { useParams } from 'react-router-dom'

import UserDocumentCreate from './userDocuments/UserDocumentCreacte'
import FoodSectionDocumentCreate from './foodSectionDocuments/FoodSectionDocumentCreate'
import FoodItemDocumentCreate from './foodItemDocuments/FoodItemDocumentCreate'
import PaymentMethodDocumentCreate from './paymentMethodDocuments/PaymentMethodDocumentCreate'
import OrderDocumentCreate from './orderDocuments/OrderDocumentCreate'

const AdminDocumentCreate = () => {
    const {model} = useParams()
  return (
    <>
      { model === 'User' && 
          <UserDocumentCreate model={model} />}
    
      { model === 'FoodSection' && 
          <FoodSectionDocumentCreate model={model} />}

      { model === 'FoodItem' && 
          <FoodItemDocumentCreate model={model} />}
      
      { model === 'PaymentMethod' && 
          <PaymentMethodDocumentCreate model={model} />}
      
      { model === 'Order' && 
          <OrderDocumentCreate model={model} />}
    </>
  )
}

export default AdminDocumentCreate