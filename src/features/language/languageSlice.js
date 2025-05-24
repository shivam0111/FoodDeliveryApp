import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
import { store } from '../../store';

export const toggleLanguage = createAsyncThunk(
  'language/toggleLanguage',
  async (currentLanguage, { rejectWithValue }) => {
    const newLang = currentLanguage === 'english' ? 'hindi' : 'english';
    try {
      // check if token is stored or nt
      console.log(store.getState().auth.token)
      const response = await api.post(
        'trusted-driver/switch-language-api.php',
        {
          action: 'update_language',
          current_language: newLang,
        }
      );

      if (response.data.status_code !== 200) {
        return rejectWithValue(response.data.message || 'Failed to update language');
      }

      return newLang;
    } catch (error) {
      return rejectWithValue(error.message || 'Token Expired | Network Error');
    }
  }
);

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    current: 'english',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(toggleLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default languageSlice.reducer;
