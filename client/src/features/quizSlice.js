import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { serverApi } from "../utils/api";

export const fetchQuizPlan = createAsyncThunk(
  "quiz/fetchQuizPlan",
  async (id, { rejectWithValue }) => {
    try {
      const { data: planData } = await serverApi.get(`/plans/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      });

      if (planData.quizzes && Array.isArray(planData.quizzes) && planData.quizzes.length > 0) {
        return { plan: planData, quizzes: planData.quizzes };
      } else {
        const { data } = await serverApi.post(
          `/plans/${id}/generate-quizzes`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          }
        );
        return { plan: planData, quizzes: data.quizzes };
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil/generate quiz");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    plan: null,
    quizzes: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload.plan;
        state.quizzes = action.payload.quizzes;
      })
      .addCase(fetchQuizPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default quizSlice.reducer;
