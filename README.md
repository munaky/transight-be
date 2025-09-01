## **Transight – Smart Transaction Insight System**

**Overview**
Transight is an AI-powered system built on **n8n** to automatically record, analyze, and deliver actionable insights from every customer checkout. It helps businesses understand buying behavior, spot trends, and optimize strategies in real time.

**Key Features**

* **Automatic Recording** – Captures purchase time, items, price, quantity, and location.
* **Smart Data Management** – Stores and organizes transaction history for long-term insights.
* **AI Analytics** – Detects trends, top products, customer segments, and anomalies.
* **Actionable Recommendations** – Promo strategies, stock optimization, and personalized marketing.
* **Multi-Channel Reports** – Instant updates via **Telegram**, formal reports via **Email**.
* **Visual Dashboard** – Track insights through n8n or BI tool integration.

---

## **Installation & Setup**

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/your-org/transight.git
cd transight
npm install
```

### 2. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your database connection and other required values.

### 3. Prisma Setup (Database)

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

### 4. Run the Application

Start the development server:

```bash
npm run dev
```

---

## **n8n Setup**

1. Install & run **n8n** (via npm, Docker, or desktop app).
2. Open the n8n editor at `http://localhost:5678`.
3. Import the workflow:

   * Go to **Import Workflow**.
   * Upload the file `n8n-workflow.json` (provided in this repo).
4. Adjust credentials (API keys, database connections, etc.) inside n8n.
5. Activate the workflow to start processing transactions.
