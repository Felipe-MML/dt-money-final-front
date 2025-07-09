import { ITransaction, ITransactionResponse } from "@/types/transaction";
import { api } from "../api";
import { toast } from "react-toastify";
import { QueryFunctionContext } from "@tanstack/react-query";

export async function getTransactions(
  ctx: QueryFunctionContext<readonly [string, number, number]>
): Promise<ITransactionResponse> {
  const [_key, skip, take] = ctx.queryKey;

  const response = await api.get("/transaction", {
    params: { skip, take },
  });

  return response.data;
}
export async function createTransaction(transaction: ITransaction) {
  try {
    const response = await api.post("/transaction", transaction);
    toast.success("Transação adicionada com sucesso!");
    return response.data;
  } catch (error) {
    toast.error("Erro ao criar transação.");
  }
}

export async function updateTransaction({
  id,
  data,
}: {
  id: string | undefined;
  data: Partial<ITransaction>;
}) {
  if (!id) {
    toast.error("ID da transação não encontrado.");
    return;
  }
  try {
    const response = await api.patch(`/transaction/${id}`, data);
    toast.success("Transação atualizada com sucesso");
    return response.data;
  } catch (error) {
    toast.error("Erro ao atualizar transação");
  }
}

export async function deleteTransaction(id: string | undefined) {
  if (!id) {
    toast.error("ID da transação não encontrado.");
    return;
  }
  try {
    await api.delete(`/transaction/${id}`);
    toast.success("Transação deletada com sucesso!");
  } catch (error) {
    toast.error("Erro ao deletar a transação.");
  }
}
