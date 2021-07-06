import HTTP from '../utils/request';

const userAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/user');

class UsersAPI {
  private userByLogin: XMLHttpRequest | string | null = null;

  changeProfile(payload: Record<string, FormDataEntryValue>) {
    return userAPIInstance.put('/profile', { data: payload });
  }

  changeProfileAvatar(payload: FormData) {
    return userAPIInstance.put('/profile/avatar', { data: payload, isFormData: true });
  }

  changePassword(payload: Record<string, FormDataEntryValue>) {
    return userAPIInstance.put('/password', { data: payload });
  }

  async getUserByLogin(payload: Record<string, string>) {
    this.userByLogin = this.userByLogin ?? await userAPIInstance.post('/search', { data: payload });
    setTimeout(() => {
      this.userByLogin = null;
    }, 1000);

    return this.userByLogin;
  }
}

export default UsersAPI;
