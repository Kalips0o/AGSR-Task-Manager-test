import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/shared/redux";
import {
  fetchLists,
  selectListById,
  selectTasksLoading,
  selectTasksError,
} from "@/shared/redux/slices/tasksSlice";

export function useListData(listId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector((state: RootState) => selectListById(state, listId));
  const isLoading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);

  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  return { list, isLoading, error };
}
