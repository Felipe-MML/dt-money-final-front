"use client";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { DeleteModal } from "@/components/deleteModal";
import { EditModal } from "@/components/EditModal";
import { Header } from "@/components/Header";
import { Spinner } from "@/components/Spinner";
import { Table } from "@/components/Table";
import { useTransaction } from "@/hooks/transactions";
import { ITransaction, ITotal } from "@/types/transaction";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { mutateAsync: addTransaction } = useTransaction.Create();
  const { mutate: deleteTransaction } = useTransaction.Delete();
  const { mutateAsync: updateTransaction } = useTransaction.Update();

  const [transactionToDelete, setTransactionToDelete] = useState<
    string | undefined
  >(undefined);
  const [transactionToEdit, setTransactionToEdit] = useState<
    ITransaction | undefined
  >(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const skip = (currentPage - 1) * itemsPerPage;

  const {
    data: transactionData,
    isLoading,
    isFetching,
  } = useTransaction.ListAll(skip, itemsPerPage);

  const transactions = transactionData?.transactions ?? [];
  const totalCount = transactionData?.totalCount ?? 0;

  const totalTransactions: ITotal = {
    totalIncome: transactionData?.totalIncome ?? 0,
    totalOutcome: transactionData?.totalOutcome ?? 0,
    total: transactionData?.total ?? 0,
  };

  const openModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const openDeleteModal = (id: string | undefined) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openEditModal = (transaction: ITransaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  // MELHORIA: Ação agora espera a conclusão antes de fechar o modal
  const handleAddModal = async (newTransaction: ITransaction) => {
    await addTransaction(newTransaction);
    handleCloseModal();
  };

  const handleDeleteModal = (id: string | undefined) => {
    deleteTransaction(id);
    closeDeleteModal();
  };

  const handleEditModal = async (id: string, data: Partial<ITransaction>) => {
    await updateTransaction({ id, data });
    closeEditModal();
  };

  // MELHORIA: Exibe um spinner centralizado durante o carregamento inicial
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <Header openModal={openModal} />
      <BodyContainer>
        <CardContainer totals={totalTransactions} />
        <Table
          data={transactions}
          openDeleteModal={openDeleteModal}
          openEditModal={openEditModal}
        />
        {isDeleteModalOpen && (
          <DeleteModal
            closeDeleteModal={closeDeleteModal}
            deleteTransaction={handleDeleteModal}
            transactionID={transactionToDelete}
          />
        )}
        {isEditModalOpen && transactionToEdit && (
          <EditModal
            closeModal={closeEditModal}
            formTitle="Editar Transação"
            transaction={transactionToEdit}
            onSubmit={handleEditModal}
          />
        )}
        {isModalOpen && (
          <FormModal
            closeModal={handleCloseModal}
            formTitle="Adicionar Transação"
            addTransaction={handleAddModal}
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isFetching} // Desabilitado durante a busca
            className="bg-purple-500 hover:bg-purple-700 active:bg-purple-800 rounded-md p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span style={{ margin: "0 10px" }}>Página {currentPage}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(totalCount / itemsPerPage) ? prev + 1 : prev
              )
            }
            disabled={
              currentPage >= Math.ceil(totalCount / itemsPerPage) || isFetching
            } // Desabilitado durante a busca
            className="bg-purple-500 hover:bg-purple-700 active:bg-purple-800 rounded-md p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      </BodyContainer>
    </div>
  );
}
