import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {authLocalService} from "../../storageServices/authLocalService.ts";
import {hasValue} from "../../utils/hasValue.ts";

interface SystemDataState {
    username: string | null;
    isAuthorized: boolean;
    isSignalRConnected: boolean;
}

const initialState: SystemDataState = {
    username: null,
    isAuthorized: hasValue(authLocalService.getToken()),
    isSignalRConnected: false,
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
            state.isSignalRConnected = false;
        },
        setSignalRConnected: (state, action: PayloadAction<boolean>) => {
            state.isSignalRConnected = action.payload;
        },
    },
});

export const { loginUser, logoutUser, setSignalRConnected } = systemDataSlice.actions;
export default systemDataSlice.reducer;
