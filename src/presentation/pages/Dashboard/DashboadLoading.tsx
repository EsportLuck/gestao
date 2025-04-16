import { FC } from "react";

export const DashboardLoading: FC = () => {
  return (
    <div className="min-h-screen p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-10 w-64 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-24 bg-gray-800 rounded animate-pulse"></div>
      </div>

      <div className="rounded-md overflow-hidden border border-gray-800 bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-4 py-3 text-left w-24">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left w-48">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left w-32">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left w-32">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left w-32">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left w-32">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left w-32">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left w-32">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left w-32">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b border-gray-800">
                {[...Array(9)].map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-gray-800">
            <tr>
              <td className="px-4 py-3">
                <div className="h-4 w-16 bg-gray-800 rounded animate-pulse"></div>
              </td>
              <td></td>
              {[...Array(7)].map((_, index) => (
                <td key={index} className="px-4 py-3">
                  <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <div className="h-10 w-24 bg-gray-800 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
