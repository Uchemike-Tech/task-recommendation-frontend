const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';
const USERNAME_KEY = 'username';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUserId: () => localStorage.getItem(USER_ID_KEY),
  setUserId: (id) => localStorage.setItem(USER_ID_KEY, id),
  removeUserId: () => localStorage.removeItem(USER_ID_KEY),

  getUsername: () => localStorage.getItem(USERNAME_KEY),
  setUsername: (name) => localStorage.setItem(USERNAME_KEY, name),
  removeUsername: () => localStorage.removeItem(USERNAME_KEY),

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USERNAME_KEY);
  },
};
