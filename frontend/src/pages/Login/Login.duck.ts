import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, LoginRequest, RegisterRequest } from '../../services';

// Interface cho form data
interface FormData {
  username: string;
  password: string;
}

// Interface cho register data
interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Interface cho login state
interface LoginState {
  formData: FormData;
  registerData: RegisterData;
  isRegister: boolean;
  loading: boolean;
  error: string | null;
  fieldErrors: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

// Initial state
const initialState: LoginState = {
  formData: {
    username: '',
    password: '',
  },
  registerData: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  isRegister: false,
  loading: false,
  error: null,
  fieldErrors: {},
};

// Async thunk cho login
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đăng nhập thất bại');
    }
  }
);

// Async thunk cho register
export const registerUser = createAsyncThunk(
  'login/registerUser',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đăng ký thất bại');
    }
  }
);

// Login slice
const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<{ field: keyof FormData; value: string }>) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      // Clear field error when user types
      if (state.fieldErrors[field]) {
        delete state.fieldErrors[field];
      }
    },
    setRegisterData: (state, action: PayloadAction<{ field: keyof RegisterData; value: string }>) => {
      const { field, value } = action.payload;
      state.registerData[field] = value;
      // Clear field error when user types
      if (state.fieldErrors[field]) {
        delete state.fieldErrors[field];
      }
    },
    toggleRegisterMode: (state) => {
      state.isRegister = !state.isRegister;
      state.error = null;
      state.fieldErrors = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFieldErrors: (state) => {
      state.fieldErrors = {};
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.registerData = initialState.registerData;
      state.error = null;
      state.fieldErrors = {};
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Reset form after successful login
        state.formData = initialState.formData;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Reset form after successful register
        state.registerData = initialState.registerData;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFormData,
  setRegisterData,
  toggleRegisterMode,
  clearError,
  clearFieldErrors,
  resetForm,
} = loginSlice.actions;

export default loginSlice.reducer;
