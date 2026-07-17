// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// types
import { KanbanStateProps, KanbanColumn, KanbanComment, KanbanItem, KanbanUserStory, KanbanProfile } from 'types/kanban';
import { itemsData } from 'pages/api/kanban/items';
import { userStoryData } from 'pages/api/kanban/userstory';
import { columnsData } from 'pages/api/kanban/columns';
import { columnsOrderData } from 'pages/api/kanban/columns-order';
import { profilesData } from 'pages/api/kanban/profiles';
import { userStoryOrderData } from 'pages/api/kanban/userstory-order';
import { addColumnAPI, deleteColumnAPI, getColumnsAPI, getItemsAPI, getProfilesAPI, reorderItemsAPI } from 'services/kanban';
import { sub } from 'date-fns';

// ----------------------------------------------------------------------

const initialState: KanbanStateProps = {
  error: null,
  columns: [],
  columnsOrder: [],
  comments: [],
  items: [],
  profiles: [],
  selectedItem: false,
  userStory: [],
  userStoryOrder: []
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // ADD COLUMN
    addColumnSuccess(state, action) {
      state.columns = action.payload;
      // state.columnsOrder = action.payload.columnsOrder;
    },

    // EDIT COLUMN
    editColumnSuccess(state, action) {
      state.columns = action.payload.columns;
    },

    // UPDATE COLUMN ORDER
    updateColumnOrderSuccess(state, action) {
      state.columnsOrder = action.payload.columnsOrder;
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      state.columns = state.columns.filter(column => column.id !== action.payload);
      // state.columnsOrder = action.payload.columnsOrder;
    },

    // ADD ITEM
    addItemSuccess(state, action) {
      // state.items = action.payload;
      state.items = action.payload.items;
      state.columns = action.payload.columns;
      // state.userStory = action.payload.userStory;
    },

    // EDIT ITEM
    editItemSuccess(state, action) {
      state.items = action.payload.items;
      state.columns = action.payload.columns;
      state.userStory = action.payload.userStory;
    },

    // UPDATE COLUMN ITEM ORDER
    updateColumnItemOrderSuccess(state, action) {
      state.columns = action.payload;
    },

    // SELECT ITEM
    selectItemSuccess(state, action) {
      state.selectedItem = action.payload.selectedItem;
    },

    // ADD ITEM COMMENT
    addItemCommentSuccess(state, action) {
      state.items = action.payload.items;
      state.comments = action.payload.comments;
    },

    // DELETE ITEM
    deleteItemSuccess(state, action) {
      state.items = action.payload.items;
      state.columns = action.payload.columns;
      state.userStory = action.payload.userStory;
    },

    // ADD STORY
    addStorySuccess(state, action) {
      state.userStory = action.payload.userStory;
      state.userStoryOrder = action.payload.userStoryOrder;
    },

    // EDIT STORY
    editStorySuccess(state, action) {
      state.userStory = action.payload.userStory;
    },

    // UPDATE STORY ORDER
    updateStoryOrderSuccess(state, action) {
      state.userStoryOrder = action.payload.userStoryOrder;
    },

    // UPDATE STORY ITEM ORDER
    updateStoryItemOrderSuccess(state, action) {
      state.userStory = action.payload.userStory;
    },

    // ADD STORY COMMENT
    addStoryCommentSuccess(state, action) {
      state.userStory = action.payload.userStory;
      state.comments = action.payload.comments;
    },

    // DELETE STORY
    deleteStorySuccess(state, action) {
      state.userStory = action.payload.userStory;
      state.userStoryOrder = action.payload.userStoryOrder;
    },

    // GET COLUMNS
    getColumnsSuccess(state, action) {
      state.columns = action.payload;
    },

    // GET COLUMNS ORDER
    getColumnsOrderSuccess(state, action) {
      state.columnsOrder = action.payload;
    },

    // GET COMMENTS
    getCommentsSuccess(state, action) {
      state.comments = action.payload;
    },

    // GET PROFILES
    getProfilesSuccess(state, action) {
      state.profiles = action.payload;
    },

    // GET ITEMS
    getItemsSuccess(state, action) {
      console.log(state.items);
      
      state.items = action.payload;

      console.log(state.items);
      
    },

    // GET USER STORY
    getUserStorySuccess(state, action) {
      state.userStory = action.payload;
    },

    // GET USER STORY ORDER
    getUserStoryOrderSuccess(state, action) {
      state.userStoryOrder = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getColumns() {
  return async () => {
    try {
      const response = await getColumnsAPI();

      const columns = response.data.data.rows.map((column: any) => {
        const stringifiedItemIds = column.itemIds.map((itemId:any)=>String(itemId));

        return {...column, itemIds: stringifiedItemIds}
      });
      console.log(columns);
      
      // const response = await axios.get('/api/kanban/columns');
      dispatch(slice.actions.getColumnsSuccess(columns));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getColumnsOrder() {
  return async () => {
    try {
      const response = getColumnsOrder();
      // const response = await axios.get('/api/kanban/columns-order');
      dispatch(slice.actions.getColumnsOrderSuccess(columnsOrderData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getComments() {
  return async () => {
    try {
      // const response = getCommentsAPI();
      // const response = await axios.get('/api/kanban/comments');
      dispatch(slice.actions.getCommentsSuccess(columnsOrderData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProfiles() {
  return async () => {
    try {
      const response = await getProfilesAPI();
      // const response = await axios.get('/api/kanban/profiles');
      // profilesData = response.data;
      console.log(response);
      console.log(response.data);
      
      const updatedProfilesData = response.data.data.rows.map((profileData: any)=>{
        return {
          id: profileData.id,
          name: profileData.name,
          avatar: 'avatar-1.png',
          time: 'now'
        }
      }) as KanbanProfile[];
      
      console.log(updatedProfilesData);

      dispatch(slice.actions.getProfilesSuccess(updatedProfilesData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getItems() {
  return async () => {
    try {
      // TODO: the API response should match the itemsData
      const response = await getItemsAPI();
      console.log(response);
      console.log(itemsData);
      const updatedItemsData = response.data.data.rows.map((kanbanItem: any)=>{
        return {
          ...kanbanItem,
          // id: `${kanbanItem.id}`,
          attachments: [],
          commentIds: [],
          image: false,
          dueDate: kanbanItem.dueDate

        }
      });

      console.log(updatedItemsData);
      
      // const response = await axios.get('/api/kanban/items');
      dispatch(slice.actions.getItemsSuccess(updatedItemsData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUserStory() {
  return async () => {
    try {
      // const response = getUserStory();
      // const response = await axios.get('/api/kanban/userstory');
      dispatch(slice.actions.getUserStorySuccess(userStoryData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUserStoryOrder() {
  return async () => {
    try {
      // const response = getUserStoryOrder();
      // const response = await axios.get('/api/kanban/userstory-order');
      dispatch(slice.actions.getUserStoryOrderSuccess(userStoryOrderData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addColumn(column: KanbanColumn, columns: KanbanColumn[], columnsOrder: string[]) {
  return async () => {
    try {
      // const response = await axios.post('/api/kanban/add-column', { column, columns, columnsOrder });

      const response = await addColumnAPI(column);
      const updatedColumnsData = response.data.data.rows.map((column: any) => {
        const stringifiedItemIds = column.itemIds.map((itemId:any)=>String(itemId));

        return {...column, itemIds: stringifiedItemIds}
      });

      console.log(updatedColumnsData);
      dispatch(slice.actions.addColumnSuccess(updatedColumnsData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function editColumn(column: KanbanColumn, columns: KanbanColumn[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/edit-column', { column, columns });
      dispatch(slice.actions.editColumnSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateColumnOrder(columnsOrder: string[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/update-column-order', { columnsOrder });
      dispatch(slice.actions.updateColumnOrderSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteColumn(columnId: string, columnsOrder: string[], columns: KanbanColumn[]) {
  return async () => {
    try {
      const response = (await deleteColumnAPI(columnId)).data;

      dispatch(slice.actions.deleteColumnSuccess(columnId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addItem(
  columnId: string,
  columns: KanbanColumn[],
  item: KanbanItem,
  items: KanbanItem[],
  storyId: string,
  userStory: KanbanUserStory[]
) {
  return async () => {
    try {
      // const response = await axios.post('/api/kanban/add-item', { columnId, columns, item, items, storyId, userStory });
      const response = await axios.post('/api/v3/kanban/add-item/', { columnId, columns, item, items, storyId, userStory });
      
      // TODO: the API response should match the itemsData
      console.log(response);
      console.log(itemsData);
      const updatedItemsData = response.data.data.items.rows.map((kanbanItem: any)=>{
        return {
          ...kanbanItem,
          id: `${kanbanItem.id}`,
          attachments: [],
          commentIds: [],
          image: false,
          dueDate: kanbanItem.dueDate
        }
      });


      const updatedColumnsData = response.data.data.columns.rows.map((column: any) => {
        const stringifiedItemIds = column.itemIds.map((itemId:any)=>String(itemId));

        return {...column, itemIds: stringifiedItemIds}
      });

      console.log(updatedItemsData);
      dispatch(slice.actions.addItemSuccess({
        items: updatedItemsData,
        columns: updatedColumnsData
      }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function editItem(
  columnId: string,
  columns: KanbanColumn[],
  item: KanbanItem,
  items: KanbanItem[],
  storyId: string,
  userStory: KanbanUserStory[]
) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/edit-item', { items, item, userStory, storyId, columns, columnId });
      dispatch(slice.actions.editItemSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateColumnItemOrder(columns: KanbanColumn[]) {
  return async () => {
    try {
      const response = await reorderItemsAPI(columns);
      const updatedColumnsData = response.data.data.rows.map((column: any) => {
        const stringifiedItemIds = column.itemIds.map((itemId:any)=>String(itemId));

        return {...column, itemIds: stringifiedItemIds}
      });
      console.log(updatedColumnsData);
      dispatch(slice.actions.updateColumnItemOrderSuccess(updatedColumnsData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function selectItem(selectedItem: string | false) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/select-item', { selectedItem });
      dispatch(slice.actions.selectItemSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addItemComment(itemId: string | false, comment: KanbanComment, items: KanbanItem[], comments: KanbanComment[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/add-item-comment', { items, itemId, comment, comments });
      dispatch(slice.actions.addItemCommentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteItem(itemId: string | false, items: KanbanItem[], columns: KanbanColumn[], userStory: KanbanUserStory[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/delete-item', { columns, itemId, userStory, items });
      dispatch(slice.actions.deleteItemSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addStory(story: any, userStory: KanbanUserStory[], userStoryOrder: string[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/add-story', { userStory, story, userStoryOrder });
      dispatch(slice.actions.addStorySuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function editStory(story: KanbanUserStory, userStory: KanbanUserStory[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/edit-story', { userStory, story });
      dispatch(slice.actions.editStorySuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateStoryOrder(userStoryOrder: string[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/update-story-order', { userStoryOrder });
      dispatch(slice.actions.updateStoryOrderSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateStoryItemOrder(userStory: KanbanUserStory[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/update-storyitem-order', { userStory });
      dispatch(slice.actions.updateStoryItemOrderSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addStoryComment(storyId: string, comment: KanbanComment, comments: KanbanComment[], userStory: KanbanUserStory[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/add-story-comment', { userStory, storyId, comment, comments });
      dispatch(slice.actions.addStoryCommentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteStory(storyId: string, userStory: KanbanUserStory[], userStoryOrder: string[]) {
  return async () => {
    try {
      const response = await axios.post('/api/kanban/delete-story', { userStory, storyId, userStoryOrder });
      dispatch(slice.actions.deleteStorySuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
