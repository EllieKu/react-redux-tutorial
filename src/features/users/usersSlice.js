import { createSlice } from "@reduxjs/toolkit"

const initialState = [
  { id: '0', name: 'user 1'},
  { id: '1', name: 'user 2'},
  { id: '2', name: 'user 3'},
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
})

export const selectAllUsers = state => state.users

export default usersSlice.reducer
