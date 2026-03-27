# 🚀 Enhanced Vite React TypeScript Template

A modern starter template built with **Vite + React + TypeScript + Tailwind CSS**, featuring advanced linting and automatic CSS variable validation.

---

## ✨ Features

- 🔍 **CSS Variable Detection**  
  Automatically checks if all CSS variables used in `tailwind.config.cjs` are defined in `src/index.css`.

- 🧹 **Enhanced Linting**  
  Includes:
  - ESLint (JavaScript/TypeScript)
  - Stylelint (CSS)
  - Custom CSS variable validation script

- 🎨 **Shadcn/ui Pre-configured**  
  Ready-to-use UI components with Tailwind styling.

- ⚡ **Modern Stack**
  - Vite (fast build tool)
  - React + TypeScript
  - Tailwind CSS

---

## 📦 Installation

```bash
npm install
```

---

## 🚀 Run Project

```bash
npm run dev
```
Open in browser: http://localhost:5173

Backend (server + MySQL):
1
```bash
node setup-db.js
```
2. 
```bash
set PORT=3002 && npm run server   # Windows PowerShell: $env:PORT='3002'; npm run server
```
3. यदि फ्रंटेंड अलग पोर्ट पर API call करना है (जैसे 3002):
   - `.env` 
   - `VITE_API_URL=http://localhost:3002`
4. API चेक करें
```bash
curl http://localhost:3002/api/invoices
curl http://localhost:3002/api/challans
```

👉 अगर `EADDRINUSE` आए तो दूसरे पोर्ट पर चलाएँ, जैसे 3003

---

## 🧪 Available Scripts

```bash
# Run all lint checks
npm run lint

# Check only CSS variables
npm run check:css-vars

# Individual linting
npm run lint:js     # ESLint
npm run lint:css    # Stylelint
```

---

## 🔍 CSS Variable Detection

This project includes a custom validation system that:

1. Reads all `var(--variable)` usages from `tailwind.config.cjs`
2. Reads all defined variables from `src/index.css`
3. Compares both
4. Reports missing variables

---

### ❌ Example (Error)

```
Undefined CSS variables found:
--sidebar-background
--sidebar-foreground
```

👉 Fix: Add them in `src/index.css`

---

### ✅ Example (Success)

```
All CSS variables are properly defined
```

---

## ⚙️ How It Works

- Runs automatically during:
  ```bash
  npm run lint
  ```

- If any variable is missing:
  - ❌ Build fails
  - 📍 Shows exact missing variable name

---

## 📁 Project Structure

```
project/
│── src/
│   ├── index.css
│   ├── components/
│── scripts/
│   ├── check-css-variables.js
│   ├── check-css-classes.js
│── tailwind.config.cjs
│── package.json
```

---

## ⚠️ Important Notes

- Always define CSS variables inside `:root` in `index.css`
- Do NOT nest `:root` inside another `:root`
- Ensure scripts exist:
  ```
  scripts/check-css-variables.js
  scripts/check-css-classes.js
  ```

---

## 🛠️ Troubleshooting

### ❌ `bun not recognized`
👉 Use npm instead (already configured)

### ❌ CSS variable error
👉 Add missing variables in `index.css`

### ❌ JSON error
👉 Validate `package.json` using https://jsonlint.com

---

## 👩‍💻 Author

Hardik Pansani

---

## 📌 License

This project is for learning and development use.