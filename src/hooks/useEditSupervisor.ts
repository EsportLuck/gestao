export const ACTION_TYPES = {
  SET_EDIT: "SET_EDIT",
  SET_SAVE: "SET_SAVE",
  SET_CANCEL: "SET_CANCEL",
  SET_NAME: "SET_NAME",
};
export const initialState = {
  isEditing: false,
  editableName: "",
};
export const reducer = (
  state: typeof initialState,
  action: { type: string; payload?: string },
) => {
  switch (action.type) {
    case ACTION_TYPES.SET_EDIT:
      return { ...state, isEditing: true };
    case ACTION_TYPES.SET_SAVE:
      return {
        ...state,
        isEditing: false,
        editableName: action.payload || state.editableName,
      };
    case ACTION_TYPES.SET_CANCEL:
      return { ...state, isEditing: false };
    case ACTION_TYPES.SET_NAME:
      return { ...state, editableName: action.payload || "" };
    default:
      return state;
  }
};
