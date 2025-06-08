import api from "../../config/api"

export const login = async (credentials) => {
    try {
        const response = await api.post("/api/Auth/login", {
            email: credentials.email,
            password: credentials.password,
        })
        return response ? response.data : null
    } catch (error) {
        console.error('Auth service error:', error)
        throw error 
    }
}
export const logout = async () => {
    const response = await api.post("Auth/logout")
    return response ? response.data : null;
}
