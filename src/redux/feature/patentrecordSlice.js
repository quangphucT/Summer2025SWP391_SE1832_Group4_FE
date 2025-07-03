import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAllPatientRecords,
    getPatientRecordsByPatientId,
    getPatientRecordsByDoctorId,
    createPatientRecord,
    getPatientRecordById,
    updatePatientRecord,
    deletePatientRecord
} from '../../apis/patientApi/patentrecordApi';

// Async thunks
export const fetchAllMedicalRecords = createAsyncThunk(
    'medicalRecord/fetchAllMedicalRecords',
    async () => {
        const response = await getAllPatientRecords();
        return Array.isArray(response) ? response : [];
    }
);

export const fetchMedicalRecordsByPatientId = createAsyncThunk(
    'medicalRecord/fetchMedicalRecordsByPatientId',
    async (patientId) => {
        const response = await getPatientRecordsByPatientId(patientId);
        return Array.isArray(response) ? response : [];
    }
);

export const fetchMedicalRecordsByDoctorId = createAsyncThunk(
    'medicalRecord/fetchMedicalRecordsByDoctorId',
    async (doctorId) => {
        const response = await getPatientRecordsByDoctorId(doctorId);
        return Array.isArray(response) ? response : [];
    }
);

export const fetchMedicalRecordById = createAsyncThunk(
    'medicalRecord/fetchMedicalRecordById',
    async (id) => {
        const response = await getPatientRecordById(id);
        return response;
    }
);

export const createNewMedicalRecord = createAsyncThunk(
    'medicalRecord/createNewMedicalRecord',
    async (data) => {
        const response = await createPatientRecord(data);
        return response;
    }
);

export const updateMedicalRecordById = createAsyncThunk(
    'medicalRecord/updateMedicalRecordById',
    async ({ id, data }) => {
        const response = await updatePatientRecord(id, data);
        return response;
    }
);

export const deleteMedicalRecordById = createAsyncThunk(
    'medicalRecord/deleteMedicalRecordById',
    async (id) => {
        await deletePatientRecord(id);
        return id;
    }
);

const initialState = {
    medicalRecords: [],
    currentMedicalRecord: null,
    status: 'idle',
    error: null,
    isLoading: false
};

const medicalRecordSlice = createSlice({
    name: 'medicalRecord',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearCurrentMedicalRecord: (state) => {
            state.currentMedicalRecord = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchAllMedicalRecords.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllMedicalRecords.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.medicalRecords = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchAllMedicalRecords.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.medicalRecords = [];
            })

            // Fetch by patientId
            .addCase(fetchMedicalRecordsByPatientId.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMedicalRecordsByPatientId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.medicalRecords = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchMedicalRecordsByPatientId.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.medicalRecords = [];
            })

            // Fetch by doctorId
            .addCase(fetchMedicalRecordsByDoctorId.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMedicalRecordsByDoctorId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.medicalRecords = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchMedicalRecordsByDoctorId.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.medicalRecords = [];
            })

            // Fetch by id
            .addCase(fetchMedicalRecordById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMedicalRecordById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.currentMedicalRecord = action.payload;
                state.error = null;
            })
            .addCase(fetchMedicalRecordById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.currentMedicalRecord = null;
            })

            // Create
            .addCase(createNewMedicalRecord.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createNewMedicalRecord.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                if (action.payload) {
                    state.medicalRecords.push(action.payload);
                    state.currentMedicalRecord = action.payload;
                }
                state.error = null;
            })
            .addCase(createNewMedicalRecord.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Update
            .addCase(updateMedicalRecordById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateMedicalRecordById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.currentMedicalRecord = action.payload;
                const index = state.medicalRecords.findIndex(rec => rec.id === action.payload.id);
                if (index !== -1) {
                    state.medicalRecords[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateMedicalRecordById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Delete
            .addCase(deleteMedicalRecordById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteMedicalRecordById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.medicalRecords = state.medicalRecords.filter(rec => rec.id !== action.payload);
                if (state.currentMedicalRecord?.id === action.payload) {
                    state.currentMedicalRecord = null;
                }
                state.error = null;
            })
            .addCase(deleteMedicalRecordById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { resetStatus, clearCurrentMedicalRecord } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer;
