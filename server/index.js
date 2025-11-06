import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Ensure DATABASE_URL exists in dev to avoid silent Prisma failures
/* eslint-disable no-undef */
if (typeof process !== "undefined" && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./server/prisma/dev.db";
}

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ---- Auth helpers ----
/* eslint-disable no-undef */
const JWT_SECRET = (typeof process !== 'undefined' && process.env.JWT_SECRET) || "dev_secret_change_me";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/* unused for now
function verifyToken(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
*/

// ---- Inventories ----

// GET /api/inventories
app.get("/api/inventories", async (req, res) => {
  try {
    const list = await prisma.inventory.findMany({ orderBy: { id: "asc" } });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inventories" });
  }
});

// POST /api/inventories
app.post("/api/inventories", async (req, res) => {
  try {
    const { title, fields } = req.body; // fields: JSON
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "'title' is required" });
    }
    const created = await prisma.inventory.create({
      data: { title, fields: fields ?? null },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create inventory" });
  }
});

// DELETE /api/inventories/:id
app.delete("/api/inventories/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.item.deleteMany({ where: { inventoryId: id } });
    await prisma.inventory.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete inventory" });
  }
});

// ---- Items ----

// GET /api/items?inventoryId=1
app.get("/api/items", async (req, res) => {
  try {
    const inventoryId = Number(req.query.inventoryId);
    const where = Number.isFinite(inventoryId) ? { inventoryId } : {};
    const list = await prisma.item.findMany({ where, orderBy: { id: "asc" } });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// POST /api/items
app.post("/api/items", async (req, res) => {
  try {
    const { inventoryId, name, quantity, price, customId, customFields } =
      req.body;
    if (!inventoryId || !name) {
      return res
        .status(400)
        .json({ error: "'inventoryId' and 'name' required" });
    }
    const created = await prisma.item.create({
      data: {
        inventoryId: Number(inventoryId),
        name,
        quantity: Number.isFinite(Number(quantity)) ? Number(quantity) : 0,
        price: Number.isFinite(Number(price)) ? Number(price) : 0,
        customId: customId ?? null,
        customFields: customFields ?? null,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

// PUT /api/items/:id
app.put("/api/items/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, quantity, price, customId, customFields } = req.body;
    const updated = await prisma.item.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
        customId: customId ?? null,
        customFields: customFields ?? null,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE /api/items/:id
app.delete("/api/items/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.item.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// ---- Discussions ----

// GET /api/discussions?inventoryId=1
app.get("/api/discussions", async (req, res) => {
  try {
    const inventoryId = Number(req.query.inventoryId);
    if (!Number.isFinite(inventoryId)) {
      return res.status(400).json({ error: "inventoryId is required" });
    }
    const list = await prisma.discussion.findMany({
      where: { inventoryId },
      orderBy: { id: "asc" },
      select: { id: true, author: true, message: true, createdAt: true },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch discussions" });
  }
});

// POST /api/discussions
app.post("/api/discussions", async (req, res) => {
  try {
    const { inventoryId, author, message } = req.body || {};
    if (!Number.isFinite(Number(inventoryId)) || !author || !message) {
      return res
        .status(400)
        .json({ error: "'inventoryId', 'author', 'message' required" });
    }
    const created = await prisma.discussion.create({
      data: {
        inventoryId: Number(inventoryId),
        author,
        message,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create discussion message" });
  }
});

// ---- Auth ----

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email & password required" });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, role: "user" } });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register" });
  }
});

// One-time admin setup (use env ADMIN_SETUP_TOKEN)
app.post("/api/auth/setup-admin", async (req, res) => {
  try {
    const tokenHeader = req.headers["x-admin-setup-token"]; // custom header
    const expected = (typeof process !== 'undefined' && process.env.ADMIN_SETUP_TOKEN) || "";
    if (!expected || tokenHeader !== expected) return res.status(403).json({ error: "Forbidden" });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email & password required" });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, role: "admin" } });
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to setup admin" });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email & password required" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});
