# MailGuard — Cyber Phishing Email Detector

A machine-learning powered phishing email detector with a cyberpunk-themed React UI.
Built with **Scikit-learn** (Python) for model training and **React + Vite + TypeScript + Tailwind CSS** for an interactive, in-browser classifier.

> Paste any email → instantly get a `[PHISHING]` or `[SAFE]` verdict with confidence score, matched keywords, URL analysis, and a confusion-matrix view of the trained model.

---

## ✨ Features

- 🧠 **Scikit-learn Logistic Regression** trained on TF-IDF (1–2 grams) + hand-crafted URL/keyword features
- ⚡ **Instant in-browser classification** — TypeScript port of the trained decision function (no backend round-trip)
- 🔗 **URL analysis** — flags suspicious TLDs (`.tk`, `.xyz`, `.ru`…), raw IPs, punycode, lookalike digits, deep subdomains
- 🔑 **Keyword scoring** — weighted dictionary of phishing phrases (`urgent`, `verify now`, `wire transfer`, `gift card`…)
- 📊 **Confusion matrix** + accuracy report from the held-out test set
- 🎨 **Cyberpunk UI** — neon cyan/magenta on deep blue, Orbitron + JetBrains Mono, scanlines & glow effects
- 📥 **Sample emails** included for one-click testing

---

## 🧱 Tech Stack

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| ML model         | Python 3, Scikit-learn 1.8, joblib, matplotlib          |
| Frontend         | React 18, Vite 5, TypeScript 5                          |
| Styling          | Tailwind CSS v3, shadcn/ui, custom cyberpunk tokens     |
| Icons / fonts    | lucide-react, Orbitron, JetBrains Mono                  |
| Hosting          | Lovable (preview + publish), GitHub sync                |

---

## 📁 Project Structure

```
.
├── src/
│   ├── pages/Index.tsx              # Main detector page
│   ├── components/
│   │   ├── ResultPanel.tsx          # Verdict + reasons + extracted features
│   │   └── ConfusionMatrix.tsx      # Heat-map visualization
│   ├── lib/phishingDetector.ts      # In-browser classifier (port of sklearn model)
│   ├── assets/confusion_matrix.png  # Trained-model confusion matrix
│   └── index.css                    # Cyberpunk design tokens
├── index.html
└── README.md
```

The original Python training script (`train_phishing.py`) trains a Logistic Regression on a synthetic
800-email dataset (400 phishing / 400 safe), then exports `phishing_model.joblib`, accuracy metrics,
and the confusion matrix image used in the UI.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (or Bun)
- **npm** / **pnpm** / **bun**

### Install & Run

```bash
git clone https://github.com/chethan-vinayak/MailGaurd.git
cd MailGuard
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) and start pasting emails.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧪 Re-training the Model (optional)

The browser ships with the trained coefficients baked into `src/lib/phishingDetector.ts`.
To retrain on your own dataset:

```bash
pip install scikit-learn pandas joblib matplotlib
python train_phishing.py --data your_emails.csv --out model/
```

Then update the weights / `MODEL_METRICS` block in `phishingDetector.ts` to reflect the new model.

---

## 📊 Model Performance

| Metric        | Value                                                      |
| ------------- | ---------------------------------------------------------- |
| Algorithm     | TF-IDF (1–2grams) + URL/keyword features → Logistic Reg.   |
| Training set  | 600 emails                                                 |
| Test set      | 200 emails                                                 |
| Accuracy      | 100% (synthetic dataset — real-world will be lower)        |

> ⚠️ The bundled dataset is synthetic and template-based, hence the perfect score.
> Re-train on a real corpus (e.g. Enron + PhishTank) for production-relevant numbers.

---

## 🎨 Theme

The UI uses a fully tokenized cyberpunk design system in `src/index.css`:

- **Background:** deep navy (`hsl(230 35% 6%)`) with a subtle grid + radial vignette
- **Primary (neon cyan):** `hsl(174 100% 50%)`
- **Accent (neon magenta):** `hsl(295 100% 60%)`
- **Safe (neon green):** `hsl(145 100% 50%)`
- **Danger (neon pink):** `hsl(340 100% 58%)`
- **Fonts:** `Orbitron` for displays, `JetBrains Mono` for body

All colors are HSL semantic tokens — components never hard-code colors.

---

## 💡 About the Name

**MailGuard** — a clear, trustworthy name that says exactly what it does: guards your inbox against phishing threats.

---

## 📜 License

MIT — educational use. **Not a replacement for a production email security gateway.**

---

## 🙏 Credits

- Built with [Lovable](https://lovable.dev)
- shadcn/ui components
- lucide-react icons
- Fonts: Orbitron, JetBrains Mono (Google Fonts)
