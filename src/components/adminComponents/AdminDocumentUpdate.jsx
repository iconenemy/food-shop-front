import React from 'react'
import { useParams } from 'react-router-dom'

import UserDocumentUpdate from './userDocuments/UserDocumentUpdate'
import FoodSectionDocumentUpdate from './foodSectionDocuments/FoodSectionDocumnetUpdate'
import FoodItemDocumentUpdate from './foodItemDocuments/foodItemDocumentUpdate'
import PaymentMethodDocumentUpdate from './paymentMethodDocuments/PaymentMethodDocumentUpdate'
import OrderDocumentUpdate from './orderDocuments/OrderDocumentUpdate'

const AdminDocumentUpdate = () => {
    const {model, id} = useParams()
  return (
    <>
        { model === 'User' &&
          <UserDocumentUpdate model={model} id={id} /> }
        
        { model === 'FoodSection' &&
          <FoodSectionDocumentUpdate model={model} id={id} /> }

        { model === 'FoodItem' &&
          <FoodItemDocumentUpdate model={model} id={id} /> }
        
        { model === 'PaymentMethod' &&
          <PaymentMethodDocumentUpdate model={model} id={id} /> }
        
        { model === 'Order' &&
          <OrderDocumentUpdate model={model} id={id} /> }
    </>
  )
}

export default AdminDocumentUpdate