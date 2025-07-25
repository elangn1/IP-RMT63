import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { serverApi } from "../utils/api";

// Async thunk untuk fetch, create, update, delete
export const fetchPlans = createAsyncThunk("plan/fetchPlans", async (_, { rejectWithValue }) => {
  try {
    const { data } = await serverApi.get("/plans", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch plans");
  }
});

export const createPlan = createAsyncThunk(
  "plan/createPlan",
  async (judulBelajar, { rejectWithValue }) => {
    try {
      await serverApi.post(
        "/plans",
        { judulBelajar },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        }
      );
      // Setelah create, fetch ulang di komponen
      return;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Gagal membuat plan");
    }
  }
);

export const updatePlan = createAsyncThunk(
  "plan/updatePlan",
  async ({ id, judulBelajar }, { rejectWithValue }) => {
    try {
      await serverApi.put(
        `/plans/${id}`,
        { judulBelajar },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        }
      );
      return;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Gagal update plan");
    }
  }
);

export const deletePlan = createAsyncThunk("plan/deletePlan", async (id, { rejectWithValue }) => {
  try {
    await serverApi.delete(`/plans/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    });
    return;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Gagal hapus plan");
  }
});

export const planSlice = createSlice({
  name: "plan",
  initialState: {
    plans: [],
    loading: false,
    error: null,
    creating: false,
    editingId: null,
    editValue: "",
    loadingEditId: null,
    expanded: {}
  },
  reducers: {
    setEditingId: (state, action) => {
      state.editingId = action.payload;
    },
    setEditValue: (state, action) => {
      state.editValue = action.payload;
    },
    setExpanded: (state, action) => {
      state.expanded = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPlan.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      .addCase(updatePlan.pending, (state, action) => {
        state.loadingEditId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state) => {
        state.loadingEditId = null;
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loadingEditId = null;
        state.error = action.payload;
      })
      .addCase(deletePlan.pending, (state, action) => {
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state) => {})
      .addCase(deletePlan.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { setEditingId, setEditValue, setExpanded } = planSlice.actions;

export default planSlice.reducer;
