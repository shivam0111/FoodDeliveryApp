import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (mobile, { rejectWithValue }) => {
    try {
      const response = await api.post('login/driver-login.php', {
        mobile,
        user_type: 'Driver',
        app_version: '2.37',
        app_type: 'android',
      });
      if (response.data.status_code !== "200") {
        return rejectWithValue(response.data.message);
      }
      return { mobile };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('login/verify-otp-login.php', {
        mobile,
        otp,
        user_type: 'Driver',
        app_version: '2.37',
        app_type: 'android',
      });

      if (response.data.status_code !== "200") {
        return rejectWithValue(response.data.message);
      }

      return {
        token: response.data.jwt,
        mobile,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'OTP verification failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    mobile: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.mobile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.mobile = action.payload.mobile;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.mobile = action.payload.mobile;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
