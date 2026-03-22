# Focus New Tab (FNT) - Developer Dashboard

> **A high-performance, zero-latency mission control center that replaces your default browser new tab page.**

**Focus New Tab** is a minimalist dashboard engineered for developers, founders, and high-stakes executors. It combines real-time task tracking, habit synchronization, and deep-work tools into a single, portable, privacy-first interface. Designed to eliminate procrastination and keep your immediate priorities front and center.

![](image.png)

<p align="center">
  <img src="./dist/favicon-DEaN2nrl.svg" alt="FNT" width="100" height="100" /> 
  <br>
  <span style="font-size: 42px; font-weight: bold; color: #61DAFB;">Focus New Tab</span>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-007acc?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
</p>

---

## 🚀 Core Features

### ⚡ Priority-Sequenced Task Matrix
Categorize your workflow into **Emergency**, **Warning**, and **Primary** nodes. The UI automatically promotes high-value execution items, ensuring your most critical tasks are impossible to ignore.

### 🌊 Integrated Focus Timer
A distraction-free Pomodoro system bound directly to your active task. Track your deep work sessions with a dedicated progress visualization that anchors your attention.

### 🔄 Habit & Streak Tracking
Build long-term consistency with recurring protocols. The dashboard features a rolling 14-day history grid and automated streak tracking to visualize your daily momentum.

### 🎯 Milestone Countdown
A high-visibility tracker for your most critical project deadlines (e.g., product launches, seed pitches, or exams). Visual cues escalate as deadlines approach.

### 📜 Time-Sequenced Agenda
Keep your standups, meetings, and engineering reviews in sync. A minimalist, chronological timeline of your day's hard commitments.

---

## 🛠 Architecture & Tech Stack

This project is built for absolute speed, zero layout shift, and total privacy.

- **Frontend Core**: React 19 + TypeScript for strict type safety and modern hook patterns.
- **Build Engine**: Vite 6, aggressively optimized for single-file `index.html` portability.
- **Styling**: Tailwind CSS 4 using a custom high-contrast, dark-mode design system.
- **Data Model**: 100% LocalStorage. Completely offline, zero external database calls.
- **Runtime**: Bun for ultra-fast dependency resolution and script execution.

---

## 📦 Deployment & Setup

### Local Development
1. **Install Dependencies**:
   ```bash
   bun install
   ```
2. **Launch Development Server**:
   ```bash
   bun run dev
   ```
3. **Generate Production Build**:
   ```bash
   bun run build
   ```
   *Note: The production build generates a highly optimized, self-contained `dist/index.html` file.*

### Browser Integration Guide

To set **Focus New Tab** as your custom start page:

#### **For Brave Browser**
1. Build the project using `bun run build`.
2. Navigate to `brave://settings/appearance`.
3. Under "New Tab Page", select **Blank page**.
4. Install the [Custom New Tab URL](https://chromewebstore.google.com/detail/custom-new-tab-url/mmcgllhfgdleepmcjfknghochgikelaa) extension.
5. In the extension settings, provide the local file path to your `dist/index.html` (e.g., `file:///C:/Users/YourName/projects/dist/index.html`).

#### **For Chrome / Edge**
1. Build the project.
2. Install the [Custom New Tab](https://chromewebstore.google.com/detail/custom-new-tab/lfjnnkckddkopjfgmbcpdiolnmfobflj) extension.
3. Configure the extension to point directly to your local `dist/index.html` file.
