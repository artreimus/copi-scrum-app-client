import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const boardsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return a.title === b.title ? 0 : a.title ? 1 : -1;
  },
});

const initialState = boardsAdapter.getInitialState();

export const boardsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBoards: builder.query({
      query: () => ({
        url: '/boards',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        // ensure responseData is an array
        const loadednotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return boardsAdapter.setAll(initialState, loadednotes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Board', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Board', id })),
          ];
        } else return [{ type: 'Board', id: 'LIST' }];
      },
    }),
    getSingleBoard: builder.query({
      query: (boardId) => ({
        url: `/boards/${boardId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, arg) => {
        return [{ type: 'Board', id: arg.id }];
      },
    }),
    addNewBoard: builder.mutation({
      query: (board) => ({
        url: '/boards',
        method: 'POST',
        body: {
          ...board,
        },
      }),
      invalidatesTags: [{ type: 'Board', id: 'LIST' }],
    }),
    updateBoard: builder.mutation({
      query: ({ boardId, board }) => ({
        url: `/boards/${boardId}`,
        method: 'PATCH',
        body: {
          ...board,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Board', id: arg.id }],
    }),
    updateBoardAdmins: builder.mutation({
      query: ({ boardId, admins }) => ({
        url: `/boards/${boardId}/updateBoardAdmins`,
        method: 'PATCH',
        body: {
          admins,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Board', id: arg.id }],
    }),
    updateBoardUsers: builder.mutation({
      query: ({ boardId, users }) => ({
        url: `/boards/${boardId}/updateBoardUsers`,
        method: 'PATCH',
        body: {
          users,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Board', id: arg.id }],
    }),
    deleteBoard: builder.mutation({
      query: (boardId) => ({
        url: `/boards/${boardId}`,
        method: 'DELETE',
        body: { id: boardId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Board', id: arg.id }],
    }),
    accessBoard: builder.mutation({
      query: ({ boardId, credentials }) => ({
        url: `/boards/${boardId}/accessBoard`,
        method: 'POST',
        body: { ...credentials },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Board', id: arg.id }],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useGetSingleBoardQuery,
  useAddNewBoardMutation,
  useUpdateBoardMutation,
  useUpdateBoardAdminsMutation,
  useUpdateBoardUsersMutation,
  useDeleteBoardMutation,
  useAccessBoardMutation,
} = boardsApiSlice;

// returns the query result object
export const selectBoardsResult = boardsApiSlice.endpoints.getBoards.select();

// creates memoized selector
const selectBoardsData = createSelector(
  selectBoardsResult,
  (boardsResult) => boardsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllBoards,
  selectById: selectBoardById,
  selectIds: selectBoardIds,
  // Pass in a selector that returns the notes slice of state
} = boardsAdapter.getSelectors(
  (state) => selectBoardsData(state) ?? initialState
);
