import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../app/store';
import { LOCAL_REST_API_URL } from '../../../lib/constants';
import { Workspace, BoardCredentials, BoardList, BoardTask } from '../../../lib/models';
import { UpdateTask } from '../../../lib/models/board';

export const workspaceApi = createApi({
  reducerPath: 'workspaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: LOCAL_REST_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserWorkspaces: builder.query<Workspace[], string>({
      query: () => `/workspaces`,
    }),
    getWorkspace: builder.query<Workspace, string>({
      query: (id) => `/workspaces/${id}`,
    }),
    createWorkspace: builder.mutation<Workspace, Omit<Workspace, '_id'>>({
      query: (body) => ({
        url: `/workspaces`,
        method: 'POST',
        body,
      }),
    }),

    deleteWorkspace: builder.mutation<void, string>({
      query: (id) => ({
        url: `/workspaces/${id}`,
        method: 'DELETE',
      }),
    }),

    // Board endpoints here
    createBoard: builder.mutation<void, Omit<BoardCredentials, '_id'>>({
      query: (body) => {
        return {
          url: `/boards`,
          method: 'POST',
          body: body,
        };
      },
    }),
    updateBoard: builder.mutation<
      void,
      { id: string; workspaceId: string; data: Partial<Omit<BoardCredentials, '_id'>> }
    >({
      query: (body) => {
        return {
          url: `/boards/${body.id}`,
          method: 'PATCH',
          body: body.data,
          params: {
            where: {
              id: body.id,
            },
          },
        };
      },
    }),
    deleteBoard: builder.mutation<void, BoardCredentials>({
      query: (body) => {
        return {
          url: `/boards/${body._id}`,
          method: 'DELETE',
        };
      },
    }),
    getBoards: builder.query<BoardCredentials[], string>({
      query: () => `/boards`,
    }),
    getBoardById: builder.query<BoardCredentials, { boardId: string }>({
      query: ({ boardId }) => `/boards/${boardId}`,
    }),

    // BoardList endpoints here
    updateBoardList: builder.mutation<
      BoardCredentials,
      {
        boardId: string;
        lists: BoardCredentials['lists'];
      }
    >({
      query: (body) => {
        const { boardId, lists } = body;
        return {
          url: `/boards/${boardId}/lists`,
          method: 'PATCH',
          body: lists,
        };
      },
    }),

    createBoardList: builder.mutation<BoardCredentials[], { list: Omit<BoardList, '_id'>; boardId: string }>({
      query: (body) => {
        const { list, boardId } = body;
        return {
          url: `/boards/${boardId}/lists`,
          method: 'POST',
          body: list,
        };
      },
    }),

    deleteBoardList: builder.mutation<BoardCredentials, { listId: string; boardId: string }>({
      query: ({ listId, boardId }) => {
        return {
          url: `/boards/${boardId}/lists/${listId}`,
          method: 'DELETE',
        };
      },
    }),

    // Task endpoints here
    createTask: builder.mutation<
      BoardCredentials,
      {
        listId: string;
        boardId: string;
        task: Omit<BoardTask, '_id'>;
      }
    >({
      query: (body) => {
        const { listId, boardId, task } = body;
        return {
          url: `/boards/${boardId}/lists/${listId}/tasks`,
          method: 'POST',
          body: task,
        };
      },
    }),

    getTaskById: builder.query<BoardTask, { boardId: string; taskId: string }>({
      query: ({ boardId, taskId }) => `/boards/${boardId}/tasks/${taskId}`,
    }),

    updateTask: builder.mutation<
      BoardTask,
      {
        boardId: string;
        taskId: string;
        data: UpdateTask;
      }
    >({
      query: (body) => {
        const { boardId, taskId, data } = body;
        return {
          url: `/boards/${boardId}/tasks/${taskId}`,
          method: 'PATCH',
          body: data,
        };
      },
    }),

    deleteTask: builder.mutation<
      BoardCredentials,
      {
        listId: string;
        boardId: string;
        taskId: string;
      }
    >({
      query: (body) => {
        const { listId, boardId, taskId } = body;
        return {
          url: `/boards/${boardId}/lists/${listId}/tasks/${taskId}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

// export workspace endpoints
export const {
  useCreateWorkspaceMutation,
  useGetWorkspaceQuery,
  useGetUserWorkspacesQuery,
  useDeleteWorkspaceMutation,
} = workspaceApi;

// expprt board endpoints
export const {
  useGetBoardByIdQuery,
  useGetBoardsQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useUpdateBoardListMutation,
  useCreateBoardListMutation,
  useDeleteBoardListMutation,
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = workspaceApi;
