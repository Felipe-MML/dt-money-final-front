import { ITransaction } from "@/types/transaction";
import { api } from "../api";
import { toast } from "react-toastify";
import { QueryFunctionContext } from "@tanstack/react-query";

export async function getTransactions(
  ctx: QueryFunctionContext<readonly [string, number, number]>
) {
  const [_key, skip, take] = ctx.queryKey;

  const response = await api.get("/transaction", {
    params: { skip, take },
  });

  return {
    transactions: response.data.transactions,
    totalCount: response.data.totalCount,
  };
}

export async function createTransaction(transaction: ITransaction) {
  try {
    const response = await api.post("/transaction", transaction);
    toast.success("Transação adicionada com sucesso!");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao criar transação: " + error);
  }
}

export async function uptadeTransaction({
  id,
  data,
}: {
  id: string | undefined;
  data: Partial<ITransaction>;
}) {
  try {
    const response = await api.patch(`/transaction/${id}`, data);
    toast.success("Transação atualizada com sucesso");
    return response.data;
  } catch (error) {
    toast.error("Erro ao atualizar transação");
    throw error;
  }
}

export async function deleteTransaction(id: string | undefined) {
  try {
    await api.delete(`/transaction/${id}`);
    toast.success("Transação deletada com sucesso!");
  } catch (error) {
    throw new Error("Erro ao deletar a transação: " + error);
  }
}
