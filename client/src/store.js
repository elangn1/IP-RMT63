import { configureStore } from "@reduxjs/toolkit";
import planReducer from "./features/planSlice";
import quizReducer from "./features/quizSlice";

export const store = configureStore({
  reducer: {
    plan: planReducer,
    quiz: quizReducer
  }
});
