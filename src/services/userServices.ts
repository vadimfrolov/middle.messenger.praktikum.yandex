import errors from '../constants/errors';
import ChatsApi from '../api/chatsApi';
import UserApi from '../api/userApi';

export const getUsers = async (selectedChatId: string, userList: string[] = [], flag?: boolean) => {
  try {
    const existedUsers = await new ChatsApi().getChatUsers(<string>selectedChatId);
    const existedLogins = (JSON.parse(<string>existedUsers)).map((user: Record<string, string>) => user.login);
    const finalUsers = userList?.filter(user => (flag ? !existedLogins.includes(user) : existedLogins.includes(user)));
    const finalUsersInfo = await Promise.all(finalUsers!.map(async user => {
      const userInfo = await new UserApi().getUserByLogin({ login: user });
      const filteredUserInfo = JSON.parse(<string>userInfo)?.filter((user: Record<string, string>) => userList?.includes(user.login))
        .pop();

      return filteredUserInfo?.id;
    }));

    return finalUsersInfo.filter(info => info);
  } catch (err) {
    throw new Error(`${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
  }
};
