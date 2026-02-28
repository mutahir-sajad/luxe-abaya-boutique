import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("luxe_abaya.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    material TEXT,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    customerPhone TEXT,
    customerAddress TEXT NOT NULL,
    paymentMethod TEXT,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(productId) REFERENCES products(id)
  );
`);

// Migration: Add new columns if they don't exist
try {
  db.exec("ALTER TABLE orders ADD COLUMN customerPhone TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE orders ADD COLUMN paymentMethod TEXT");
} catch (e) {}

// Seed initial data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insert = db.prepare("INSERT INTO products (name, material, price, image, description) VALUES (?, ?, ?, ?, ?)");
  insert.run("Midnight Silk", "Pure Italian Crepe", "AED 3,850", "https://lh3.googleusercontent.com/aida-public/AB6AXuBN2nKDSKGK-JasfegETiPKq--OVnFmWJhUpj-Q0AvcUXGVUzqvQFIpjCllBwzqnR2ZOu6rImVSRrlGRhulzh0mbaVj_obAIzRVfZlsLlzS18V5A_v_4AWMBhkMYmbGoMspwFZJmQLOCW9NJEBAaO1uHl8fCUMNdyLeiiBIMOLuBJ_I6_ftOJ1G4Ttk6Y08C_8OiVxDTXjcRYN0KKvtL6ET2u4yC2HfdIfIdVGWSpv7G_SUp4zwO2fM7cI-NGZ2V3ffGlBJfWwwv44", "A masterpiece of Italian crepe, designed for the modern visionary who values understated elegance.");
  insert.run("Emerald Velvet", "Premium Hand-Stitched", "AED 5,200", "https://lh3.googleusercontent.com/aida-public/AB6AXuDHlj18n84ncQDuXc0hTcguDEZNN_hJ-DZDy8uxf6bGE8SJHyjLudCTjCxxkqS5OGL914b7TliFBDgZpJW-xNyGqpKi-e91aQu-jFDvSMY8zzn4ncdfKWDcBrN8XNH8zmkekXbqNuuvby0_IDg8As_CvkcT7b2Pgw8u9cKZnrZ7nM5mTgvSMhCvgFxbeyWBDK18xbV-3tPcR14ZSDMJwn-s6Kq1EbK9EzkNBWdKYeq4al_yOVhnE_ymfYVjxLP_0eZlTobPApx3Gg0", "Rich emerald velvet adorned with intricate hand-stitched patterns that catch the light beautifully.");
  insert.run("Pearl Essence", "Bridal Silk Series", "AED 6,100", "https://lh3.googleusercontent.com/aida-public/AB6AXuBu1gfL3vSzgElxL9MDjMOCsJxqxGEdpO8muruViwaQQi_0GokzbppqSWIegln51XfgahffxDwJig-8rymg0qBaqetCmB7_cjDQK2qdmZZ-h84gFoCJZW5A65QRyd2NTQcD4btNGfa6fbH_Q1zq6AvAUvySG4I-v6wTDQZm4PO34LwVHOteKtiM9P5mmD_QlZu5dNI_ukZqPVefrzCRujX46Ha4Ow7UyTNslyAkIm7Exwc5_m614IEv4NhWnMoCu5iVtRjkfur4lMw", "The pinnacle of our bridal series, featuring luminous silk and delicate detailing for your most special moments.");
  insert.run("Onyx Wrap", "Textured Chiffon", "AED 2,900", "https://lh3.googleusercontent.com/aida-public/AB6AXuDNqC7-KtQtNVPq3S4DctPOklrxJ3D7Ugu4MJskFfxzEYCFS1fVmWKXv9kKBiXyE6gn5SamZWEBx6JMAtfjMv6Q_vrqkisMvWu7Y4p8PxgC1QLkv4dpzmwQlJOM1HGDHT9ZUTiKKpAs1mr4AYUKyzCY5zr4OGpiDqZWFIENsaKwncLfPheKU_Y1Axn6ogxN1xUBrD9wSB9aKEuS0PI2E3cUQGF_Bt8BusxRDhBpbI8XQQ-ZZmj7PoqTq9zrdywMebSJ72eiKFI_Ew8", "A versatile onyx wrap in textured chiffon, offering a lightweight and breathable silhouette for daily luxury.");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  
  const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "password123";

  // Auth Middleware
  const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["x-admin-auth"];
    if (authHeader === ADMIN_PASS) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // Login Route
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      res.json({ success: true, token: ADMIN_PASS }); // Simple token for demo
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/products", authMiddleware, (req, res) => {
    const { id, name, material, price, image, description } = req.body;
    if (id) {
      const update = db.prepare("UPDATE products SET name = ?, material = ?, price = ?, image = ?, description = ? WHERE id = ?");
      update.run(name, material, price, image, description, id);
      res.json({ success: true, id });
    } else {
      const insert = db.prepare("INSERT INTO products (name, material, price, image, description) VALUES (?, ?, ?, ?, ?)");
      const result = insert.run(name, material, price, image, description);
      res.json({ success: true, id: result.lastInsertRowid });
    }
  });

  app.delete("/api/products/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/orders", authMiddleware, (req, res) => {
    const orders = db.prepare(`
      SELECT orders.*, products.name as productName 
      FROM orders 
      LEFT JOIN products ON orders.productId = products.id
      ORDER BY orders.createdAt DESC
    `).all();
    res.json(orders);
  });

  app.post("/api/orders", (req, res) => {
    const { productId, customerName, customerEmail, customerPhone, customerAddress, paymentMethod } = req.body;
    const insert = db.prepare("INSERT INTO orders (productId, customerName, customerEmail, customerPhone, customerAddress, paymentMethod) VALUES (?, ?, ?, ?, ?, ?)");
    const result = insert.run(productId, customerName, customerEmail, customerPhone, customerAddress, paymentMethod);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
