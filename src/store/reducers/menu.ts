import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosServicesFrontend } from 'utils/axios';

// types
import { MenuProps } from 'types/menu';

// initial state
const initialState: MenuProps = {
  openItem: ['dashboard'],
  openComponent: 'buttons',
  selectedID: null,
  drawerOpen: false,
  componentDrawerOpen: true,
  menuDashboard: {},
  error: null
};

// ==============================|| SLICE - MENU ||============================== //

export const fetchDashboard = createAsyncThunk('menu/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    // Menu nav tree lives on the Next.js BFF — not Django /api/v3/dashboard (metrics).
    const response = await axiosServicesFrontend.get('/api/auth/dashboard');
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const menu = createSlice({
  name: 'menu',
  initialState: initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeID(state, action) {
      state.selectedID = action.payload;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },

    getMenuSuccess(state, action) {
      state.menuDashboard = action.payload;
    },

    hasError(state, action) {
      state.error = action.payload;
    }
  },

  extraReducers(builder) {
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.menuDashboard = action.payload?.dashboard || action.payload || {};
    });
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, activeID } = menu.actions;
