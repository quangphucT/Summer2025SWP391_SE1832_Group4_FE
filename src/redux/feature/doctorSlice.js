import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAllDoctors,
    getDoctorById,
    getDoctorsBySpecialty
} from '../../apis/doctorApi/doctorApi';

// Async thunks
export const fetchAllDoctors = createAsyncThunk(
    'doctor/fetchAllDoctors',
    async () => {
        const response = await getAllDoctors();
        return response?.data || [];
    }
);

export const fetchDoctorById = createAsyncThunk(
    'doctor/fetchDoctorById',
    async (id) => {
        const response = await getDoctorById(id);
        return response?.data;
    }
);

export const fetchDoctorsBySpecialty = createAsyncThunk(
    'doctor/fetchDoctorsBySpecialty',
    async (specialty) => {
        const response = await getDoctorsBySpecialty(specialty);
        return response?.data || [];
    }
);

const initialState = {
    doctors: [],
    currentDoctor: null,
    filteredDoctors: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    isLoading: false
};

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearCurrentDoctor: (state) => {
            state.currentDoctor = null;
        },
        clearFilteredDoctors: (state) => {
            state.filteredDoctors = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all doctors
            .addCase(fetchAllDoctors.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllDoctors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.doctors = action.payload;
                state.error = null;
            })
            .addCase(fetchAllDoctors.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.doctors = [];
            })

            // Fetch doctor by ID
            .addCase(fetchDoctorById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctorById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.currentDoctor = action.payload;
                state.error = null;
            })
            .addCase(fetchDoctorById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.currentDoctor = null;
            })

            // Fetch doctors by specialty
            .addCase(fetchDoctorsBySpecialty.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctorsBySpecialty.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.filteredDoctors = action.payload;
                state.error = null;
            })
            .addCase(fetchDoctorsBySpecialty.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.filteredDoctors = [];
            });
    }
});

export const { resetStatus, clearCurrentDoctor, clearFilteredDoctors } = doctorSlice.actions;
export default doctorSlice.reducer;
