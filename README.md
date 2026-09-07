Cấu trúc repository

ricefi/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   ├── package.json
│   └── README.md
│
├── ai-service/
│   ├── app/
│   ├── data/
│   ├── requirements.txt
│   └── README.md
│
├── blockchain/
│   ├── programs/
│   ├── tests/
│   ├── Anchor.toml
│   └── README.md
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── demo/
│   └── business/
│
├── .gitignore
├── README.md
└── LICENSE

Quy tắc commit

Thống nhất với cả nhóm:

feat: thêm chức năng
fix: sửa lỗi
refactor: cải thiện code
docs: tài liệu
style: UI/format
test: test
chore: cấu hình

Ví dụ:

git commit -m "feat: add farm registration API"

git commit -m "feat: add farmer dashboard"

git commit -m "feat: add AI verification endpoint"

git commit -m "feat: mint RCC token"

git commit -m "fix: resolve marketplace purchase error"

git commit -m "docs: update API documentation"

README chính

# 🌾 RiceFi

AI × Web3 × RWA Carbon Platform for Mekong Delta Rice Farmers

## Overview

RiceFi is an AI-powered Web3 platform that verifies
low-emission rice farming, tokenizes verified carbon
assets, and connects farmers directly with carbon buyers.

## Problem

Farmers adopting low-emission rice farming face:

- High MRV costs
- Complex verification
- Limited access to global carbon markets
- Multiple intermediaries

## Solution

RiceFi combines:

- AI-assisted MRV
- Sentinel-2 satellite data
- IoT farming data
- Solana blockchain
- RWA carbon tokenization
- USDC payment
- Farmer-friendly Web3 UX

## Architecture

Farmer
↓
RiceFi
↓
AI / MRV
↓
Carbon Reduction
↓
Solana
↓
Carbon Token
↓
Marketplace
↓
Buyer
↓
USDC
↓
Farmer

## Tech Stack

Frontend:
React + TypeScript + TailwindCSS

Backend:
Node.js + Express

AI:
Python + FastAPI

Database:
MongoDB

Blockchain:
Solana + Anchor

## Team

Member A — Backend
Member B — Frontend
Minh Tiến — AI / MRV
Member D — Blockchain
Doanh Nhân — Product / QA
