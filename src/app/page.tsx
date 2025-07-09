"use client";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { DeleteModal } from "@/components/deleteModal";
import { EditModal } from "@/components/EditModal";
import { Header } from "@/components/Header";
import { Table } from "@/components/Table";
import { useTransaction } from "@/hooks/transactions";
import { ITotal, ITransaction } from "@/types/transaction";
import { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { uptadeTransaction } from "@/services/transactions";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModelOpen] = useState(false);

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

  const { data: transactionData, isLoading } = useTransaction.ListAll(
    skip,
    itemsPerPage
  );

  const transactions = transactionData?.transactions ?? [];
  const totalCount = transactionData?.totalCount ?? 0;

  const openModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const openDeleteModal = (id: string | undefined) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openEditModal = (transaction: ITransaction) => {
    setTransactionToEdit(transaction);
    setIsEditModelOpen(true);
  };

  const closeEditModal = () => setIsEditModelOpen(false);

  const handleAddModal = (newTransaction: ITransaction) => {
    addTransaction(newTransaction);
  };

  const handleDeleteModal = (id: string | undefined) => {
    deleteTransaction(id);
  };

  const totalTransactions: ITotal = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalIncome: 0, totalOutcome: 0, total: 0 };
    }

    return transactions.reduce(
      (acc: ITotal, { type, price }: ITransaction) => {
        if (type === "INCOME") {
          acc.totalIncome += price;
          acc.total += price;
        } else if (type === "OUTCOME") {
          acc.totalOutcome += price;
          acc.total -= price;
        }
        return acc;
      },
      { totalIncome: 0, totalOutcome: 0, total: 0 }
    );
  }, [transactions]);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <ToastContainer />
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
            formTitle="Adicionar Transação"
            transaction={transactionToEdit}
            onSubmit={(id, data) => {
              updateTransaction({ id, data });
              closeEditModal();
            }}
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
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-purple-500 hover:bg-purple-700 active:bg-purple-800 rounded-2xl p-1"
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
            disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
            className="bg-purple-500 hover:bg-purple-700 active:bg-purple-800 rounded-2xl p-1"
          >
            Próxima
          </button>
        </div>
      </BodyContainer>
    </div>
  );
}
