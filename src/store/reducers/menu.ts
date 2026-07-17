import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'utils/axios';

// types
import { MenuProps } from 'types/menu';
import { useSession } from 'next-auth/react';

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

// export const fetchDashboard = createAsyncThunk('', async () => {
//   const response = await axios.get('/api/v3/dashboard');
//   return response;
// });

// Define your async thunk
export const fetchDashboard = createAsyncThunk('', async () => {
  // Fetch the dashboard data and return it
  const { data: session } = useSession();
  const response = await axios.get('/api/v3/dashboard'); // Replace with your data fetching code
  return response.data;
 
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
      state.menuDashboard = action.payload.dashboard;
    });
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, activeID } = menu.actions;
