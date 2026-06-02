import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createLead, deleteLead, getLead, getLeads, updateLead } from "@/api/leadApi";
import type { Lead, LeadInput, LeadQuery, LeadState, LeadsResponse } from "@/types/lead.types";

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export const fetchLeads = createAsyncThunk<LeadsResponse, LeadQuery | undefined, { rejectValue: string }>(
  "leads/fetchAll",
  async (query, { rejectWithValue }) => {
    try {
      return await getLeads(query);
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  },
);

export const fetchLead = createAsyncThunk<Lead, string, { rejectValue: string }>(
  "leads/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await getLead(id);
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  },
);

export const addLead = createAsyncThunk<Lead, LeadInput, { rejectValue: string }>(
  "leads/create",
  async (input, { rejectWithValue }) => {
    try {
      return await createLead(input);
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  },
);

export const editLead = createAsyncThunk<Lead, { id: string; input: Partial<LeadInput> }, { rejectValue: string }>(
  "leads/update",
  async ({ id, input }, { rejectWithValue }) => {
    try {
      return await updateLead(id, input);
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  },
);

export const removeLead = createAsyncThunk<{ id: string }, string, { rejectValue: string }>(
  "leads/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteLead(id);
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  },
);

const initialState: LeadState = {
  leads: [],
  selectedLead: null,
  totalPages: 1,
  currentPage: 1,
  totalRecords: 0,
  loading: false,
  error: null,
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    clearSelectedLead(state) {
      state.selectedLead = null;
    },
    clearLeadError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to load leads.";
      })
      .addCase(fetchLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLead.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLead = action.payload;
      })
      .addCase(fetchLead.rejected, (state, action) => {
        state.loading = false;
        state.selectedLead = null;
        state.error = action.payload ?? "Unable to load lead.";
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.leads = [action.payload, ...state.leads].slice(0, 10);
        state.totalRecords += 1;
      })
      .addCase(editLead.fulfilled, (state, action) => {
        state.leads = state.leads.map((lead) => (lead._id === action.payload._id ? action.payload : lead));
        state.selectedLead = action.payload;
      })
      .addCase(removeLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((lead) => lead._id !== action.payload.id);
        state.totalRecords = Math.max(0, state.totalRecords - 1);
      });
  },
});

export const { clearLeadError, clearSelectedLead } = leadSlice.actions;
export default leadSlice.reducer;