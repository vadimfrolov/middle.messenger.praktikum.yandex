import HTTP from '../utils/request';

const authAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/auth');

class AuthAPI {
  private userInfo: XMLHttpRequest | string | null = null;

  signup(payload: Record<string, FormDataEntryValue>) {
    return authAPIInstance.post('/signup', { data: payload });
  }

  signin(payload: Record<string, FormDataEntryValue>) {
    return authAPIInstance.post('/signin', { data: payload });
  }

  async getUserInfo() {
    this.userInfo = this.userInfo ??  await authAPIInstance.get('/user');
    setTimeout(() => {
      this.userInfo = null;
    }, 1000);

    return this.userInfo;
  }

  logout() {
    return authAPIInstance.post('/logout');
  }
}

export default AuthAPI;
