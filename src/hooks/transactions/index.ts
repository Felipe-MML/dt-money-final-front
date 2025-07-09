import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "@/services/transactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ITransactionResponse } from "@/types/transaction";

const QUERY_KEY = "qkTransaction";

const Create = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const ListAll = (skip = 0, take = 10) => {
  return useQuery<ITransactionResponse>({
    queryKey: [QUERY_KEY, skip, take],
    queryFn: getTransactions,
    placeholderData: (previousData) => previousData,
  });
};

const Update = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const Delete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useTransaction = {
  Create,
  ListAll,
  Delete,
  Update,
};
