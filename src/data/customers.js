// Customer data management
import { storage, storageKeys } from "../utils/storage";

// Initialize default customers
const DEFAULT_CUSTOMERS = [
  {
    id: 1,
    name: "ລູກຄ້າທົ່ວໄປ",
    phone: "",
    points: 0,
    totalSpent: 0,
    visitCount: 0,
    lastVisit: null
  }
];

export const getCustomers = () => {
  const customers = storage.get(storageKeys.CUSTOMERS);
  return customers || DEFAULT_CUSTOMERS;
};

export const saveCustomer = (customer) => {
  const customers = getCustomers();
  const existingIndex = customers.findIndex(c => c.id === customer.id);

  if (existingIndex >= 0) {
    customers[existingIndex] = customer;
  } else {
    customers.push(customer);
  }

  storage.set(storageKeys.CUSTOMERS, customers);
  return customer;
};

export const addCustomer = (name, phone = "") => {
  const customers = getCustomers();
  const newCustomer = {
    id: Date.now(),
    name,
    phone,
    points: 0,
    totalSpent: 0,
    visitCount: 0,
    lastVisit: null
  };

  customers.push(newCustomer);
  storage.set(storageKeys.CUSTOMERS, customers);
  return newCustomer;
};

export const updateCustomerPoints = (customerId, pointsEarned, amountSpent) => {
  const customers = getCustomers();
  const customer = customers.find(c => c.id === customerId);

  if (customer) {
    customer.points += pointsEarned;
    customer.totalSpent += amountSpent;
    customer.visitCount += 1;
    customer.lastVisit = new Date().toISOString();

    storage.set(storageKeys.CUSTOMERS, customers);
    return customer;
  }

  return null;
};

export const getCustomerById = (id) => {
  const customers = getCustomers();
  return customers.find(c => c.id === id) || null;
};
