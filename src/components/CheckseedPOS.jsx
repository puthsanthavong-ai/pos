import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Scan, Clock, Calendar, ChevronDown, Grid3x3, List,
  Trash2, ShoppingCart, Banknote, QrCode, CreditCard, Landmark,
  PauseCircle, Percent, User, FileSearch, Printer, Ban, Settings,
  Wallet, MoreVertical, BarChart3
} from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";
import { th2, formatDateTime, formatBillNumber } from "../utils/format";
import { storage, storageKeys } from "../utils/storage";
import { getCustomers, updateCustomerPoints } from "../data/customers";
import ProductCard from "./ProductCard";
import ProductRow from "./ProductRow";
import CartLine from "./CartLine";
import Toast from "./Toast";
import Dashboard from "./Dashboard";
import DiscountModal from "./DiscountModal";

export default function CheckseedPOS() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [view, setView] = useState("grid");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [paying, setPaying] = useState(false);
  const [paidMethod, setPaidMethod] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discount, setDiscount] = useState(null);
  const toastTimer = useRef(null);

  // Stock management
  const [stock, setStock] = useState(() => {
    // Try to load from localStorage first
    const savedStock = storage.get(storageKeys.STOCK);
    if (savedStock) {
      return savedStock;
    }

    // Initialize from products data
    const initialStock = {};
    PRODUCTS.forEach(p => {
      initialStock[p.id] = p.stock;
    });
    return initialStock;
  });

  // Save stock to localStorage whenever it changes
  useEffect(() => {
    storage.set(storageKeys.STOCK, stock);
  }, [stock]);

  const getStock = (productId) => stock[productId] || 0;

  const isOutOfStock = (productId) => getStock(productId) <= 0;

  const updateStock = (productId, quantity) => {
    setStock(prev => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] - quantity)
    }));
  };

  const showToast = (t) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1600);
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => category === "all" || p.cat === category);
    if (query.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
    }
    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "best") list = [...list].sort((a, b) => b.sold - a.sold);
    return list;
  }, [category, query, sort]);

  const qtyOf = (id) => cart.find((c) => c.id === id)?.qty || 0;

  const addToCart = (p) => {
    if (isOutOfStock(p.id)) {
      showToast(`"${p.name}" ຫຼວງສະຕົກ`);
      return;
    }

    const currentCartQty = qtyOf(p.id);
    const availableStock = getStock(p.id);

    if (currentCartQty >= availableStock) {
      showToast(`"${p.name}" ຫຼວງສະຕົກ`);
      return;
    }

    setCart((prev) => {
      const found = prev.find((c) => c.id === p.id);
      if (found) return prev.map((c) => (c.id === p.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...p, qty: 1 }];
    });
    showToast(`ເພີ່ມ "${p.name}" ລົງກະຕ້າແລ້ວ`);
  };

  const inc = (id) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    const currentCartQty = qtyOf(id);
    const availableStock = getStock(id);

    if (currentCartQty >= availableStock) {
      showToast(`"${product.name}" ຫຼວງສະຕົກ`);
      return;
    }

    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c)));
  };
  const dec = (id) =>
    setCart((prev) =>
      prev.flatMap((c) => (c.id === id ? (c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : []) : [c]))
    );
  const remove = (id) => setCart((prev) => prev.filter((c) => c.id !== id));
  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    setDiscount(null);
    showToast("ຍົກເລີກບິນແລ້ວ");
  };

  const applyDiscount = (discountData) => {
    setDiscount(discountData);
    showToast(`ນຳມັນສ່ວນຫຼຸດ ${discountData.type === 'percentage' ? discountData.value + '%' : '₭' + discountData.value}`);
  };

  const removeDiscount = () => {
    setDiscount(null);
    showToast("ຍົກເລີກສ່ວນຫຼຸດ");
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + c.qty * c.price, 0);

  // Calculate discount
  const discountAmount = discount
    ? discount.type === 'percentage'
      ? (totalPrice * discount.value) / 100
      : discount.value
    : 0;

  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const [now] = useState(() => new Date());
  const { timeStr, dateStr } = formatDateTime(now);
  const billNumber = formatBillNumber(now);

  const pay = (method) => {
    if (cart.length === 0) return;
    setPaying(true);
    setPaidMethod(method);
    setTimeout(() => {
      setPaying(false);

      // Update stock based on cart items
      cart.forEach(item => {
        updateStock(item.id, item.qty);
      });

      // Save sales history to localStorage
      const salesHistory = storage.get(storageKeys.SALES_HISTORY) || [];
      const newSale = {
        id: billNumber,
        date: new Date().toISOString(),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          total: item.price * item.qty
        })),
        total: totalPrice,
        discount: discount,
        finalPrice: finalPrice,
        paymentMethod: method,
        itemCount: totalItems,
        customerId: selectedCustomer?.id || null
      };
      salesHistory.push(newSale);
      storage.set(storageKeys.SALES_HISTORY, salesHistory);

      // Update customer points if customer is selected
      if (selectedCustomer) {
        const pointsEarned = Math.floor(finalPrice / 10); // 1 point per 10 kip
        updateCustomerPoints(selectedCustomer.id, pointsEarned, finalPrice);
      }

      showToast(`ຊຳລະເງິນສຳເລັດ (${method})`);
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(null);
    }, 900);
  };

  return (
    <div className="flex h-[820px] w-full flex-col bg-[#F3F4F6] text-[#1C1F26]" style={{ fontFamily: "'Noto Sans Lao', 'Inter', system-ui, sans-serif" }}>

      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[#ECEDF0] bg-white px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5342A] text-[17px] font-bold text-white">C</div>
          <span className="text-[16px] font-bold tracking-tight">CHECKSEED</span>
          <span className="ml-1 rounded-md bg-[#E5342A] px-1.5 py-0.5 text-[10px] font-bold text-white">POS</span>
        </div>

        <div className="relative mx-2 flex-1 max-w-xl">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4B8C0]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ຄົ້ນຫາສິນຄ້າ / ສະແກນບາໂຄດ"
            className="h-10 w-full rounded-full border border-[#ECEDF0] bg-[#F8F9FA] pl-10 pr-10 text-[13.5px] outline-none placeholder:text-[#B4B8C0] focus:border-[#E5342A]/40 focus:bg-white"
          />
          <Scan size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B4B8C0]" />
        </div>

        <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
          <Clock size={15} />
          <span>{timeStr}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
          <Calendar size={15} />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#F3C6C2] bg-[#FEF2F1] px-3 py-1.5 text-[12.5px] font-medium text-[#E5342A]">
          ບິນ #{billNumber}
          <ChevronDown size={13} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-[#ECEDF0] bg-white p-3">
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition ${
                    active ? "bg-[#FEF2F1] text-[#E5342A]" : "text-[#4B5060] hover:bg-[#F8F9FA]"
                  }`}
                >
                  <Icon size={17} strokeWidth={2} />
                  {c.label}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-[#ECEDF0] px-3 py-2.5 text-[13px] font-medium text-[#4B5060] hover:bg-[#F8F9FA]">
              <Wallet size={16} />
              ເປີດລິນຊັກເງິນ
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-[#ECEDF0] px-3 py-2.5 text-[13px] font-medium text-[#4B5060] hover:bg-[#F8F9FA]">
              <Settings size={16} />
              ຕັ້ງຄ່າ
            </button>
            <div className="mt-1 flex items-center gap-2 border-t border-[#ECEDF0] pt-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E9EAEC] text-[#8A8F98]">
                <User size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-semibold">ແອດມິນ</div>
                <div className="truncate text-[11px] text-[#8A8F98]">ຜູ້ດູແລລະບົບ</div>
              </div>
              <MoreVertical size={15} className="text-[#B4B8C0]" />
            </div>
          </div>
        </aside>

        {/* Product area */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-6 pb-3 pt-5">
            <h1 className="text-[19px] font-bold">
              {CATEGORIES.find((c) => c.id === category)?.label}
            </h1>
            <div className="flex items-center gap-1 rounded-lg border border-[#ECEDF0] p-1">
              <button
                onClick={() => setView("grid")}
                className={`flex h-8 w-9 items-center justify-center rounded-md ${view === "grid" ? "bg-[#E5342A] text-white" : "text-[#8A8F98]"}`}
              >
                <Grid3x3 size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex h-8 w-9 items-center justify-center rounded-md ${view === "list" ? "bg-[#E5342A] text-white" : "text-[#8A8F98]"}`}
              >
                <List size={15} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-6 pb-4">
            {[
              { id: "default", label: "ທັງໝົດ" },
              { id: "best", label: "ຂາຍດີ" },
              { id: "asc", label: "ລາຄາ ↑" },
              { id: "desc", label: "ລາຄາ ↓" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                  sort === s.id ? "bg-[#E5342A] text-white" : "border border-[#ECEDF0] text-[#4B5060] hover:bg-[#F8F9FA]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-24">
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-[#B4B8C0]">
                <Search size={28} className="mb-2" />
                <p className="text-[13.5px]">ບໍ່ພົບສິນຄ້າທີ່ຄົ້ນຫາ</p>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-4 gap-3.5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} p={p} qty={qtyOf(p.id)} onAdd={addToCart} stock={getStock(p.id)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((p) => (
                  <ProductRow key={p.id} p={p} qty={qtyOf(p.id)} onAdd={addToCart} stock={getStock(p.id)} />
                ))}
              </div>
            )}
          </div>

          {/* Bottom utility bar */}
          <div className="flex shrink-0 items-center gap-2 border-t border-[#ECEDF0] bg-white px-6 py-3">
            {[
              { icon: Percent, label: "ສ່ວນຫຼຸດ", sub: "F2", action: () => setShowDiscountModal(true) },
              { icon: User, label: "ລູກຄ້າ", sub: "F3" },
              { icon: FileSearch, label: "ຄົ້ນຫາບິນ", sub: "F4" },
              { icon: Printer, label: "ພິມໃບບິນ", sub: "F5" },
              { icon: BarChart3, label: "ລາຍງານ", sub: "F6", action: () => setShowDashboard(true) },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.label}
                  onClick={b.action || undefined}
                  className="flex items-center gap-2 rounded-xl border border-[#ECEDF0] px-3.5 py-2 text-[13px] font-medium text-[#4B5060] hover:bg-[#F8F9FA]"
                >
                  <Icon size={16} />
                  {b.label}
                  <span className="text-[11px] text-[#B4B8C0]">{b.sub}</span>
                </button>
              );
            })}
            <button
              onClick={clearCart}
              className="ml-auto flex items-center gap-2 rounded-xl border border-[#F3C6C2] px-3.5 py-2 text-[13px] font-medium text-[#E5342A] hover:bg-[#FEF2F1]"
            >
              <Ban size={16} />
              ຍົກເລີກບິນ
              <span className="text-[11px] text-[#F3B0AB]">Esc</span>
            </button>
          </div>
        </main>

        {/* Cart panel */}
        <aside className="flex w-[360px] shrink-0 flex-col border-l border-[#ECEDF0] bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-[14.5px] font-bold">ລາຍການສິນຄ້າ ({totalItems})</h2>
            <button
              onClick={clearCart}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#B4B8C0] hover:bg-[#F8F9FA] hover:text-[#E5342A]"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto border-t border-[#ECEDF0]">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[#B4B8C0]">
                <ShoppingCart size={30} className="mb-2" />
                <p className="text-[13px]">ຍັງບໍ່ມີສິນຄ້າໃນບິນ<br />ແຕະສິນຄ້າດ້ານຊ້າຍເພື່ອເພີ່ມ</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F3F4F6]">
                {cart.map((item) => (
                  <CartLine key={item.id} item={item} onInc={inc} onDec={dec} onRemove={remove} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[#ECEDF0] px-5 py-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <div className="text-[14px] font-bold">ລວມທັງໝົດ</div>
                <div className="text-[12px] text-[#8A8F98]">{totalItems} ລາຍການ</div>
              </div>
              <div className="text-[24px] font-extrabold text-[#E5342A]">₭{th2(totalPrice)}</div>
            </div>

            <button
              disabled={cart.length === 0 || paying}
              onClick={() => pay("ເງິນສດ")}
              className="mb-3 flex w-full items-center justify-between rounded-xl bg-[#E5342A] px-5 py-3.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#CE2E25]"
            >
              <span className="flex items-center gap-2 text-[14.5px]">
                <ShoppingCart size={17} />
                ຊຳລະເງິນ
              </span>
              <span className="text-[15px] font-bold">₭{th2(totalPrice)}</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                disabled={cart.length === 0}
                onClick={() => pay("ເງິນສດ")}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#BCE7CE] bg-[#EAFBF1] py-2.5 text-[13px] font-semibold text-[#1E9E5A] disabled:opacity-40"
              >
                <Banknote size={16} /> ເງິນສດ
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => pay("QR Code")}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#BFD3FB] bg-[#EDF2FF] py-2.5 text-[13px] font-semibold text-[#2563EB] disabled:opacity-40"
              >
                <QrCode size={16} /> QR Code
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => pay("ບັດເຄຣດິດ")}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#D9C9F7] bg-[#F4EEFE] py-2.5 text-[13px] font-semibold text-[#7C4FE0] disabled:opacity-40"
              >
                <CreditCard size={16} /> ບັດເຄຣດິດ
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => pay("ໂອນເງິນ")}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#F5DFA8] bg-[#FFF8E8] py-2.5 text-[13px] font-semibold text-[#B7790C] disabled:opacity-40"
              >
                <Landmark size={16} /> ໂອນເງິນ
              </button>
            </div>

            <button
              disabled={cart.length === 0}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ECEDF0] py-2.5 text-[13px] font-semibold text-[#4B5060] disabled:opacity-40 hover:bg-[#F8F9FA]"
            >
              <PauseCircle size={16} /> ພັກບິນ
            </button>
          </div>
        </aside>
      </div>

      <Toast text={toast} />
      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
    </div>
  );
}
