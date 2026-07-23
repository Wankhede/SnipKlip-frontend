import axiosServices from 'utils/axios';
import { KanbanColumn, KanbanComment, KanbanItem, KanbanUserStory } from 'types/kanban';

export const addColumnAPI = (column: KanbanColumn) => {
  return axiosServices({
    method: 'POST',
    data: {column},
    url: '/api/v3/kanban/add-column/',
  });
};

export const getColumnsAPI = () => {
  return axiosServices({
    method: 'POST',
    url: '/api/v3/kanban/columns/',
  });
};

export const editColumnAPI = (column: KanbanColumn) => {
  return axiosServices({
    method: 'PUT',
    data: column,
    url: `/api/v3/kanban/columns/${column.id}/`,
  });
};

export const deleteColumnAPI = (columnId: string) => {
  return axiosServices({
    method: 'DELETE',
    url: `/api/v3/kanban/columns/${parseInt(columnId)}/`,
  });
};

export const addCommentAPI = (comment: KanbanComment) => {
  return axiosServices({
    method: 'POST',
    data: comment,
    url: '/api/v3/kanban/comments/',
  });
};

export const addCommentToItemAPI = (itemId: string, comment: KanbanComment) => {
  return axiosServices({
    method: 'POST',
    data: comment,
    url: `/api/v3/kanban/items/${itemId}/comments/`,
  });
};

export const getCommentsAPI = () => {
  return axiosServices({
    method: 'GET',
    url: '/api/v3/kanban/comments/',
  });
};

export const addProfileAPI = (profile: string) => {
  return axiosServices({
    method: 'POST',
    data: profile,
    url: '/api/v3/kanban/profiles/',
  });
};

export const addProfileToItemAPI = (itemId: string, profileId: string) => {
  return axiosServices({
    method: 'POST',
    data: { profileId },
    url: `/api/v3/kanban/items/${itemId}/profiles/`,
  });
};

export const getProfilesAPI = () => {
  return axiosServices({
    method: 'POST',
    url: '/api/v3/kanban/profiles/',
  });
};

export const getItemsAPI = () => {
  return axiosServices({
    method: 'POST',
    url: '/api/v3/kanban/items/',
  });
};

export const addItemAPI = (item: string) => {
  return axiosServices({
    method: 'POST',
    data: item,
    url: '/api/v3/kanban/items/add/',
  });
};

export const editItemAPI = (item: any) => {
  return axiosServices({
    method: 'PUT',
    data: item,
    url: `/api/v3/kanban/items/${item.id}/`,
  });
};

export const deleteItemAPI = (itemId: string) => {
  return axiosServices({
    method: 'DELETE',
    url: `/api/v3/kanban/items/${itemId}/`,
  });
};

export const reorderItemsAPI = (columns: KanbanColumn[]) => {
  return axiosServices({
    method: 'PUT',
    data: {columns},
    url: `/api/v3/kanban/reorder-items/`,
  });
};


export const addStoryAPI = (story: string) => {
  return axiosServices({
    method: 'POST',
    data: story,
    url: '/api/v3/kanban/userstory/',
  });
};

export const editStoryAPI = (story: any) => {
  return axiosServices({
    method: 'PUT',
    data: story,
    url: `/api/v3/kanban/userstory/${story.id}/`,
  });
};

export const deleteStoryAPI = (storyId: string) => {
  return axiosServices({
    method: 'DELETE',
    url: `/api/v3/kanban/userstory/${storyId}/`,
  });
};
