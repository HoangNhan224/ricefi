// ============================================================
// Đồng bộ trạng thái với on-chain (docs/AGENT_WORKFLOW.md)
// CarbonAsset.status chỉ có 4 giá trị: 0=ACTIVE / 1=LISTED / 2=SOLD / 3=RETIRED.
// FE không bịa thêm trạng thái trung gian; "PENDING_MINT" là trạng thái
// client duy nhất thêm vào = "chưa mint" (chưa có phản hồi từ chain).
// ============================================================

export const CARBON_STATUS = {
  PENDING_MINT: "PENDING_MINT", // chưa mint — "Chờ tokenize"
  ACTIVE: "ACTIVE", // 0 — Đã tokenize, chưa list
  LISTED: "LISTED", // 1 — Đang rao bán
  SOLD: "SOLD", // 2 — Đã bán
  RETIRED: "RETIRED", // 3 — Đã retire
};

const STATUS_LABEL = {
  [CARBON_STATUS.PENDING_MINT]: "Chờ tokenize",
  [CARBON_STATUS.ACTIVE]: "Đã tokenize — chưa list",
  [CARBON_STATUS.LISTED]: "Đang rao bán",
  [CARBON_STATUS.SOLD]: "Đã bán",
  [CARBON_STATUS.RETIRED]: "Đã retire",
};

export function statusLabel(status) {
  return STATUS_LABEL[status] || status;
}

// 4 mốc trên thanh tiến trình carbon (Section 3.4)
export const CARBON_STEPS = [
  CARBON_STATUS.ACTIVE,
  CARBON_STATUS.LISTED,
  CARBON_STATUS.SOLD,
  CARBON_STATUS.RETIRED,
];

export function stepIndex(status) {
  return CARBON_STEPS.indexOf(status);
}

// Link Solana Explorer (bằng chứng on-chain cho Demo Flow bước 7 & 9)
export function explorerTxLink(txHash) {
  return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
}
