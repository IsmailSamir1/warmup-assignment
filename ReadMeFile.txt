========================================
  Warm-Up Assignment - Delivery Driver Shift Tracker
========================================

OBJECTIVE:
  Track delivery drivers' shift records stored in a text file.
  Implement 10 JavaScript functions inside main.js.

FILES:
  - main.js              : Implement your functions here (ONLY this file will be graded)
  - mainRunFileTesting.js : Use this file to test your functions
  - publicTests.js        : Public test cases (run with: node publicTests.js)
  - shifts.txt            : Sample shift records text file
  - driverRates.txt       : Driver rates and tier information
  - PublicTestFiles/       : Contains test data files for public tests

GETTING STARTED:
  1. Fork this repo: https://github.com/AmirHaytham/warmup-assignment
  2. Clone your fork:  git clone https://github.com/<your-username>/warmup-assignment.git
  3. Implement the functions inside main.js
  4. Make at least 2 meaningful commits and push to your fork

HOW TO RUN:
  1. Make sure Node.js is installed on your machine
  2. Open terminal in the assignment folder
  3. Run: node mainRunFileTesting.js   (to test manually)
  4. Run: node publicTests.js          (to run public test cases)

DATA FORMAT:
  shifts.txt columns:
    DriverID, DriverName, Date, StartTime, EndTime, ShiftDuration, IdleTime, ActiveTime, MetQuota, HasBonus

  driverRates.txt columns:
    DriverID, DayOff, BasePay, Tier

IMPORTANT RULES:
  - This is an INDIVIDUAL assignment
  - You are NOT allowed to use any external library other than fs
  - Using an external library other than fs will result in a ZERO grade
  - Write ALL your code inside main.js — only main.js will be graded
  - Do NOT modify or delete any original template files
  - You are allowed to use any predefined JavaScript methods
  - Handle all edge cases - passing public tests does not guarantee full marks
  - Use fs.readFileSync() and fs.writeFileSync() for file operations

SUBMISSION (both parts are required):
  Part 1 - GitHub:
    - Make sure your forked repo is PUBLIC
    - You must have at least 2 meaningful commits pushed to your fork

  Part 2 - Google Form:
    - Create a .zip of your entire project folder
    - Rename the .zip as: ID-Tutorial (e.g., 1000546-T8)
    - Submit via: https://forms.gle/B2DfcPJdYP6PSyFa7
    - The form asks for: Name, Student ID, Tutorial Number, GIU Email,
      GitHub repo URL, and .zip file upload

DELIVERY HOURS:
  - Delivery hours are between 8:00 AM and 10:00 PM (inclusive)
  - Time before 8 AM or after 10 PM is considered idle time

DAILY QUOTA:
  - Normal working day quota: 8 hours and 24 minutes
  - Special period (Eid al-Fitr): April 10 to April 30, 2025 - quota reduced to 6 hours

TIER SYSTEM (driverRates.txt):
  - Tier 1 (Senior)  : Can have up to 50 missing hours with no pay deduction
  - Tier 2 (Regular) : Can have up to 20 missing hours with no pay deduction
  - Tier 3 (Junior)  : Can have up to 10 missing hours with no pay deduction
  - Tier 4 (Trainee) : Can have up to 3 missing hours with no pay deduction

PAY CALCULATION:
  - deductionRatePerHour = floor(basePay / 185)
  - salaryDeduction = missingHours * deductionRatePerHour
  - netPay = basePay - salaryDeduction

Good luck! :)
