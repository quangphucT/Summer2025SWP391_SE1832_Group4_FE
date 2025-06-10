import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAllCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getCertificateById,
} from '../../apis/doctorApi/certificateApi';

// Async thunks
export const fetchCertificates = createAsyncThunk(
    'certificates/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllCertificates();
            // Handle paginated response format
            if (response?.data?.data?.rowDatas) {
                const { data } = response.data;
                // Update pagination info
                const paginationInfo = {
                    current: data.pageCurrent || 1,
                    pageSize: data.pageSize || 10,
                    total: data.total || 0
                };
                
                // Map the rowDatas to match our component's expected format
                const formattedData = data.rowDatas.map(item => ({
                    id: item.certificateId,
                    key: `cert-${item.certificateId}`,
                    title: item.title,
                    description: item.description,
                    issuedDate: item.issuedDate,
                    issuedBy: item.issuedBy,
                    doctorName: item.doctorName,
                    doctor: item.doctor
                }));

                return {
                    items: formattedData,
                    pagination: paginationInfo
                };
            }
            
            console.warn("[API] Unexpected format in getAllCertificates:", response);
            return {
                items: [],
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 0
                }
            };
        } catch (error) {
            console.error("[API] Error fetching certificates:", error);
            return rejectWithValue(error.message || "Could not fetch certificates. Please try again later.");
        }
    }
);

export const fetchCertificateById = createAsyncThunk(
    'certificates/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await getCertificateById(id);
            return response?.data || response;
        } catch (error) {
            return rejectWithValue(error.message || "Could not fetch certificate details.");
        }
    }
);

export const createNewCertificate = createAsyncThunk(
    'certificates/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await createCertificate(data);
            return response?.data || response;
        } catch (error) {
            return rejectWithValue(error.message || "Could not create certificate.");
        }
    }
);

export const updateCertificateById = createAsyncThunk(
    'certificates/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateCertificate(id, data);
            return response?.data || response;
        } catch (error) {
            return rejectWithValue(error.message || "Could not update certificate.");
        }
    }
);

export const deleteCertificateById = createAsyncThunk(
    'certificates/delete',
    async (id, { rejectWithValue }) => {
        try {
            await deleteCertificate(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Could not delete certificate.");
        }
    }
);

const initialState = {
    certificates: [],
    currentCertificate: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    isLoading: false,
    pagination: {
        current: 1,
        pageSize: 10,
        total: 0
    }
};

const certificateSlice = createSlice({
    name: 'certificates',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearCurrentCertificate: (state) => {
            state.currentCertificate = null;
        },
        setPagination: (state, action) => {
            state.pagination = {
                ...state.pagination,
                ...action.payload
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all certificates
            .addCase(fetchCertificates.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCertificates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.certificates = action.payload.items;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchCertificates.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch certificates";
                state.certificates = [];
            })

            // Fetch single certificate
            .addCase(fetchCertificateById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCertificateById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.currentCertificate = action.payload;
                state.error = null;
            })
            .addCase(fetchCertificateById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
                state.currentCertificate = null;
            })

            // Create new certificate
            .addCase(createNewCertificate.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createNewCertificate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                if (action.payload) {
                    const newCertificate = {
                        ...action.payload,
                        key: action.payload.id || `cert-${Math.random()}`
                    };
                    state.certificates.push(newCertificate);
                    state.currentCertificate = newCertificate;
                }
                state.error = null;
            })
            .addCase(createNewCertificate.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Update certificate
            .addCase(updateCertificateById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCertificateById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                if (action.payload) {
                    const updatedCertificate = {
                        ...action.payload,
                        key: action.payload.id || `cert-${Math.random()}`
                    };
                    state.currentCertificate = updatedCertificate;
                    const index = state.certificates.findIndex(cert => cert.id === updatedCertificate.id);
                    if (index !== -1) {
                        state.certificates[index] = updatedCertificate;
                    }
                }
                state.error = null;
            })
            .addCase(updateCertificateById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Delete certificate
            .addCase(deleteCertificateById.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCertificateById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.certificates = state.certificates.filter(cert => cert.id !== action.payload);
                if (state.currentCertificate?.id === action.payload) {
                    state.currentCertificate = null;
                }
                state.error = null;
            })
            .addCase(deleteCertificateById.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { resetStatus, clearCurrentCertificate, setPagination } = certificateSlice.actions;
export default certificateSlice.reducer; 