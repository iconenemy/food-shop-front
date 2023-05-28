import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

import { API_URL } from "../http/axios";

import AuthService from "../services/AuthService";
import FoodItemService from "../services/FoodItemService";
import FoodSectionService from "../services/FoodSectionService";
import UserService from "../services/UserService";
import PaymentService from "../services/PaymentService";
import OrderService from "../services/OrderService";
import FoodItem from "../services/FoodItemService";

export default class Store {
  username = "";
  userId = "";
  isAuth = false;
  isLoading = false;
  role = "";
  errors = [];
  errorStatus = null;
  order = new Map();
  payment = "";
  orderId = "";
  durationTime = 0;
  destinationPlace = "";
  originPlace = "";

  constructor() {
    makeAutoObservable(this);
  }

  setUser(username) {
    this.username = username;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setRole(role) {
    this.role = role;
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  setStaff(bool) {
    this.isStaff = bool;
  }

  setErrors(error) {
    this.errors = error;
  }

  setErrorStatus(errorStatus) {
    this.errorStatus = errorStatus;
  }

  setOrder(order) {
    this.order = new Map(order);
  }

  setPayment(payment) {
    this.payment = payment;
  }

  setOriginPlace(originPlace) {
    this.originPlace = originPlace;
  }

  setOrderId(orderId) {
    this.orderId = orderId;
    localStorage.setItem("order_id", this.orderId);
  }

  setDurationTime(durationTime) {
    this.durationTime = durationTime;
  }

  setDestinationPlace(destinationPlace) {
    this.destinationPlace = destinationPlace;
  }

  async login(username, password) {
    try {
      const response = await AuthService.login(username, password);
      localStorage.setItem("access_token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.username);
      this.setUserId(response.data.id);
      this.setRole(response.data.role);
      this.order.clear()
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async register(
    username,
    email,
    password,
    first_name,
    last_name,
    phone_number,
    age
  ) {
    try {
      return await AuthService.register(
        username,
        email,
        password,
        first_name,
        last_name,
        phone_number,
        age
      );
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async logout() {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("order");
      localStorage.removeItem("order_id")
      this.setAuth(false);
      this.role("");
      this.order.clear();
      await AuthService.logout();
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/auth/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("access_token", response.data.accessToken);

      if (localStorage.getItem("order")) {
        const arrayOfOrders = JSON.parse(localStorage.getItem("order"));
        arrayOfOrders.forEach((item) => {
          runInAction(() => {
            this.order.set(item[0], item[1]);
          });
        });
      }

      if (localStorage.getItem("order_id")) {
        const orderId = localStorage.getItem("order_id");
        this.setOrderId(orderId);
      }

      this.setAuth(true);
      this.setRole(response.data.role);
      this.setUser(response.data.username);
      this.setUserId(response.data.id);
    } catch (err) {
      this.setErrors(err?.response?.data);
    } finally {
      this.setLoading(false);
    }
  }

  async createFoodItem(fd) {
    try {
      return await FoodItemService.create(fd);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async createUser(formData) {
    try {
      return await UserService.create(formData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async createPaymentMethod(formData) {
    try {
      return await PaymentService.create(formData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async createFoodSection(formData) {
    try {
      return await FoodSectionService.create(formData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async createOrder(formData) {
    try {
      return await OrderService.create(formData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async updateUser(id, updateData) {
    try {
      return await UserService.update(id, updateData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async updateFoodSection(id, updateData) {
    try {
      return await FoodSectionService.update(id, updateData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async updateFoodItem(id, updateData) {
    try {
      return await FoodItem.updateOne(id, updateData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  async updateOrder(id, updateData) {
    try {
      return await OrderService.update(id, updateData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err?.response?.data);
    }
  }

  async updatePaymentMethod(id, updateData) {
    try {
      return await PaymentService.update(id, updateData);
    } catch (err) {
      this.setErrorStatus(err.response?.status);
      this.setErrors(err.response?.data);
    }
  }

  handleOrder(id) {
    if (this.order.has(id)) {
      const value = this.order.get(id);
      const newValue = value + 1;
      this.order.set(id, newValue);
      localStorage.setItem("order", JSON.stringify(this.order));
    } else {
      this.order.set(id, 1);
      localStorage.setItem("order", JSON.stringify(this.order));
    }
  }

  handleOrderAdd(id) {
    const value = this.order.get(id);
    const newValue = value + 1;
    this.setOrder(this.order.set(id, newValue));
    localStorage.setItem("order", JSON.stringify(this.order));
  }

  handleOrderPull(id) {
    const value = this.order.get(id);
    if (value > 0) {
      const newValue = value - 1;
      this.setOrder(this.order.set(id, newValue));
    }
    localStorage.setItem("order", JSON.stringify(this.order));
  }

  handleOrderDelete(id) {
    this.order.delete(id);
    this.setOrder(this.order);
    localStorage.setItem("order", JSON.stringify(this.order));
  }

  getOrderSize() {
    let count = 0;
    this.order.forEach((value) => {
      count += value;
    });
    return count;
  }

  isOrderItemActive(id) {
    return this.order.get(id) < 2 ? true : false;
  }

  orderArray() {
    return Array.from(this.order, ([name, value]) => ({ name, value }));
  }

  clearOrder() {
    this.order.clear();
    localStorage.setItem("order", JSON.stringify(this.order));
  }
}
