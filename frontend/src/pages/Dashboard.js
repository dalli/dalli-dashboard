import React from 'react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
        </svg>
      ),
    },
    {
      title: 'Subscriptions',
      value: '2,350',
      change: '+180.1%',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path>
        </svg>
      ),
    },
    {
      title: 'Sales',
      value: '12,234',
      change: '+19%',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
        </svg>
      ),
    },
    {
      title: 'Active Now',
      value: '573',
      change: '+201',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path>
        </svg>
      ),
    },
  ];

  const recentSales = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
    { name: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.icon}</div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" className="mx-auto mb-2">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
              </svg>
              <p>Chart visualization</p>
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Sales</h2>
          <div className="space-y-4">
            {recentSales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {sale.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white font-medium">{sale.name}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">{sale.email}</div>
                  </div>
                </div>
                <div className="text-green-500 font-semibold">{sale.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New order received', time: '2 minutes ago', type: 'order' },
            { action: 'Payment processed', time: '15 minutes ago', type: 'payment' },
            { action: 'New customer registered', time: '1 hour ago', type: 'user' },
            { action: 'Product updated', time: '2 hours ago', type: 'product' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-[#3a3f4a] last:border-0">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <div className="text-gray-900 dark:text-white">{activity.action}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

