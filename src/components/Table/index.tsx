import { ITransaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils";
import { useTransaction } from "@/hooks/transactions";

export interface ITableProps {
  data: ITransaction[];
  openDeleteModal: (id: string | undefined) => void;
  openEditModal: (transaction: ITransaction) => void;
}

export function Table({ data, openDeleteModal, openEditModal }: ITableProps) {
  return (
    <>
      <table className="w-full mt-16 border-0 border-separate border-spacing-y-2 ">
        <thead>
          <tr>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Título
            </th>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Preço
            </th>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Categoria
            </th>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={index} className="bg-white h-16 rounded-lg">
              <td className="px-4 py-4 whitespace-nowrap text-title">
                {transaction.title}
              </td>
              <td
                className={`px-4 py-4 whitespace-nowrap text-left ${
                  transaction.type === "INCOME" ? "text-income" : "text-outcome"
                }`}
              >
                {formatCurrency(transaction.price)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-table">
                {transaction.category}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-table">
                {transaction.data ? formatDate(new Date(transaction.data)) : ""}
              </td>
              <td className="flex gap-5 content-center mt-4">
                <button
                  onClick={() => openDeleteModal(transaction.id)}
                  className="bg-red-500 w-10 p-1 text-white rounded-2xl hover:bg-red-700 text-[15px]"
                >
                  X
                </button>
                <button
                  onClick={() => openEditModal(transaction)}
                  className="bg-gray-500 hover:bg-gray-700 p-1.5 text-sm rounded-2xl text-white"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
