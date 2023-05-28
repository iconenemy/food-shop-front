import {Routes, Route } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import {observer} from 'mobx-react-lite'

import StoreContext from './index';

import Layout from './components/Layout';
import Main from './components/Main';
import Login from './components/authComponents/Login';
import Register from './components/authComponents/Register';
import AdminLayout from './components/adminComponents/AdminLayout';
import AdminMain from './components/adminComponents/AdminMain';
import AdminDocumentList from './components/adminComponents/AdminDocumentList';
import AdminDocumentUpdate from './components/adminComponents/AdminDocumentUpdate';
import AdminDocumentCreate from './components/adminComponents/AdminDocumentCreate';
import FoodItem from './components/foodComponents/FoodItem';
import IssueOrder from './components/orderComponents/IssueOrder';
import OrderInfo from './components/orderComponents/OrderInfo';

const App = () => {
  const {store} = useContext(StoreContext)

  useEffect( () => {
    if (localStorage.getItem('access_token')) {
      store.checkAuth()
    }
  }, [store])

  return ( <>
    {store.isLoading ? 
      <div>Loading...</div> 
      :
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} />
          <Route index path=':section' element={<FoodItem />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='issue-order' element={< IssueOrder />} />
          <Route path='order-info' element={<OrderInfo />}/>
          </Route>
        <Route path='admin' element={<AdminLayout />}>
            <Route index element={<AdminMain />} />
            <Route path=':model' element={<AdminDocumentList />} />
            <Route path=':model/:id' element={<AdminDocumentUpdate />} />
            <Route path=':model/create' element={<AdminDocumentCreate />} />
        </Route>
      </Routes>
    }
  </>
  );
}

export default observer(App);
