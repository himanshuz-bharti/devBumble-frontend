import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name:"requests",
    initialState:null,
    reducers:{
        addRequest:(state,action)=>{
            return action.payload;
        },
        removeRequest:(state,action)=>{
            state = state.filter((req)=>req.id!== action.payload);
            return state;
        }
    }
});
export const {addRequest,removeRequest} = requestSlice.actions;
export default requestSlice.reducer;