import axios from "axios"

// const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_URL

const REGISTER_URL = `/api/auth/users/`
// const LOGIN_URL = `/api/auth/jwt/create/`
const LOGIN_URL = `/api/auth/jwt/create/`
const ACTIVATE_URL = `/api/auth/users/activation/`
const RESET_PASSWORD_URL = `/api/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `/api/auth/users/reset_password_confirm/`
const GET_USER_INFO = `/api/auth/users/me/`


const register = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    const response = await axios.post(REGISTER_URL, userData, config)

    return response.data
}

// Login user

const login = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(LOGIN_URL, userData, config)

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

// Logout 

const logout = () => {
    return localStorage.removeItem("user")
}

// Activate user

const activate = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(ACTIVATE_URL, userData, config)

    return response.data
}

// Reset Password

const resetPassword = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_URL, userData, config)

    return response.data
}

// Reset Password

const resetPasswordConfirm = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config)

    return response.data
}

// Get User Info

const getUserInfo = async (accessToken) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

    const response = await axios.get(GET_USER_INFO, config)

    return response.data
}



const authService = { register, login, logout, activate, resetPassword, resetPasswordConfirm, getUserInfo }

export default authService