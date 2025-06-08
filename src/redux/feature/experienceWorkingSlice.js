import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getDoctorExperienceWorking,
    updateDoctorExperienceWorking,
    getExperienceWorkingById,
    updateExperienceWorking,
    deleteExperienceWorking,
    createExperienceWorking
} from '../../apis/doctorApi/experienceworkingApi';

// Async thunks
export const fetchDoctorExperience = createAsyncThunk(
    'experienceWorking/fetchDoctorExperience',
    async (doctorId) => {
        const response = await getDoctorExperienceWorking(doctorId);
        return response;
    }
);

export const updateDoctorExperience = createAsyncThunk(
    'experienceWorking/updateDoctorExperience',
    async ({ doctorId, data }) => {
        const response = await updateDoctorExperienceWorking(doctorId, data);
        return response;
    }
);

export const fetchExperienceById = createAsyncThunk(
    'experienceWorking/fetchExperienceById',
    async (id) => {
        const response = await getExperienceWorkingById(id);
        return response;
    }
);

export const updateExperienceById = createAsyncThunk(
    'experienceWorking/updateExperienceById',
    async ({ id, data }) => {
        const response = await updateExperienceWorking(id, data);
        return response;
    }
);

export const deleteExperienceById = createAsyncThunk(
    'experienceWorking/deleteExperienceById',
    async (id) => {
        await deleteExperienceWorking(id);
        return id;
    }
);

export const createNewExperience = createAsyncThunk(
    'experienceWorking/createNewExperience',
    async (data) => {
        const response = await createExperienceWorking(data);
        return response;
    }
);

const initialState = {
    doctorExperiences: [],
    currentExperience: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const experienceWorkingSlice = createSlice({
    name: 'experienceWorking',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearCurrentExperience: (state) => {
            state.currentExperience = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch doctor experience
            .addCase(fetchDoctorExperience.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDoctorExperience.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.doctorExperiences = action.payload;
            })
            .addCase(fetchDoctorExperience.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Update doctor experience
            .addCase(updateDoctorExperience.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateDoctorExperience.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.doctorExperiences = action.payload;
            })
            .addCase(updateDoctorExperience.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Fetch single experience
            .addCase(fetchExperienceById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchExperienceById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentExperience = action.payload;
            })
            .addCase(fetchExperienceById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Update single experience
            .addCase(updateExperienceById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateExperienceById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentExperience = action.payload;
                const index = state.doctorExperiences.findIndex(exp => exp.id === action.payload.id);
                if (index !== -1) {
                    state.doctorExperiences[index] = action.payload;
                }
            })
            .addCase(updateExperienceById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Delete experience
            .addCase(deleteExperienceById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteExperienceById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.doctorExperiences = state.doctorExperiences.filter(exp => exp.id !== action.payload);
                if (state.currentExperience?.id === action.payload) {
                    state.currentExperience = null;
                }
            })
            .addCase(deleteExperienceById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Create new experience
            .addCase(createNewExperience.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNewExperience.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.doctorExperiences.push(action.payload);
                state.currentExperience = action.payload;
            })
            .addCase(createNewExperience.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { resetStatus, clearCurrentExperience } = experienceWorkingSlice.actions;
export default experienceWorkingSlice.reducer; 