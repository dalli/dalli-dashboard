import React from 'react';

const Charts = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Charts</h1>
        <p className="text-gray-600 dark:text-gray-400">Visualize your data with beautiful charts and graphs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Line Chart</h2>
          <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" className="mx-auto mb-2">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
              </svg>
              <p>Line Chart Visualization</p>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bar Chart</h2>
          <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" className="mx-auto mb-2">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
              </svg>
              <p>Bar Chart Visualization</p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pie Chart</h2>
          <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" className="mx-auto mb-2">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path>
              </svg>
              <p>Pie Chart Visualization</p>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Area Chart</h2>
          <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" className="mx-auto mb-2">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
              </svg>
              <p>Area Chart Visualization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Data Table */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Chart Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#3a3f4a]">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Month</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Sales</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#3a3f4a]">
              {[
                { month: 'January', sales: 1200, revenue: '$12,000', growth: '+12%' },
                { month: 'February', sales: 1500, revenue: '$15,000', growth: '+25%' },
                { month: 'March', sales: 1800, revenue: '$18,000', growth: '+20%' },
                { month: 'April', sales: 2100, revenue: '$21,000', growth: '+17%' },
                { month: 'May', sales: 2400, revenue: '$24,000', growth: '+14%' },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#1a1f28] transition-colors">
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{row.month}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.sales}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.revenue}</td>
                  <td className="px-4 py-3 text-green-400">{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Charts;

