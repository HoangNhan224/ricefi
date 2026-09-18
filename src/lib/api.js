// ============================================================
// RiceFi — fetch wrapper DUY NHẤT (mọi page gọi qua đây).
// Bật mock mặc định; khi backend thật sẵn sàng (Phase F9):
//   set VITE_USE_MOCK=false + VITE_API_BASE_URL
// Không page nào import trực tiếp từ mocks/.
// ============================================================
import * as mock from "./mocks/index.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken() {
  try {
    return localStorage.getItem("rf_token");
  } catch {
    return null;
  }
}

async function http(method, path, body) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new ApiError("Không kết nối được tới máy chủ — thử lại", 0);
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(data?.message || `Lỗi HTTP ${res.status}`, res.status);
  }
  return res.json();
}

// ------------------- Endpoints (Section 4) -------------------
export const api = {
  async login(email) {
    if (USE_MOCK) return mock.login(email);
    return http("POST", "/auth/login", { email });
  },

  async listFarms() {
    if (USE_MOCK) return mock.listFarms();
    return http("GET", "/farms");
  },

  async createFarm(payload) {
    if (USE_MOCK) return mock.createFarm(payload);
    return http("POST", "/farms", payload);
  },

  async getFarm(id) {
    if (USE_MOCK) return mock.getFarm(id);
    return http("GET", `/farms/${id}`);
  },

  async startVerification(farmId) {
    if (USE_MOCK) return mock.startVerification(farmId);
    return http("POST", `/verification/${farmId}`, { farmId });
  },

  async getCarbon(id) {
    if (USE_MOCK) return mock.getCarbon(id);
    return http("GET", `/carbon/${id}`);
  },

  async mintCarbon(payload) {
    if (USE_MOCK) return mock.mintCarbon(payload);
    return http("POST", "/blockchain/mint", payload);
  },

  async listCarbon(payload) {
    if (USE_MOCK) return mock.listCarbon(payload);
    return http("POST", "/blockchain/list", payload);
  },

  async getMarketplace() {
    if (USE_MOCK) return mock.getMarketplace();
    return http("GET", "/marketplace");
  },

  async buyCredit(payload) {
    if (USE_MOCK) return mock.buyCredit(payload);
    return http("POST", "/marketplace/buy", payload);
  },

  async getWalletBalance() {
    if (USE_MOCK) return mock.getWalletBalance();
    return http("GET", "/wallet/balance");
  },

  async getOrders() {
    if (USE_MOCK) return mock.getOrders();
    return http("GET", "/wallet/orders");
  },
};

export default api;
