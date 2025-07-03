import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedbacks, getFeedbackById, createFeedback, updateFeedback, deleteFeedback } from '../../apis/feedbackApi/feedbackApi';

// Async thunks
export const fetchFeedbacks = createAsyncThunk('feedback/fetchFeedbacks', async (params) => {
  const response = await getFeedbacks(params);
  return response;
});

export const fetchFeedbackById = createAsyncThunk('feedback/fetchFeedbackById', async (id) => {
  const response = await getFeedbackById(id);
  return response;
});

export const addFeedback = createAsyncThunk('feedback/addFeedback', async (data) => {
  const response = await createFeedback(data);
  return response;
});

export const editFeedback = createAsyncThunk('feedback/editFeedback', async ({ id, data }) => {
  const response = await updateFeedback(id, data);
  return response;
});

export const removeFeedback = createAsyncThunk('feedback/removeFeedback', async (id) => {
  await deleteFeedback(id);
  return id;
});

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFeedbackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchFeedbackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(editFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editFeedback.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex(fb => fb.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(editFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(fb => fb.id !== action.payload);
      })
      .addCase(removeFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default feedbackSlice.reducer; 