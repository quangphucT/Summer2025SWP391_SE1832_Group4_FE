import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAllPatientRecords,
    getPatientRecordsByPatientId,
    createPatientRecord,
    getPatientRecordById,
    updatePatientRecord,
    deletePatientRecord
} from '../../apis/patientApi/patentrecordApi';

// Async thunks
export const fetchAllPatientRecords = createAsyncThunk(
    'patentRecord/fetchAllPatientRecords',
    async () => {
        const response = await getAllPatientRecords();
        return Array.isArray(response) ? response : [];
    }
);

export const fetchPatientRecordsByPatientId = createAsyncThunk(
    'patentRecord/fetchPatientRecordsByPatientId',
    async (patientId) => {
        const response = await getPatientRecordsByPatientId(patientId);
        return Array.isArray(response) ? response : [];
    }
);

export const fetchPatientRecordById = createAsyncThunk(
    'patentRecord/fetchPatientRecordById',
    async (id) => {
        const response = await getPatientRecordById(id);
        return response;
    }
);

export const createNewPatientRecord = createAsyncThunk(
    'patentRecord/createNewPatientRecord',
    async (data) => {
        const response = await createPatientRecord(data);
        return response;
    }
);

export const updatePatientRecordById = createAsyncThunk(
    'patentRecord/updatePatientRecordById',
    async ({ id, data }) => {
        const response = await updatePatientRecord(id, data);
        return response;
    }
);

export const deletePatientRecordById = createAsyncThunk(
    'patentRecord/deletePatientRecordById',
    async (id) => {
        await deletePatientRecord(id);
        return id;
    }
);

const initialState = {
    patientRecords: [],
    currentPatientRecord: null,
    status: 'idle',
    error: null,
    isLoading: false
};

const patentrecordSlice = createSlice({
    name: 'patentRecord',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearCurrentPatientRecord: (state) => {
            state.currentPatientRecord = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchAllPatientRecords.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllPatientRecords.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.patientRecords = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchAllPatientRecords.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.patientRecords = [];
            })

            // Fetch by patientId
            .addCase(fetchPatientRecordsByPatientId.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPatientRecordsByPatientId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.patientRecords = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchPatientRecordsByPatientId.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.patientRecords = [];
            })

            // Fetch by id
            .addCase(fetchPatientRecordById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPatientRecordById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.currentPatientRecord = action.payload;
                state.error = null;
            })
            .addCase(fetchPatientRecordById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.currentPatientRecord = null;
            })

            // Create
            .addCase(createNewPatientRecord.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createNewPatientRecord.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                if (action.payload) {
                    state.patientRecords.push(action.payload);
                    state.currentPatientRecord = action.payload;
                }
                state.error = null;
            })
            .addCase(createNewPatientRecord.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Update
            .addCase(updatePatientRecordById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePatientRecordById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.currentPatientRecord = action.payload;
                const index = state.patientRecords.findIndex(rec => rec.id === action.payload.id);
                if (index !== -1) {
                    state.patientRecords[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updatePatientRecordById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Delete
            .addCase(deletePatientRecordById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletePatientRecordById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.patientRecords = state.patientRecords.filter(rec => rec.id !== action.payload);
                if (state.currentPatientRecord?.id === action.payload) {
                    state.currentPatientRecord = null;
                }
                state.error = null;
            })
            .addCase(deletePatientRecordById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { resetStatus, clearCurrentPatientRecord } = patentrecordSlice.actions;
export default patentrecordSlice.reducer;
