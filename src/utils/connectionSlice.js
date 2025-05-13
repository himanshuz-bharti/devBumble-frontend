import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name:'connections',
    initialState:[],
    reducers:{
        addconnection:(state,action)=>{
            return action.payload;
        },
        removeconnection:(state,action)=>{
            return null;
        },
        addsingleconnection:(state,action)=>{
            state.push(action.payload);
        }
    }
})
export const {addconnection,removeconnection,addsingleconnection} = connectionSlice.actions;
export default connectionSlice.reducer;