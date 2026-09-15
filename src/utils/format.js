// Utility functions for formatting

export const th2 = (n) => n.toLocaleString("lo-LA");

export const formatPrice = (price) => `₭${th2(price)}`;

export const formatDateTime = (date) => {
  const timeStr = date.toLocaleTimeString("lo-LA", { hour: "2-digit", minute: "2-digit" });
  const laoYear = date.getFullYear() + 543;
  const dateStr = `${date.getDate()} ${date.toLocaleDateString("lo-LA", { month: "short" })} ${laoYear}`;
  return { timeStr, dateStr };
};

export const formatBillNumber = (date) => {
  return `CS${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-001`;
};
