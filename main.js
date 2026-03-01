const fs = require("fs");

// ── HELPER: "hh:mm:ss am/pm" → total seconds ──
function timeToSeconds(timeStr) {
  timeStr = timeStr.trim();
  const parts = timeStr.split(" ");
  const period = parts[1].toLowerCase(); // "am" or "pm"
  const timeParts = parts[0].split(":");
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = parseInt(timeParts[2]);

  if (period === "am") {
    if (hours === 12) hours = 0; // 12:xx am → midnight (0h)
  } else {
    if (hours !== 12) hours += 12; // 1pm–11pm → add 12; 12pm stays
  }

  return hours * 3600 + minutes * 60 + seconds;
}

// ── HELPER: total seconds → "h:mm:ss" ──
function secondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes < 10 ? "0" + minutes : "" + minutes;
  const ss = seconds < 10 ? "0" + seconds : "" + seconds;
  return hours + ":" + mm + ":" + ss;
}
// ── HELPER: "h:mm:ss" → total seconds ──
function durationToSeconds(durationStr) {
  durationStr = durationStr.trim();
  const parts   = durationStr.split(":");
  const hours   = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}

// ── HELPER: Read shifts from text file into array of objects ──
function readShifts(textFile) {
  const content = fs.readFileSync(textFile, "utf8");
  const lines = content.split("\n");
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    const cols = line.split(",");
    if (cols[0].trim() === "DriverID") continue; // skip header
    rows.push({
      driverID:      cols[0].trim(),
      driverName:    cols[1].trim(),
      date:          cols[2].trim(),
      startTime:     cols[3].trim(),
      endTime:       cols[4].trim(),
      shiftDuration: cols[5].trim(),
      idleTime:      cols[6].trim(),
      activeTime:    cols[7].trim(),
      metQuota:      cols[8].trim() === "true",
      hasBonus:      cols[9].trim() === "true",
    });
  }
  return rows;
}
// ── HELPER: Write array of objects back to text file ──
function writeShifts(textFile, rows) {
  const lines = rows.map(function(r) {
    return [
      r.driverID, r.driverName, r.date,
      r.startTime, r.endTime, r.shiftDuration,
      r.idleTime, r.activeTime, r.metQuota, r.hasBonus
    ].join(",");
  });
  fs.writeFileSync(textFile, lines.join("\n"), "utf8");
}

// ── HELPER: total seconds → "hhh:mm:ss" (for Function 8) ──
function secondsToLongDuration(totalSeconds) {
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes < 10 ? "0" + minutes : "" + minutes;
  const ss = seconds < 10 ? "0" + seconds : "" + seconds;
  return hours + ":" + mm + ":" + ss;
}

// ============================================================
function getDayOfWeek(dateStr) {
  dateStr = dateStr.trim();
  const parts = dateStr.split("-");
  const year  = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
  const day   = parseInt(parts[2]);
  const d = new Date(year, month, day);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[d.getDay()];
}
// ── HELPER: Read rates from text file into array of objects ──
function readRates(rateFile) {
  const content = fs.readFileSync(rateFile, "utf8");
  const lines = content.split("\n");
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    const cols = line.split(",");
    if (cols[0].trim() === "DriverID") continue; // skip header
    rows.push({
      driverID: cols[0].trim(),
      dayOff:   cols[1].trim(),
      basePay:  parseInt(cols[2].trim()),
      tier:     parseInt(cols[3].trim()),
    });
  }
  return rows;
}

// ── FUNCTION 1 ──
function getShiftDuration(startTime, endTime) {
  const startSec = timeToSeconds(startTime);
  let endSec     = timeToSeconds(endTime);

  // If end is before start, it means the shift crossed midnight
  if (endSec < startSec) {
    endSec += 24 * 3600; 
  }

  const diff = endSec - startSec;
  return secondsToDuration(diff);
}

// ── FUNCTION 2 ──
function getIdleTime(startTime, endTime) {
  const startSec = timeToSeconds(startTime);
  const endSec   = timeToSeconds(endTime);

  const deliveryStart = 8  * 3600; //  8:00 AM = 28800 seconds
  const deliveryEnd   = 22 * 3600; // 10:00 PM = 79200 seconds

  let idleSec = 0;

  if (startSec < deliveryStart) {
    const idleBefore = Math.min(deliveryStart, endSec) - startSec;
    if (idleBefore > 0) idleSec += idleBefore;
  }

  
  if (endSec > deliveryEnd) {
    const idleAfter = endSec - Math.max(deliveryEnd, startSec);
    if (idleAfter > 0) idleSec += idleAfter;
  }

  return secondsToDuration(idleSec);
}
// ── FUNCTION 3 ──
function getActiveTime(shiftDuration, idleTime) {
  const shiftSec  = durationToSeconds(shiftDuration);
  const idleSec   = durationToSeconds(idleTime);
  const activeSec = shiftSec - idleSec;
  return secondsToDuration(activeSec);
}

// ── HELPER: Check if date is during Eid (April 10–30, 2025) ──
function isDuringEid(dateStr) {
  dateStr = dateStr.trim();
  const parts = dateStr.split("-");
  const year  = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day   = parseInt(parts[2]);
  return year === 2025 && month === 4 && day >= 10 && day <= 30;
}

// ── FUNCTION 4 ──
function metQuota(date, activeTime) {
  const activeSec = durationToSeconds(activeTime);

  let quotaSec;
  if (isDuringEid(date)) {
    quotaSec = 6 * 3600;              // 6:00:00
  } else {
    quotaSec = 8 * 3600 + 24 * 60;   // 8:24:00
  }

  return activeSec >= quotaSec;
}

// ── FUNCTION 5 ──
function addShiftRecord(textFile, shiftObj) {
  const rows = readShifts(textFile);

  // Check for duplicate: same driverID AND same date
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].driverID === shiftObj.driverID && rows[i].date === shiftObj.date) {
      return {};
    }
  }

  // Calculate derived fields
  const shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
  const idleTime      = getIdleTime(shiftObj.startTime, shiftObj.endTime);
  const activeTime    = getActiveTime(shiftDuration, idleTime);
  const quota         = metQuota(shiftObj.date, activeTime);

  const newRecord = {
    driverID:      shiftObj.driverID,
    driverName:    shiftObj.driverName,
    date:          shiftObj.date,
    startTime:     shiftObj.startTime.trim(),
    endTime:       shiftObj.endTime.trim(),
    shiftDuration: shiftDuration,
    idleTime:      idleTime,
    activeTime:    activeTime,
    metQuota:      quota,
    hasBonus:      false,
  };

  // Find last index of this driverID
  let lastIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].driverID === shiftObj.driverID) {
      lastIndex = i;
    }
  }

  if (lastIndex === -1) {
    rows.push(newRecord);        // new driver → append at end
  } else {
    rows.splice(lastIndex + 1, 0, newRecord); // existing driver → insert after last record
  }

  writeShifts(textFile, rows);
  return newRecord;
}

// ── FUNCTION 6 ──
function setBonus(textFile, driverID, date, newValue) {
  const rows = readShifts(textFile);
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].driverID === driverID && rows[i].date === date) {
      rows[i].hasBonus = newValue;
      break;
    }
  }
  writeShifts(textFile, rows);
}

// ── FUNCTION 7 ──
function countBonusPerMonth(textFile, driverID, month) {
  const rows = readShifts(textFile);

  // Check if driverID exists at all
  let found = false;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].driverID === driverID) {
      found = true;
      break;
    }
  }
  if (!found) return -1;

  const targetMonth = parseInt(month); // handles both "04" and "4"
  let count = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.driverID !== driverID) continue;
    const rowMonth = parseInt(row.date.split("-")[1]);
    if (rowMonth === targetMonth && row.hasBonus === true) {
      count++;
    }
  }

  return count;
}

// ── FUNCTION 8 ──
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
  const rows = readShifts(textFile);
  const targetMonth = parseInt(month);
  let totalSec = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.driverID !== driverID) continue;
    const rowMonth = parseInt(row.date.split("-")[1]);
    if (rowMonth !== targetMonth) continue;
    totalSec += durationToSeconds(row.activeTime);
  }

  return secondsToLongDuration(totalSec);
}

// ── FUNCTION 9 ──
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
  const rows  = readShifts(textFile);
  const rates = readRates(rateFile);

  // Find driver's day off
  let dayOff = "";
  for (let i = 0; i < rates.length; i++) {
    if (rates[i].driverID === driverID) {
      dayOff = rates[i].dayOff;
      break;
    }
  }

  const targetMonth = parseInt(month);
  let totalRequiredSec = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.driverID !== driverID) continue;
    const rowMonth = parseInt(row.date.split("-")[1]);
    if (rowMonth !== targetMonth) continue;

    // Skip days off
    const dayOfWeek = getDayOfWeek(row.date);
    if (dayOfWeek === dayOff) continue;

    // Determine quota for that specific day
    let dailyQuotaSec;
    if (isDuringEid(row.date)) {
      dailyQuotaSec = 6 * 3600;            // 6 hours during Eid
    } else {
      dailyQuotaSec = 8 * 3600 + 24 * 60; // 8h 24m normal
    }

    totalRequiredSec += dailyQuotaSec;
  }

  // Deduct 2 hours per bonus
  totalRequiredSec -= bonusCount * 2 * 3600;
  if (totalRequiredSec < 0) totalRequiredSec = 0;

  return secondsToLongDuration(totalRequiredSec);
}

// ── FUNCTION 10 ──
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
  const rates = readRates(rateFile);

  let basePay = 0;
  let tier    = 0;

  for (let i = 0; i < rates.length; i++) {
    if (rates[i].driverID === driverID) {
      basePay = rates[i].basePay;
      tier    = rates[i].tier;
      break;
    }
  }

  // Allowed missing hours by tier
  const allowedMissingHours = { 1: 50, 2: 20, 3: 10, 4: 3 };
  const allowedSec = allowedMissingHours[tier] * 3600;

  const actualSec   = durationToSeconds(actualHours);
  const requiredSec = durationToSeconds(requiredHours);

  // No deduction if actual >= required
  if (actualSec >= requiredSec) return basePay;

  const missingSec = requiredSec - actualSec;

  // No deduction if missing is within allowed
  if (missingSec <= allowedSec) return basePay;

  // Billable missing hours after removing allowance (only full hours)
  const billableSec   = missingSec - allowedSec;
  const billableHours = Math.floor(billableSec / 3600);

  const deductionRatePerHour = Math.floor(basePay / 185);
  const salaryDeduction      = billableHours * deductionRatePerHour;

  return basePay - salaryDeduction;
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
