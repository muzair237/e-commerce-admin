import { createSlice } from '@reduxjs/toolkit';
import dashboardThunk from './thunk';

const initialState = {
  dashboardCards: {},
  recentQueries: {},
  todayQueryCount: {},
  ageGroups: {},
  isLoading: false,
  errorMsg: '',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL DASHBOARD CARDS
      .addCase(dashboardThunk.getDashboardCards.pending, state => {
        state.isLoading = true;
      })
      .addCase(dashboardThunk.getDashboardCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardCards = action?.payload;
      })
      .addCase(dashboardThunk.getDashboardCards.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      })

      // GET RECENT QUERIES
      .addCase(dashboardThunk.getRecentQueries.pending, state => {
        state.isLoading = true;
      })
      .addCase(dashboardThunk.getRecentQueries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentQueries = action?.payload;
      })
      .addCase(dashboardThunk.getRecentQueries.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      })

      // GET TODAY QUERY COUNT
      .addCase(dashboardThunk.getTodayQueryCount.pending, state => {
        state.isLoading = true;
      })
      .addCase(dashboardThunk.getTodayQueryCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayQueryCount = action?.payload;
      })
      .addCase(dashboardThunk.getTodayQueryCount.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      })

      // GET AGE GROUPS
      .addCase(dashboardThunk.getAgeGroups.pending, state => {
        state.isLoading = true;
      })
      .addCase(dashboardThunk.getAgeGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ageGroups = action?.payload;
      })
      .addCase(dashboardThunk.getAgeGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      });
  },
});

export default dashboardSlice.reducer;
