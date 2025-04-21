import { createSelector } from "@reduxjs/toolkit";

// Base selectors
export const selectCartState = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

// Memoized selectors for derived data
export const selectCartTotalAmount = createSelector(
  [selectCartState],
  (cart) => cart.totalAmount
);

export const selectCartTotalItems = createSelector(
  [selectCartState],
  (cart) => cart.totalItems
);

// Selector to get a specific cart item by productId
export const makeSelectCartItemById = () =>
  createSelector(
    [selectCartItems, (_, productId) => productId],
    (items, productId) => items.find((item) => item.productId._id === productId)
  );

// Selector to check if a specific item is loading
export const makeSelectIsItemLoading = () =>
  createSelector(
    [(state) => state.cart.itemsLoading || {}, (_, productId) => productId],
    (itemsLoading, productId) => !!itemsLoading[productId]
  );
