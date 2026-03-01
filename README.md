# Warm-Up Assignment — Delivery Driver Shift Tracker

## What is this about?

In this assignment, you are going to build a small system that manages delivery drivers' daily shift logs. Picture a real delivery company that needs to keep track of when each driver clocks in and out, how much time they actually spend on the road during working hours, and whether or not they hit their daily targets. All the data lives in plain text files, and your job is to write JavaScript functions that can read, process, and update those records.

You will be dealing with **two text files**:

1. **`shifts.txt`** — This holds every driver's shift entries: their clock-in/clock-out times, how long the shift lasted, idle time, active delivery time, whether they met quota, and whether they earned a bonus.
2. **`driverRates.txt`** — This stores each driver's pay tier, their assigned weekly day off, and their monthly base salary.

Your task is to implement **10 functions** inside a single file called `main.js`. Each function handles a different piece of the puzzle — from straightforward time math all the way to calculating a driver's net monthly pay after deductions.

---

## Getting Started

### Prerequisites
- **Node.js** must be installed on your machine. If you don't have it, grab it from [nodejs.org](https://nodejs.org/).
- A **GitHub** account.

### Step-by-step setup

1. **Fork** this repository by clicking the **Fork** button at the top-right of the GitHub page.
2. **Clone** your fork to your local machine:

   ```bash
   git clone https://github.com/<your-username>/warmup-assignment.git
   ```

3. Open the project folder and start implementing the functions inside `main.js`.
4. Test your code locally using the provided scripts (see below).
5. **Commit and push** your work — you must have **at least 2 meaningful commits**.

### Files in this repo

| File | What it does |
|------|-------------|
| `main.js` | **Your workspace.** All 10 functions are stubbed out here. Write your code inside this file. |
| `mainRunFileTesting.js` | A scratch pad for you to manually test your functions. Run it with `node mainRunFileTesting.js`. |
| `publicTests.js` | The public test cases. Run with `node publicTests.js` to check your progress. |
| `shifts.txt` | Sample shift data that your functions will read from and write to. |
| `driverRates.txt` | Driver tier/salary information. |
| `PublicTestFiles/` | Clean copies of the data files, used by the test scripts to reset state between runs. |
| `ReadMeFile.txt` | Quick-reference instructions (same info as this README, in plain text). |

### How to run

```bash
# Test your functions manually
node mainRunFileTesting.js

# Run the public test suite
node publicTests.js
```

---

## The 10 Functions You Need to Implement

Here is a brief summary. Full specifications, edge cases, and examples are in the **assignment PDF**.

| # | Function | What it does |
|---|----------|-------------|
| 1 | `getShiftDuration(startTime, endTime)` | Calculates total time between clock-in and clock-out. |
| 2 | `getIdleTime(startTime, endTime)` | Figures out how much time falls outside delivery hours (before 8 AM or after 10 PM). |
| 3 | `getActiveTime(shiftDuration, idleTime)` | Subtracts idle time from total shift time to get productive hours. |
| 4 | `metQuota(date, activeTime)` | Checks if the driver hit the daily minimum. Normal days need 8h 24m; during the Eid period (Apr 10–30, 2025), only 6h. |
| 5 | `addShiftRecord(textFile, shiftObj)` | Adds a new shift entry to the text file. Handles duplicates, ordering, and auto-calculates all derived fields. |
| 6 | `setBonus(textFile, driverID, date, newValue)` | Updates the `hasBonus` flag for a specific driver on a specific date. |
| 7 | `countBonusPerMonth(textFile, driverID, month)` | Counts how many bonus entries a driver has in a given month. Returns -1 if the driver doesn't exist. |
| 8 | `getTotalActiveHoursPerMonth(textFile, driverID, month)` | Sums up all active hours for a driver in a given month. |
| 9 | `getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)` | Calculates how many hours the driver was supposed to work that month, factoring in day-off rules, bonuses, and the Eid period. |
| 10 | `getNetPay(driverID, actualHours, requiredHours, rateFile)` | Computes the driver's net salary after deducting for missing hours, with tier-based allowances. |

---

## Important Rules

- **This is an individual assignment.** Do your own work.
- You can **only** use the built-in `fs` module. No external packages (no lodash, no moment, nothing). Using anything besides `fs` means an automatic **zero**.
- You may use any built-in JavaScript methods (`Math.floor`, `String.split`, `parseInt`, etc.).
- Write **all** your code inside `main.js`. Only `main.js` will be graded.
- Do **not** modify or delete any of the original template files (`publicTests.js`, `ReadMeFile.txt`, data files, etc.).
- Passing the public tests is a good sign, but it does **not** guarantee full marks. The private test suite covers more edge cases, so think carefully about boundary conditions.
- Use `fs.readFileSync()` and `fs.writeFileSync()` for all file operations.

---

## Submission

You must complete **both** parts for your submission to count:

### Part 1 — GitHub (Commit History)

1. Make sure your forked repository is **public** so that the TAs can access it.
2. You must have **at least 2 meaningful commits** pushed to your fork.

### Part 2 — Google Form (Zip Upload)

1. Create a `.zip` file containing **your entire project folder** (the cloned repo with your completed `main.js`).
2. **Rename** the `.zip` file using the format: `ID-Tutorial` (e.g., `1000546-T8`).
3. Submit via the **Google Form**: [https://forms.gle/B2DfcPJdYP6PSyFa7](https://forms.gle/B2DfcPJdYP6PSyFa7)
4. The form will ask for your **Name**, **Student ID**, **Tutorial Number**, **GIU Email**, **GitHub repo URL**, and the **`.zip` file** upload.

> **Important:** Make sure to submit before the deadline. It is **your** responsibility to verify that your `.zip` file is correct and your GitHub repo is public.

Good luck!
