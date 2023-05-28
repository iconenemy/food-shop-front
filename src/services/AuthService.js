import $api from "../http/axios";

export default class AuthService {
  static async login(username, password) {
    return $api.post("auth/login", { username, password });
  }

  static async register(
    username,
    email,
    password,
    first_name,
    last_name,
    phone_number,
    age
  ) {
    return $api.post("auth/register", {
      username,
      email,
      password,
      first_name,
      last_name,
      phone_number,
      age,
    });
  }

  static async logout() {
    return $api.get("auth/logout");
  }
}
