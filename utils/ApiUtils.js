export default class ApiUtils {
  constructor(apiRequest, loginPayload) {
    this.apiRequest = apiRequest;
    this.loginPayload = loginPayload;
  }

  async getToken() {
    const resp = await this.apiRequest.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      { data: this.loginPayload },
    );

    const loginResponse = await resp.json();
    return loginResponse;
  }

  async createOrder(orderPayload) {
    const login = await this.getToken();
    const order = await this.apiRequest.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayload,
        headers: {
          authorization: await this.getToken().then((val) => val.token),
          "content-type": "application/json",
        },
      },
    );

    const orderId = await order.json();
    const orderResponse = {
      orderId: orderId,
      login: login,
    };

    return orderResponse;
  }
}
