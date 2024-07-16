import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import messageReducer from "./slices/messageSlice";
import forgotPasswordReducer from "./slices/forgotPasswordResetSlice";
import timelineReducer from "./slices/timelineSlice";
import skillReducer from "./slices/skillSlice";
import softwareApplicationReducer from "./slices/softwareApplicationSlice";
import projectReducer from "./slices/projectSlice";

export const store = configureStore({
    reducer:{
        user: userReducer,
        softwareApplications: softwareApplicationReducer,
        forgotPassword: forgotPasswordReducer,
        messages: messageReducer,
        timeline: timelineReducer,
        skill:skillReducer,
        project: projectReducer,
        
    }
});