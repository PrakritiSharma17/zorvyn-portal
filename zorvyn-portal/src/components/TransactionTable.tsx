import React from 'react';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { Trash2, Edit2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isAdmin,
  onDelete,
  onEdit,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">
                Type
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">
                Amount
              </th>
              {isAdmin && (
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {format(transaction.date, 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      transaction.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {transaction.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
