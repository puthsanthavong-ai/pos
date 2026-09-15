import { CupSoda, Droplet, Cookie, UtensilsCrossed, Package, Milk, Candy, SprayCan, Sparkles } from "lucide-react";

export const PRODUCTS = [
  { id: 1, name: "Pepsi", price: 20, cat: "drinks", icon: CupSoda, tone: "#E5342A", sold: 132, stock: 45 },
  { id: 2, name: "Coke", price: 20, cat: "drinks", icon: CupSoda, tone: "#2563EB", sold: 98, stock: 38 },
  { id: 3, name: "ນ້ຳດື່ມຂວດໃສ", price: 12, cat: "drinks", icon: Droplet, tone: "#38BDF8", sold: 210, stock: 120 },
  { id: 4, name: "Lay's Original", price: 25, cat: "snacks", icon: Cookie, tone: "#2E9E4F", sold: 156, stock: 62 },
  { id: 5, name: "Lay's Salted Egg", price: 25, cat: "snacks", icon: Cookie, tone: "#F59E0B", sold: 140, stock: 48 },
  { id: 6, name: "Oreo Chocolate", price: 15, cat: "snacks", icon: Cookie, tone: "#1C1F26", sold: 88, stock: 35 },
  { id: 7, name: "Mama Tom Yum", price: 15, cat: "instant", icon: UtensilsCrossed, tone: "#DC2626", sold: 175, stock: 85 },
  { id: 8, name: "Farmhouse Bread", price: 20, cat: "instant", icon: Package, tone: "#D97706", sold: 60, stock: 28 },
  { id: 9, name: "Fresh Milk", price: 13, cat: "drinks", icon: Milk, tone: "#3B82F6", sold: 120, stock: 52 },
  { id: 10, name: "Chocolate Bar", price: 22, cat: "snacks", icon: Candy, tone: "#B91C1C", sold: 132, stock: 41 },
  { id: 11, name: "Shampoo", price: 39, cat: "personal", icon: SprayCan, tone: "#EC4899", sold: 40, stock: 18 },
  { id: 12, name: "Toothpaste", price: 35, cat: "personal", icon: Sparkles, tone: "#0EA5E9", sold: 55, stock: 22 },
];
