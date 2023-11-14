import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createShortLink, getShortlinks } from "./actions";

const keys = {
  getShortlinks: ["shortlinks"],
};

export function useGetShortlinks() {
  return useQuery({
    queryFn: async () => getShortlinks(),
    queryKey: keys.getShortlinks,
  });
}

export function useCreateShortlink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShortLink,
    //onMutate: async (data) => {},
    onSuccess: () => {
      // invalidate query after inserting new record
      queryClient.invalidateQueries({ queryKey: keys.getShortlinks });
    },
  });
}
