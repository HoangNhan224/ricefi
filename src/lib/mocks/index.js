// ============================================================
// Mock data — RiceFi (Section 4 API Contract)
// Giá trị copy NGUYÊN từ cột Response trong sheet API Contract:
// 12.8 tCO2e, 91% confidence, 8 USDC/RCC, 102.4 USDC, 97.28 USDC.
// Mọi handler trả về shape khớp 1-1 với API thật.
// ============================================================

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

// ------------------- In-memory store (mutable) -------------------
const store = {
  token: null,
  role: null,
  // Farmer's own farms
  farms: [],
  // verification result per farmId: { status, confidence, carbonReduction }
  verifications: {},
  // carbon per farmId: { amount, unit, status } status = 'pending-mint' | 'ACTIVE' | ...
  carbon: {},
  // marketplace listings (seed = của nông dân khác, mine=false)
  marketplace: [
    {
      creditId: "CC001",
      name: "Mekong Rice #001",
      amount: 12.8,
      price: 8,
      mine: false,
    },
    {
      creditId: "CC004",
      name: "Mekong Rice #004",
      amount: 6.2,
      price: 8,
      mine: false,
    },
  ],
  // wallets
  farmerWallet: { RCC: 0, USDC: 0 },
  buyerWallet: { RCC: 0, USDC: 1000 },
  // order history (buyer)
  orders: [],
  farmSeq: 1,
  listingSeq: 5,
};

let txSeq = 1000;
const nextTx = () =>
  `5z${Date.now().toString(36)}${(txSeq++).toString(36)}mock`;

export const __store = store; // for tests / integration debugging

// ------------------- Handlers -------------------
export async function login(email) {
  await delay(300);
  const role =
    email.toLowerCase().includes("buyer") ||
    email.toLowerCase().includes("doanh")
      ? "BUYER"
      : "FARMER";
  store.token = `rf_${role}_${Date.now().toString(36)}`;
  store.role = role;
  return { token: store.token, role };
}

export async function listFarms() {
  await delay(250);
  return store.farms.map((f) => ({
    ...f,
    // Trạng thái carbon theo Section 5 (null = chưa xác minh)
    carbonStatus: store.carbon[f.id]?.status || null,
  }));
}

export async function createFarm({ name, area, method }) {
  await delay(350);
  const id = `FARM${String(store.farmSeq++).padStart(3, "0")}`;
  const farm = { id, name, area, method, status: "PENDING" };
  store.farms.push(farm);
  return { id: farm.id, status: farm.status };
}

export async function getFarm(id) {
  await delay(250);
  const farm = store.farms.find((f) => f.id === id);
  if (!farm) throw new Error(`Không tìm thấy farm ${id}`);
  return { ...farm };
}

export async function startVerification(farmId) {
  await delay(1400); // đủ lâu để thấy PaddyLevelBar dâng
  const result = {
    status: "VERIFIED",
    confidence: 0.91,
    carbonReduction: 12.8,
  };
  store.verifications[farmId] = result;
  store.carbon[farmId] = {
    amount: 12.8,
    unit: "tCO2e",
    status: "PENDING_MINT", // chưa mint → "Chờ tokenize"
  };
  const farm = store.farms.find((f) => f.id === farmId);
  if (farm) farm.status = "VERIFIED";
  return result;
}

export async function getCarbon(farmId) {
  await delay(250);
  const carbon = store.carbon[farmId];
  if (!carbon) throw new Error(`Chưa có dữ liệu carbon cho ${farmId}`);
  return { amount: carbon.amount, unit: carbon.unit, status: carbon.status };
}

export async function mintCarbon({ farmId, carbonAmount }) {
  await delay(900);
  const verif = store.verifications[farmId];
  if (!verif || verif.status !== "VERIFIED") {
    throw new Error("Chưa xác minh VERIFIED — không thể tokenize carbon");
  }
  const carbon = store.carbon[farmId];
  if (!carbon) throw new Error(`Không có dữ liệu carbon cho ${farmId}`);
  carbon.status = "ACTIVE"; // 0 = ACTIVE on-chain
  const txHash = nextTx();
  store.farmerWallet.RCC += carbonAmount;
  return { symbol: "RCC", amount: carbonAmount, txHash };
}

export async function listCarbon({ farmId, amount, price }) {
  await delay(400);
  const carbon = store.carbon[farmId];
  if (!carbon || carbon.status !== "ACTIVE") {
    throw new Error("Carbon chưa ở trạng thái ACTIVE — không thể rao bán");
  }
  carbon.status = "LISTED"; // 1 = LISTED on-chain
  const farm = store.farms.find((f) => f.id === farmId);
  const creditId = `CC${String(store.listingSeq++).padStart(3, "0")}`;
  store.marketplace.push({
    creditId,
    farmId,
    name: farm?.name || farmId,
    amount,
    price,
    mine: true,
  });
  store.farmerWallet.RCC -= amount;
  return { creditId, amount, price, status: "LISTED" };
}

export async function getMarketplace() {
  await delay(300);
  return store.marketplace.map((m) => ({ ...m }));
}

export async function buyCredit({ creditId, amount }) {
  await delay(800);
  const listing = store.marketplace.find((m) => m.creditId === creditId);
  if (!listing) throw new Error(`Không tìm thấy listing ${creditId}`);
  const usdc = +(amount * listing.price).toFixed(2);
  if (store.buyerWallet.USDC < usdc) {
    throw new Error("Số dư USDC không đủ — không có giao dịch nào xảy ra");
  }
  const txHash = nextTx();
  // Atomic settlement: đổi cả 2 số dư cùng lúc
  store.buyerWallet.USDC = +(store.buyerWallet.USDC - usdc).toFixed(2);
  store.buyerWallet.RCC = +(store.buyerWallet.RCC + amount).toFixed(2);
  // Farmer nhận 95% (102.4 → 97.28), 5% platform fee — chỉ khi listing là của farmer
  if (listing.mine) {
    const farmerPayout = +(usdc * 0.95).toFixed(2);
    store.farmerWallet.USDC = +(store.farmerWallet.USDC + farmerPayout).toFixed(
      2,
    );
    // Carbon đã bán → status SOLD (2 = SOLD on-chain)
    if (listing.farmId && store.carbon[listing.farmId]) {
      store.carbon[listing.farmId].status = "SOLD";
    }
  }
  // Xoá listing đã bán
  store.marketplace = store.marketplace.filter((m) => m.creditId !== creditId);
  store.orders.unshift({
    creditId,
    name: listing.name,
    amount,
    price: listing.price,
    usdc,
    txHash,
    status: "SOLD",
    at: new Date().toISOString(),
  });
  return { status: "SUCCESS", usdc, txHash };
}

export async function getWalletBalance() {
  await delay(250);
  // Role-aware: farmer xem ví farmer, buyer xem ví buyer
  const wallet =
    store.role === "BUYER" ? store.buyerWallet : store.farmerWallet;
  return { RCC: wallet.RCC, USDC: wallet.USDC };
}

export async function getOrders() {
  await delay(250);
  return store.orders.map((o) => ({ ...o }));
}
