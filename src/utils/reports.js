import { storage, storageKeys } from './storage';

// Calculate daily sales
export const getDailySales = (date = new Date()) => {
  const salesHistory = storage.get(storageKeys.SALES_HISTORY) || [];
  const targetDate = new Date(date).toDateString();

  return salesHistory.filter(sale => {
    const saleDate = new Date(sale.date).toDateString();
    return saleDate === targetDate;
  });
};

// Calculate daily total
export const getDailyTotal = (date = new Date()) => {
  const dailySales = getDailySales(date);
  return dailySales.reduce((total, sale) => total + sale.total, 0);
};

// Calculate daily item count
export const getDailyItemCount = (date = new Date()) => {
  const dailySales = getDailySales(date);
  return dailySales.reduce((total, sale) => total + sale.itemCount, 0);
};

// Calculate daily transaction count
export const getDailyTransactionCount = (date = new Date()) => {
  return getDailySales(date).length;
};

// Calculate weekly sales (last 7 days)
export const getWeeklySales = () => {
  const salesHistory = storage.get(storageKeys.SALES_HISTORY) || [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return salesHistory.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= sevenDaysAgo && saleDate <= now;
  });
};

// Calculate weekly total
export const getWeeklyTotal = () => {
  const weeklySales = getWeeklySales();
  return weeklySales.reduce((total, sale) => total + sale.total, 0);
};

// Calculate monthly sales
export const getMonthlySales = (year, month) => {
  const salesHistory = storage.get(storageKeys.SALES_HISTORY) || [];
  const now = new Date();
  const targetYear = year || now.getFullYear();
  const targetMonth = month || now.getMonth();

  return salesHistory.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate.getFullYear() === targetYear && saleDate.getMonth() === targetMonth;
  });
};

// Calculate monthly total
export const getMonthlyTotal = (year, month) => {
  const monthlySales = getMonthlySales(year, month);
  return monthlySales.reduce((total, sale) => total + sale.total, 0);
};

// Calculate yearly sales
export const getYearlySales = (year) => {
  const salesHistory = storage.get(storageKeys.SALES_HISTORY) || [];
  const now = new Date();
  const targetYear = year || now.getFullYear();

  return salesHistory.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate.getFullYear() === targetYear;
  });
};

// Calculate yearly total
export const getYearlyTotal = (year) => {
  const yearlySales = getYearlySales(year);
  return yearlySales.reduce((total, sale) => total + sale.total, 0);
};

// Get top selling products
export const getTopSellingProducts = (limit = 5) => {
  const salesHistory = storage.get(storageKeys.SALES_HISTORY) || [];
  const productSales = {};

  salesHistory.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = {
          id: item.id,
          name: item.name,
          totalQty: 0,
          totalRevenue: 0
        };
      }
      productSales[item.id].totalQty += item.qty;
      productSales[item.id].totalRevenue += item.total;
    });
  });

  return Object.values(productSales)
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, limit);
};

// Get sales by payment method
export const getSalesByPaymentMethod = () => {
  const salesHistory = storage.get(storageKeys.SALES_HISTORY) || [];
  const paymentMethods = {};

  salesHistory.forEach(sale => {
    if (!paymentMethods[sale.paymentMethod]) {
      paymentMethods[sale.paymentMethod] = {
        method: sale.paymentMethod,
        total: 0,
        count: 0
      };
    }
    paymentMethods[sale.paymentMethod].total += sale.total;
    paymentMethods[sale.paymentMethod].count += 1;
  });

  return Object.values(paymentMethods);
};

// Get daily sales data for chart (last 7 days)
export const getDailySalesData = () => {
  const data = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const total = getDailyTotal(date);
    const dateStr = date.toLocaleDateString('lo-LA', { day: 'numeric', month: 'short' });

    data.push({
      date: dateStr,
      total: total,
      fullDate: date
    });
  }

  return data;
};

// Get monthly sales data for chart (last 12 months)
export const getMonthlySalesData = () => {
  const data = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const total = getMonthlyTotal(date.getFullYear(), date.getMonth());
    const monthStr = date.toLocaleDateString('lo-LA', { month: 'short', year: '2-digit' });

    data.push({
      month: monthStr,
      total: total,
      fullDate: date
    });
  }

  return data;
};

// Get hourly sales data for today
export const getHourlySalesData = () => {
  const data = [];
  const dailySales = getDailySales();

  for (let hour = 0; hour < 24; hour++) {
    const hourSales = dailySales.filter(sale => {
      const saleHour = new Date(sale.date).getHours();
      return saleHour === hour;
    });

    const total = hourSales.reduce((sum, sale) => sum + sale.total, 0);
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;

    data.push({
      time: timeStr,
      total: total,
      hour: hour
    });
  }

  return data;
};
