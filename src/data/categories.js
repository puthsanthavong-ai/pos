import { Grid3x3, CupSoda, Cookie, Package, UtensilsCrossed, Tag, Sparkles } from "lucide-react";

export const CATEGORIES = [
  { id: "all", label: "ທັງໝົດ", icon: Grid3x3 },
  { id: "drinks", label: "ເຄື່ອງດື່ມ", icon: CupSoda },
  { id: "snacks", label: "ຂອງກິນເບິ່ງ", icon: Cookie },
  { id: "personal", label: "ຂອງໃຊ້ສ່ວນຕົວ", icon: Package },
  { id: "instant", label: "ອາຫານສຳເລັດຮູບ", icon: UtensilsCrossed },
  { id: "misc", label: "ສິນຄ້າອື່ນໆ", icon: Tag },
  { id: "promo", label: "ໂປຣໂມຊັນ", icon: Sparkles },
];
