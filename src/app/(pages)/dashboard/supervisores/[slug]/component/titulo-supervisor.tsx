"use client";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import {
  reducer,
  initialState,
  ACTION_TYPES,
} from "@/shared/hooks/useEditSupervisor";
import { ErrorHandlerAdapter } from "@/presentation/adapters";
import { Pen, Save } from "lucide-react";
import React, { useReducer } from "react";

interface TituloSupervisorProps {
  title: string;
  name: string;
}
export const TituloSupervisor: React.FC<TituloSupervisorProps> = ({
  title,
  name,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    editableName: name,
  });

  const updateSupervisor = async () => {
    try {
      const fecth = new FetchHttpClient();
      const dadaForm = {
        novoNomeDoSupevisor: state.editableName,
        nomeDoSupervisor: name,
      };
      await fecth.patch(`/api/v1/management/supervisores/editar`, dadaForm);

      dispatch({ type: ACTION_TYPES.SET_SAVE, payload: state.editableName });
    } catch (error) {
      const errorAdapter = new ErrorHandlerAdapter();
      return errorAdapter.handle(error);
    }
  };

  return (
    <span
      title={title}
      className="bg-card-foreground/10 p-3 rounded-md hover:bg-card-foreground/15 transition-all flex gap-2 items-center"
    >
      <h2>Supervisor</h2>
      <div className="flex gap-2 justify-center items-center">
        {state.isEditing ? (
          <>
            <input
              type="text"
              value={state.editableName}
              onChange={(e) =>
                dispatch({
                  type: ACTION_TYPES.SET_NAME,
                  payload: e.target.value,
                })
              }
              className="bg-background/15 p-1 rounded-sm"
              autoFocus
              aria-label="Edit supervisor name"
            />
            <Save
              className="ml-auto h-4 w-4 opacity-50 cursor-pointer"
              onClick={updateSupervisor}
            />
          </>
        ) : (
          <>
            <span className="bg-background/15 p-1 rounded-sm">{` ${state.editableName}`}</span>
            <Pen
              className="ml-auto h-4 w-4 opacity-50 cursor-pointer"
              onClick={() => dispatch({ type: ACTION_TYPES.SET_EDIT })}
            />
          </>
        )}
      </div>
    </span>
  );
};
