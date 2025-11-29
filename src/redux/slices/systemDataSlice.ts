import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {authLocalService} from "../../storageServices/authLocalService.ts";
import {hasValue} from "../../utils/hasValue.ts";

interface SystemDataState {
    username: string | null;
    isAuthorized: boolean;
}

const initialState: SystemDataState = {
    username: null,
    isAuthorized: hasValue(authLocalService.getToken()),
};

const systemDataSlice = createSlice({
    name: 'systemDataSlice',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<{ username: string; changePasswordRequired: boolean; token: string }>) => {
            state.username = action.payload.username;
            state.isAuthorized = true;
        },
        logoutUser: (state) => {
            state.username = null;
            state.isAuthorized = false;
        },
    },
});

export const { loginUser, logoutUser } = systemDataSlice.actions;
export default systemDataSlice.reducer;
