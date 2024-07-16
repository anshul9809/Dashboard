import { createSlice } from "@reduxjs/toolkit"
import axios from "axios";
const userSlice = createSlice({
    name: "user",
    initialState:{
        loading:false,
        user:{},
        isAuthenticated:false,
        error:null,
        message:null,
        isUpdated:false
    },
    reducers:{
        loginRequest(state,action){
            state.loading=true;
            state.user = {};
            state.isAuthenticated=false;
            state.error = null
        },
        loginRequestSuccess(state,action){
            state.loading=false;
            state.user = action.payload;
            state.isAuthenticated=true;
            state.error = null
        },
        loginRequestFailed(state,action){
            state.loading=false;
            state.user = {};
            state.isAuthenticated=false;
            state.error = action.payload
        },
        loadUserRequest(state, action) {
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {};
            state.error = null;
        },
        loadUserSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        loadUserFailed(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {};
            state.error = action.payload;
        },
        logoutSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {};
            state.error = null;
            state.message = action.payload;
        },
        logoutFailed(state, action) {
            state.loading = false;
            state.isAuthenticated = state.isAuthenticated;
            state.user = state.user;
            state.error = action.payload;
        },    
        updatePasswordRequest(state, action) {
            state.loading = true;
            state.isUpdated = false;
            state.message = null;
            state.error = null;
        },
        updatePasswordSuccess(state, action) {
            state.loading = false;
            state.isUpdated = true;
            state.message = action.payload;
            state.error = null;
        },
        updatePasswordFailed(state, action) {
            state.loading = false;
            state.isUpdated = false;
            state.message = null;
            state.error = action.payload;
        },
        updateProfileRequest(state, action) {
            state.loading = true;
            state.isUpdated = false;
            state.message = null;
            state.error = null;
        },
        updateProfileSuccess(state, action) {
            state.loading = false;
            state.isUpdated = true;
            state.message = action.payload;
            state.error = null;
        },
        updateProfileFailed(state, action) {
            state.loading = false;
            state.isUpdated = false;
            state.message = null;
            state.error = action.payload;
        },
        updateProfileResetAfterUpdate(state, action) {
            state.error = null;
            state.isUpdated = false;
            state.message = null;
        },
        clearAllErrors(state, action) {
          state.error = null;
          state = state.user;
        },
    },
});

export const clearAllUserErrors = ()=>(dispatch)=>{
    dispatch(userSlice.actions.clearAllErrors())
}

export const login = (email,password)=> async (dispatch)=>{
    dispatch(userSlice.actions.loginRequest());
    try{
        const {data} = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}user/login`,
            {email,password},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        dispatch(userSlice.actions.loginRequestSuccess(data));
        dispatch(userSlice.actions.clearAllErrors());

    }catch(error){
        dispatch(userSlice.actions.loginRequestFailed(error.response.data.message));
    }
}

export const getUser = ()=> async (dispatch)=>{
    dispatch(userSlice.actions.loadUserRequest());
    try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}user/profile`
            , {
        withCredentials: true,
        });
        dispatch(userSlice.actions.loadUserSuccess(data.user));
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.loadUserFailed(error.response.data.message));
    }
}

export const logout = ()=> async (dispatch)=>{
    try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}user/logout`,
          { withCredentials: true }
        );
        dispatch(userSlice.actions.logoutSuccess(data.message));
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.logoutFailed(error.response.data.message));
    }
}

export const updatePassword =
  (currentPassword, newPassword, confirmPassword) => async (dispatch) => {
    dispatch(userSlice.actions.updatePasswordRequest());
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}user/updatePassword`,
        { currentPassword, newPassword, confirmPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(userSlice.actions.updatePasswordSuccess(data.message));
      dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        userSlice.actions.updatePasswordFailed(error.response.data.message)
      );
    }
};

export const updateProfile = (data) => async (dispatch) => {
    dispatch(userSlice.actions.updateProfileRequest());
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}user/update`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      dispatch(userSlice.actions.updateProfileSuccess(response.data.message));
      dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        userSlice.actions.updateProfileFailed(error.response.data.message)
      );
    }
};

export const resetProfile = () => (dispatch) => {
    dispatch(userSlice.actions.updateProfileResetAfterUpdate());
};



export default userSlice.reducer;