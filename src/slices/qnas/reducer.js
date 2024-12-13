import { createSlice } from '@reduxjs/toolkit';
import questionThunk from './thunk';

const initialState = {
  questions: {},
  isLoading: false,
  errorMsg: '',
};

const quesSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // GET ALL QUESTIONS
      .addCase(questionThunk.getAllQuestions.pending, state => {
        state.isLoading = true;
      })
      .addCase(questionThunk.getAllQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action?.payload;
      })
      .addCase(questionThunk.getAllQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      })

      // CREATE QUESTION
      .addCase(questionThunk.createQuestion.pending, state => {
        state.isLoading = true;
      })
      .addCase(questionThunk.createQuestion.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(questionThunk.createQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      })

      // EDIT QUESTION
      .addCase(questionThunk.editQuestion.pending, state => {
        state.isLoading = true;
      })
      .addCase(questionThunk.editQuestion.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(questionThunk.editQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      })

      // DELETE QUESTION
      .addCase(questionThunk.deleteQuestion.pending, state => {
        state.isLoading = true;
      })
      .addCase(questionThunk.deleteQuestion.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(questionThunk.deleteQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.error?.message;
      });
  },
});

export default quesSlice.reducer;
