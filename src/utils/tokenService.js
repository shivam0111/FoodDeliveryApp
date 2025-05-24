// src/utils/tokenService.js
let token = null;

export const setAuthToken = (newToken) => {
  token = newToken;
};

export const getAuthToken = () => token;
