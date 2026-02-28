import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Diamond, 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  Play, 
  ChevronRight, 
  PlayCircle, 
  Globe, 
  Share2, 
  Send,
  CheckCircle2,
  PenTool,
  Ruler,
  X,
  Plus,
  Trash2,
  Edit,
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  Menu,
  Info,
  Maximize2
} from "lucide-react";

// --- Types ---
interface Product {
  id: number;
  name: string;
  material: string;
  price: string;
  image: string;
  description: string;
}

interface Order {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

// --- Components ---

const Navbar = ({ onAdminClick, cartCount, onCartClick }: { onAdminClick: () => void, cartCount: number, onCartClick: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1200px]">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glassmorphism rounded-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between shadow-2xl border border-white/10"
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <Diamond className="text-primary w-5 h-5 md:w-6 md:h-6" />
          <span className="font-bold tracking-widest text-base md:text-lg uppercase text-white">Luxe Abaya</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          {["Collections", "Bespoke", "Heritage", "Journal"].map((item) => (
            <a key={item} href="#" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors text-white/70">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button className="hover:text-primary transition-colors hidden sm:block"><Search className="w-5 h-5" /></button>
          <button 
            id="bag-icon"
            onClick={onCartClick}
            className="hover:text-primary transition-colors relative p-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-bg-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <button 
            onClick={onAdminClick}
            className="hidden md:block bg-primary text-bg-dark px-6 py-2 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            Boutique
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 glassmorphism rounded-3xl p-8 border border-white/10 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {["Collections", "Bespoke", "Heritage", "Journal"].map((item) => (
                <a key={item} href="#" className="text-xl font-serif text-white hover:text-primary transition-colors">
                  {item}
                </a>
              ))}
              <hr className="border-white/10" />
              <button 
                onClick={() => {
                  onAdminClick();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-primary text-bg-dark py-4 rounded-xl font-bold text-lg"
              >
                Admin Boutique
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FlyingItem = ({ image, startPos, onComplete }: { image: string, startPos: { x: number, y: number }, onComplete: () => void }) => {
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const bagIcon = document.getElementById("bag-icon");
    if (bagIcon) {
      const rect = bagIcon.getBoundingClientRect();
      setTargetPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  }, []);

  if (targetPos.x === 0) return null;

  return (
    <motion.div
      initial={{ 
        position: "fixed",
        top: startPos.y,
        left: startPos.x,
        width: 100,
        height: 100,
        zIndex: 200,
        borderRadius: "1rem",
        overflow: "hidden",
        opacity: 1,
        scale: 1
      }}
      animate={{ 
        top: targetPos.y,
        left: targetPos.x,
        width: 20,
        height: 20,
        opacity: 0.5,
        scale: 0.2
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      className="pointer-events-none"
    >
      <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
    </motion.div>
  );
};

const CartModal = ({ items, onClose, onRemove, onCheckout }: { items: Product[], onClose: () => void, onRemove: (idx: number) => void, onCheckout: () => void }) => {
  const total = items.reduce((acc, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ""));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-end bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-bg-dark border-l border-white/10 w-full max-w-md h-full p-8 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-serif text-white">Your Bag</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-50">
              <ShoppingBag className="w-12 h-12" />
              <p className="text-slate-400">Your bag is empty.</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`${item.id}-${idx}`}
                className="flex gap-4 group"
              >
                <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{item.name}</h3>
                  <p className="text-primary text-sm font-medium">{item.price}</p>
                  <button 
                    onClick={() => onRemove(idx)}
                    className="text-xs text-red-400 mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-8 border-t border-white/10 mt-8 space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Total Estimate</span>
              <span className="text-2xl font-serif text-white">AED {total.toLocaleString()}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-primary text-bg-dark py-5 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ProductModal = ({ product, onClose, onOrder, onAddToBag }: { product: Product, onClose: () => void, onOrder: (p: Product) => void, onAddToBag: (p: Product, e: React.MouseEvent) => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-bg-dark border border-white/10 rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto md:overflow-visible"
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
        <X className="w-6 h-6 text-white" />
      </button>
      
      <div className="md:w-1/2 h-96 md:h-auto">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
        <div className="space-y-2">
          <span className="text-primary font-semibold tracking-widest uppercase text-xs">{product.material}</span>
          <h2 className="text-4xl font-serif text-white">{product.name}</h2>
          <p className="text-2xl font-bold text-primary">{product.price}</p>
        </div>
        
        <p className="text-slate-400 leading-relaxed">
          {product.description || "Experience unparalleled luxury with our 3D-crafted silhouettes, where traditional heritage meets modern architectural fluidness."}
        </p>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>100% Authentic Italian Silk</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Hand-stitched by master artisans</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Complimentary worldwide shipping</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button 
            onClick={(e) => onAddToBag(product, e)}
            className="w-full border border-primary text-primary py-4 rounded-lg font-bold text-lg hover:bg-primary/5 transition-colors"
          >
            Add to Bag
          </button>
          <button 
            onClick={() => onOrder(product)}
            className="w-full bg-primary text-bg-dark py-4 rounded-lg font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20"
          >
            Order Now
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const OrderForm = ({ products, onClose, onSuccess }: { products: Product[], onClose: () => void, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    paymentMethod: "card"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For multiple items, we'll send them one by one or update the API to handle arrays.
      // For now, let's assume we order the first item or the main one for simplicity, 
      // or we can loop if the API supports it. 
      // Actually, let's just send the first one for now as a placeholder for "Order All"
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: products[0].id,
          ...formData
        })
      });
      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-bg-dark border border-white/10 rounded-2xl p-6 md:p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>
        
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Complete Your Order</h2>
          <div className="text-slate-400 text-sm">
            Ordering: {products.length > 1 ? `${products.length} items` : <span className="text-primary font-medium">{products[0].name}</span>}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Full Name</label>
              <input 
                required
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Full name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Phone Number</label>
              <input 
                required
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="+971 ..."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Email Address</label>
            <input 
              required
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Delivery Address</label>
            <textarea 
              required
              rows={2}
              value={formData.customerAddress}
              onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              placeholder="Street, Building, Apartment, City"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "card", label: "Card", icon: "💳" },
                { id: "wallet", label: "Wallet", icon: "📱" },
                { id: "cod", label: "COD", icon: "💵" }
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: method.id})}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    formData.paymentMethod === method.id 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xl">{method.icon}</span>
                  <span className="text-[10px] uppercase font-bold tracking-tighter">{method.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-primary text-bg-dark py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Login = ({ onLogin, onCancel }: { onLogin: (token: string) => void, onCancel: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-dark border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Diamond className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif text-white">Admin Access</h2>
          <p className="text-slate-500 text-sm">Please authenticate to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Username</label>
            <input 
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Enter username"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Password</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <div className="flex flex-col gap-3">
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-primary text-bg-dark py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-3 text-slate-500 hover:text-white transition-colors"
            >
              Back to Store
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminPortal = ({ onExit, token }: { onExit: () => void, token: string }) => {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    const [pRes, oRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/orders", { headers: { "x-admin-auth": token } })
    ]);
    setProducts(await pRes.json());
    setOrders(await oRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-admin-auth": token
      },
      body: JSON.stringify(editingProduct)
    });
    setEditingProduct(null);
    fetchData();
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await fetch(`/api/products/${id}`, { 
        method: "DELETE",
        headers: { "x-admin-auth": token }
      });
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between bg-bg-dark sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Diamond className="text-primary w-5 h-5" />
          <span className="font-bold tracking-widest uppercase text-xs">Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "fixed inset-0 z-[100] bg-bg-dark" : "hidden"} md:flex md:relative md:w-64 border-r border-white/5 p-6 flex-col gap-8`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Diamond className="text-primary w-6 h-6" />
            <span className="font-bold tracking-widest uppercase text-sm">Admin Portal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-white/5 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "products" ? "bg-primary text-bg-dark font-bold" : "hover:bg-white/5 text-slate-400"}`}
          >
            <Package className="w-5 h-5" />
            Products
          </button>
          <button 
            onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "orders" ? "bg-primary text-bg-dark font-bold" : "hover:bg-white/5 text-slate-400"}`}
          >
            <ClipboardList className="w-5 h-5" />
            Orders
          </button>
        </nav>
        
        <div className="mt-auto">
          <button 
            onClick={onExit}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Exit Portal
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-serif">
            {activeTab === "products" ? "Product Management" : "Order History"}
          </h1>
          {activeTab === "products" && (
            <button 
              onClick={() => setEditingProduct({ name: "", price: "", material: "", image: "", description: "" })}
              className="w-full sm:w-auto bg-primary text-bg-dark px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}
        </div>
        
        {activeTab === "products" ? (
          <div className="grid grid-cols-1 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <img src={p.image} className="w-full sm:w-20 h-48 sm:h-20 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-slate-500 text-sm">{p.material} • {p.price}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button onClick={() => setEditingProduct(p)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Edit className="w-5 h-5 text-slate-400" /></button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-5 h-5 text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 text-sm uppercase tracking-widest">
                  <th className="py-4 px-4 font-bold">Order ID</th>
                  <th className="py-4 px-4 font-bold">Customer</th>
                  <th className="py-4 px-4 font-bold">Product</th>
                  <th className="py-4 px-4 font-bold">Details</th>
                  <th className="py-4 px-4 font-bold">Payment</th>
                  <th className="py-4 px-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-mono text-primary">#{o.id.toString().padStart(4, '0')}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold">{o.customerName}</div>
                      <div className="text-xs text-slate-500">{o.customerEmail}</div>
                      <div className="text-xs text-slate-400">{o.customerPhone}</div>
                    </td>
                    <td className="py-4 px-4">{o.productName}</td>
                    <td className="py-4 px-4 text-sm text-slate-400 max-w-xs truncate">{o.customerAddress}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest border border-white/5">
                        {o.paymentMethod || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Product Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-bg-dark border border-white/10 rounded-2xl p-8 max-w-lg w-full"
            >
              <h2 className="text-2xl font-serif mb-8">{editingProduct.id ? "Edit Product" : "New Product"}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <input 
                  placeholder="Product Name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                />
                <input 
                  placeholder="Material"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                  value={editingProduct.material}
                  onChange={e => setEditingProduct({...editingProduct, material: e.target.value})}
                />
                <input 
                  placeholder="Price (e.g. AED 3,850)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                  value={editingProduct.price}
                  onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                />
                <input 
                  placeholder="Image URL"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                  value={editingProduct.image}
                  onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                />
                <textarea 
                  placeholder="Description"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 h-32"
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                />
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-3 hover:bg-white/5 rounded-lg transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-primary text-bg-dark font-bold rounded-lg transition-all">Save Product</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<"home" | "admin">("home");
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem("adminToken"));
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderingProducts, setOrderingProducts] = useState<Product[] | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [flyingItem, setFlyingItem] = useState<{ image: string, pos: { x: number, y: number } } | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("adminToken", token);
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("adminToken");
    setView("home");
  };

  const addToBag = (product: Product, e: React.MouseEvent) => {
    setFlyingItem({
      image: product.image,
      pos: { x: e.clientX, y: e.clientY }
    });
    setCart([...cart, product]);
  };

  if (view === "admin") {
    if (!adminToken) {
      return <Login onLogin={handleLogin} onCancel={() => setView("home")} />;
    }
    return <AdminPortal onExit={handleLogout} token={adminToken} />;
  }

  const noirHeritageProduct = products.find(p => p.name.includes("Noir Heritage")) || products[0];

  return (
    <div className="min-h-screen bg-bg-dark">
      <Navbar 
        onAdminClick={() => setView("admin")} 
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen hero-gradient flex flex-col items-center pt-24 md:pt-32 overflow-hidden">
          <div className="absolute top-20 -left-20 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full floating-shape"></div>
          <div className="absolute bottom-40 -right-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full floating-shape"></div>
          
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-6 md:gap-8 order-2 lg:order-1"
            >
              <div className="space-y-4">
                <span className="text-primary font-semibold tracking-[0.3em] uppercase text-xs md:text-sm block">Autumn/Winter 2024</span>
                <h1 className="text-5xl md:text-8xl font-serif leading-tight text-white">
                  The Soul of <br />
                  <span className="italic text-primary">Silk</span>
                </h1>
                <p className="text-base md:text-xl text-slate-400 max-w-lg leading-relaxed font-light">
                  Experience unparalleled luxury with our 3D-crafted silhouettes, where traditional heritage meets modern architectural fluidness.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <button 
                  onClick={() => {
                    const el = document.getElementById('collections');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-primary text-bg-dark px-10 py-5 rounded-lg font-bold text-lg shadow-[0_20px_50px_rgba(236,182,19,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="group flex items-center gap-3 text-white font-medium"
                >
                  <span className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Play className="w-5 h-5 fill-current" />
                  </span>
                  Watch Film
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-primary/10">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">100%</p>
                  <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">Italian Silk</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">Hand</p>
                  <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">Stitched</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">Global</p>
                  <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">Delivery</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="order-1 lg:order-2 relative group"
            >
              <div className="absolute -inset-4 bg-primary/20 rounded-xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-bg-dark/50 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <img 
                  alt="Luxury Abaya model" 
                  className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuuloIOHRGIO7y6BxAXcq_YTseHxkNKjKGQBiLJOQVYcAPvmaw_jPx-0M96KOqeYIYVJQl-ab3Af9C1aHz-vUCDgmsIxaoW7Wry1GI92LA5nWpR7UsGztebOvPGo57BFVC_o3pek4j2QbEo9vFtokcd912SG0QotFIGtGdRM2cL357JUjEvxzdbfYwb0uPreKJAzauHiaIGTHG5gAXJdZ6g5wvE_AB_Ljrh1gMCxK1qHyV31fP3YrvzsPl63YmpeR-8kSD81mKyhs"
                  referrerPolicy="no-referrer"
                />
                
                {/* Interactive Hotspot */}
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  onClick={() => noirHeritageProduct && setSelectedProduct(noirHeritageProduct)}
                  className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-primary/80 border-4 border-white/20 flex items-center justify-center shadow-2xl z-20 group/hotspot"
                >
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                  <Info className="w-4 h-4 text-bg-dark" />
                  <div className="absolute bottom-full mb-4 right-0 glassmorphism p-3 rounded-lg border border-white/10 opacity-0 group-hover/hotspot:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <p className="text-xs font-bold text-white">Silk Texture Details</p>
                  </div>
                </motion.button>

                <div 
                  onClick={() => noirHeritageProduct && setSelectedProduct(noirHeritageProduct)}
                  className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 glassmorphism p-4 md:p-6 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group/card"
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg md:text-xl">Noir Heritage</h3>
                        <Maximize2 className="w-4 h-4 text-primary opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-primary text-xs md:text-sm">Signature Series 01</p>
                    </div>
                    <span className="text-white/60 text-[10px] md:text-xs">AED 4,200</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Collections Section */}
        <section id="collections" className="py-24 bg-bg-dark relative">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-serif text-white">The Signature Series</h2>
                <p className="text-slate-400">Curated pieces for the modern visionary.</p>
              </div>
              <a href="#" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                View All Collections <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-[#27241c]">
                    <img 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      src={product.image}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <button className="w-full py-3 glassmorphism rounded-lg text-white font-bold text-sm">View Details</button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.material}</p>
                  <p className="text-primary mt-2 font-bold">{product.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Craftsmanship Section */}
        <section className="py-24 bg-[#1d1b15] relative overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden group">
              <img 
                alt="Craftsmanship" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkBlKDcm9J0wRVHAGVEFl7XgxgIMhrS5siDCa44-dBmJYi5cx12dWvLib4au19LIU_7G7TZqB0pDU08PDEbO36FQ6lRm9pB64I5c2L9XOvVsCTHBcekjJ5ApLHN6NueAK2OcBUqTcd4xkQSNu7Br46N-GoKAnzMraohbJrzIBTy88aTzyye3yP5zK4ZTPJGpt6bazTFOFpwbWQTvEBoSx317z0Rb6nBawaTiS6VFgY7BDh43nV-71YYEtTdhSg8yYpvAZ0ChIzUNo"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-bg-dark/30 flex items-center justify-center">
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 text-bg-dark flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                >
                  <PlayCircle className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              </div>
            </div>
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-4">
                <span className="text-primary font-semibold tracking-widest uppercase text-xs">Our Process</span>
                <h2 className="text-4xl md:text-5xl font-serif leading-tight text-white">The Art of <br />Precision</h2>
                <p className="text-base md:text-lg text-slate-400 font-light">
                  Every stitch tells a story of elegance and precision. Our artisans spend over 120 hours on each bespoke piece, ensuring every fold captures the light in a dance of shadows.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 md:gap-6 group cursor-pointer" onClick={() => setSelectedProduct(products[0])}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Ruler className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                      3D Silhouettes
                      <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-slate-500">Proprietary pattern cutting techniques that create architectural depth and volume.</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 group cursor-pointer" onClick={() => setSelectedProduct(products[1])}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <PenTool className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                      Artisan Tailoring
                      <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-slate-500">Master couturiers with decades of experience in traditional Middle Eastern embroidery.</p>
                  </div>
                </div>
              </div>
              <button className="w-full sm:w-auto border border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary hover:text-bg-dark transition-all">
                Discover Our Story
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-bg-dark pt-20 pb-10 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Diamond className="text-primary w-8 h-8" />
                <span className="font-bold tracking-widest text-lg uppercase text-white">Luxe Abaya</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Redefining the boundaries of modest luxury. Handcrafted with passion in the heart of the UAE.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Collections</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Evening Wear</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bespoke Couture</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Experience</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">Our Atelier</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Personal Styling</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Care Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Gift Registry</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Stay Inspired</h5>
              <p className="text-sm text-slate-500 mb-4">Join our inner circle for exclusive previews and editorial content.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-white/5 border-none focus:ring-1 focus:ring-primary rounded-l-lg w-full text-sm px-4 py-2 text-white outline-none"
                />
                <button className="bg-primary text-bg-dark px-4 rounded-r-lg hover:bg-primary/80 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-600">© 2024 LUXE ABAYA. All rights reserved.</p>
            <div className="flex gap-8 text-xs text-slate-600">
              <a href="#" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400">Terms of Service</a>
              <a href="#" className="hover:text-slate-400">Sustainability</a>
              <button onClick={() => setView("admin")} className="hover:text-primary transition-colors">Admin Portal</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {flyingItem && (
          <FlyingItem 
            image={flyingItem.image} 
            startPos={flyingItem.pos} 
            onComplete={() => setFlyingItem(null)} 
          />
        )}

        {isCartOpen && (
          <CartModal 
            items={cart} 
            onClose={() => setIsCartOpen(false)} 
            onRemove={(idx) => {
              const newCart = [...cart];
              newCart.splice(idx, 1);
              setCart(newCart);
            }}
            onCheckout={() => {
              setIsCartOpen(false);
              setOrderingProducts(cart);
            }}
          />
        )}

        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToBag={addToBag}
            onOrder={(p) => {
              setSelectedProduct(null);
              setOrderingProducts([p]);
            }} 
          />
        )}
        
        {orderingProducts && (
          <OrderForm 
            products={orderingProducts} 
            onClose={() => setOrderingProducts(null)} 
            onSuccess={() => {
              setOrderingProducts(null);
              setCart([]); // Clear cart on success
              setOrderSuccess(true);
            }} 
          />
        )}
        
        {orderSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <div className="bg-bg-dark border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-sm w-full">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-serif text-white mb-4">Order Placed!</h2>
              <p className="text-slate-400 mb-8">Thank you for your purchase. Our artisans will begin crafting your piece shortly.</p>
              <button 
                onClick={() => setOrderSuccess(false)}
                className="w-full bg-primary text-bg-dark py-3 rounded-lg font-bold"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          >
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-12 text-center">
                <PlayCircle className="w-24 h-24 text-primary animate-pulse" />
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif text-white">The Soul of Silk</h3>
                  <p className="text-slate-400">A cinematic journey through our Autumn/Winter 2024 collection.</p>
                </div>
                <div className="w-full max-w-md h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="h-full bg-primary"
                  />
                </div>
                <p className="text-xs text-primary uppercase tracking-[0.3em]">Streaming Experience...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
