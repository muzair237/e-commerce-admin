import { createSlice } from '@reduxjs/toolkit';
import feedbackThunk from './thunk';

const initialState = {
  feedbacks: {},
  isLoading: false,
  errorMsg: '',
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL FEEDBACKS
      .addCase(feedbackThunk.getAllFeedbacks.pending, state => {
        state.isLoading = true;
      })
      .addCase(feedbackThunk.getAllFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action?.payload;
      })
      .addCase(feedbackThunk.getAllFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      });
  },
});

export default feedbackSlice.reducer;
