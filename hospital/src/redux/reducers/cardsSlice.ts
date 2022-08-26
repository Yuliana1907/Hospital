import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICard, ICardsState } from '../types/cardsTypes'

const initialState: ICardsState = {
  cards: [],
  isLoading: false,
  isLoaded: false,
  error: null
}

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    loading(state: ICardsState) {
      state.isLoading = true
      state.error = null
    },
    loadingSuccess(state: ICardsState, action: PayloadAction<ICard[]>) {
      state.isLoading = false
      state.cards = action.payload
    },
    finish(state: ICardsState) {
      state.isLoading = false
    },
    error(state: ICardsState, action: PayloadAction<{ error: ICardsState['error'] }>) {
      const { error } = action.payload
      state.error = error.response.data
    }
  }
})

export default cardsSlice.reducer
export const { loading, loadingSuccess, finish, error } = cardsSlice.actions
