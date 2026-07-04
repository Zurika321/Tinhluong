/*==================================================
    CONFIG
==================================================*/

const CONFIG = {
  WORK_START: 450, //07:30
  WORK_END: 16 * 60 + 30, //16:30

  OT_PER_HOUR: 30000,

  LATE_FINE_STEP: 30,
  //   LATE_FINE_MONEY: 30000,

  STANDARD_WORK_DAYS: 30,

  SUNDAY_END: 14 * 60,

  DEFAULT_START: "7h30",
  DEFAULT_END: "16h30",
};

DOM.textMode = document.getElementById("textMode");

DOM.calendarMode = document.getElementById("calendarMode");

DOM.calendarInput = document.getElementById("calendarInput");

function buildCalendarInput() {

    DOM.calendarInput.innerHTML = "";

    const month = Number(DOM.month.value);

    const totalDays = daysInMonth(month);

    for (let day = 1; day <= totalDays; day++) {

        const row = document.createElement("div");

        row.className = "day-row";

        row.innerHTML = `
            <label>
                <input type="checkbox" class="work-check">
                ${String(day).padStart(2, "0")}/${month}
            </label>

            <input type="time"
                   class="start"
                   value="07:30"
                   disabled>

            <input type="time"
                   class="end"
                   value="07:30"
                   disabled>
        `;

        const check = row.querySelector(".work-check");
        const start = row.querySelector(".start");
        const end = row.querySelector(".end");

        check.addEventListener("change", () => {

            if (check.checked) {

                start.disabled = false;
                end.disabled = false;

                if (!start.dataset.old) {

                    start.value = "07:30";
                    end.value = "16:30";

                } else {

                    start.value = start.dataset.old;
                    end.value = end.dataset.old;

                }

            } else {

                start.dataset.old = start.value;
                end.dataset.old = end.value;

                start.disabled = true;
                end.disabled = true;

                start.value = "07:30";
                end.value = "07:30";

            }

        });

        DOM.calendarInput.appendChild(row);

    }

}

check.dispatchEvent(new Event("change"));

        DOM.calendarInput.appendChild(row);

    }

}

document
.querySelectorAll("[name=inputMode]")
.forEach(r=>{

    r.onchange=()=>{

        let calendar=r.value=="calendar";

        DOM.textMode.hidden=calendar;

        DOM.calendarMode.hidden=!calendar;

        if(calendar){

            buildCalendarInput();

        }

    };

});

/*==================================================
    DOM
==================================================*/

const $ = (id) => document.getElementById(id);

const DOM = {
  month: $("month"),

  salary: $("salary"),

  allowance: $("allowance"),

  fullBonus: $("fullBonus"),

  otherBonus: $("otherBonus"),

  lateFine: $("lateFine"),

  otherCost: $("otherCost"),

  insurance: $("insurance"),

  workInput: $("workInput"),

  btnCalc: $("btnCalc"),

  btnClear: $("btnClear"),

  btnExample: $("btnExample"),

  btnPrint: $("btnPrint"),

  loading: $("loading"),

  toast: $("toast"),

  detailTable: $("detailTable").querySelector("tbody"),

  salaryTable: $("salaryTable"),
};



DOM.month.onchange=()=>{

    buildCalendarInput();

};

function getCalendarData(){

    let result=[];

    document
    .querySelectorAll(".day-row")
    .forEach((row,index)=>{

        let check=row.querySelector(".work-check");

        if(!check.checked)
            return;

        let start=row.querySelector(".start").value;

        let end=row.querySelector(".end").value;

        result.push({

            day:index+1,

            month:inputNumber(DOM.month),

            start:stringToMinute(start),

            end:stringToMinute(end),

            text:""

        });

    });

    return result;

}

/*==================================================
    REGEX
==================================================*/

// 1/6
const DATE_REGEX = /(\d{1,2})\/(\d{1,2})/;

//7h30-18h00
const TIME_REGEX = /(\d{1,2})[h:](\d{1,2})\s*-\s*(\d{1,2})[h:](\d{1,2})/i;

/*==================================================
    FORMAT
==================================================*/

function formatMoney(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function minuteToString(min) {
  let h = Math.floor(min / 60);

  let m = min % 60;

  return `${pad(h)}:${pad(m)}`;
}

/*==================================================
    TIME
==================================================*/

function parseMinute(hour, minute) {
  return Number(hour) * 60 + Number(minute);
}

function hourTextToMinute(h, m) {
  return parseMinute(h, m);
}

function diffMinute(start, end) {
  return end - start;
}

/*==================================================
    DATE
==================================================*/

function daysInMonth(month) {
  const year = new Date().getFullYear();

  return new Date(year, month, 0).getDate();
}

function isSunday(day, month) {
  const year = new Date().getFullYear();

  return new Date(year, month - 1, day).getDay() == 0;
}

// Viết cứng ngày lễ (dd/mm)
const HOLIDAYS = ["1/1", "30/4", "1/5", "2/9"];

function isHoliday(day, month) {
  return HOLIDAYS.includes(`${day}/${month}`);
}

/*==================================================
    INPUT
==================================================*/

function inputNumber(el) {
  return Number(el.value) || 0;
}

function getSalaryConfig() {
  return {
    month: inputNumber(DOM.month),

    salary: inputNumber(DOM.salary) || 6000000,

    allowance: inputNumber(DOM.allowance) || 30000,

    fullBonus: inputNumber(DOM.fullBonus) || 500000,

    otherBonus: inputNumber(DOM.otherBonus) || 0,

    otherCost: inputNumber(DOM.otherCost) || 0,

    insurance: inputNumber(DOM.insurance) || 557000,

    lateFine: inputNumber(DOM.lateFine) || 30000,
  };
}
/*==================================================
    TOAST
==================================================*/

function toast(message, type = "success") {
  DOM.toast.className = "";

  DOM.toast.classList.add(type);

  DOM.toast.classList.add("show");

  DOM.toast.innerHTML = message;

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    DOM.toast.classList.remove("show");
  }, 3000);
}

/*==================================================
    LOADING
==================================================*/

function loading(show) {
  if (show) DOM.loading.classList.remove("hidden");
  else DOM.loading.classList.add("hidden");
}

/*==================================================
    STORAGE
==================================================*/

function saveData() {
  localStorage.setItem(
    "salary_web",

    JSON.stringify({
      month: DOM.month.value,

      salary: DOM.salary.value,

      allowance: DOM.allowance.value,

      fullBonus: DOM.fullBonus.value,

      otherBonus: DOM.otherBonus.value,

      otherCost: DOM.otherCost.value,

      insurance: DOM.insurance.value,

      workInput: DOM.workInput.value,
    }),
  );
}

function loadData() {
  let data = localStorage.getItem("salary_web");

  if (!data) return;

  data = JSON.parse(data);

  DOM.month.value = data.month || 1;

  DOM.salary.value = data.salary || "";

  DOM.allowance.value = data.allowance || "";

  DOM.fullBonus.value = data.fullBonus || "";

  DOM.otherBonus.value = data.otherBonus || "";

  DOM.otherCost.value = data.otherCost || "";

  DOM.insurance.value = data.insurance || "";

  DOM.workInput.value = data.workInput || "";
}

/*==================================================
    CLEAR
==================================================*/

function clearAll() {
  if (!confirm("Xóa toàn bộ dữ liệu?")) return;

  localStorage.removeItem("salary_web");

  location.reload();
}
/*==================================================
    PARSER
==================================================*/

/*
Định dạng object trả về

{
    day: 1,
    month: 6,
    start: 445,
    end: 1080,
    text: "...",
    autoFill:false
}
*/

/*----------------------------------
    Parse 1 dòng
-----------------------------------*/

function parseLine(line) {
  line = line.trim();

  if (!line) return null;

  const dateMatch = line.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
  const timeMatch = line.match(
    /(\d{1,2})\s*[h:]\s*(\d{1,2})\s*-\s*(\d{1,2})\s*[h:]\s*(\d{1,2})/,
  );

  if (!dateMatch || !timeMatch) {
    return {
      error: "INVALID_FORMAT",
      raw: line,
    };
  }

  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);

  const start = parseMinute(timeMatch[1], timeMatch[2]);
  const end = parseMinute(timeMatch[3], timeMatch[4]);

  if (end <= start) {
    return {
      error: "INVALID_TIME",
      raw: line,
      day,
      month,
    };
  }

  return {
    day,
    month,
    start,
    end,
    text: line,
    autoFill: false,
  };
}

/*----------------------------------
    Parse toàn bộ textarea
-----------------------------------*/

function parseInput(text) {
  const result = [];
  const errors = [];

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const parsed = parseLine(line);

    if (!parsed) {
      continue;
    }

    if (parsed.error) {
      errors.push(parsed);
      continue;
    }

    result.push(parsed);
  }

  if (errors.length) {
    console.warn("Dòng lỗi:", errors);
    toast(`Có ${errors.length} dòng sai format (đã bỏ qua)`, "warning");
  }

  return result;
}

/*----------------------------------
    Kiểm tra trùng ngày
-----------------------------------*/

function checkDuplicateDays(data) {
  let map = new Map();

  for (const item of data) {
    const key = `${item.day}-${item.month}`;

    if (map.has(key)) {
      throw new Error(`Trùng ngày ${item.day}/${item.month}`);
    }

    map.set(key, true);
  }
}

/*----------------------------------
    Kiểm tra đúng tháng
-----------------------------------*/

function checkMonth(data, month) {
  const wrong = [];

  for (const item of data) {
    if (item.month != month) {
      wrong.push(item);
    }
  }

  if (wrong.length) {
    console.warn("Sai tháng:", wrong);

    toast(
      `Có ${wrong.length} dòng không thuộc tháng ${month} (đã bỏ qua)`,
      "warning",
    );

    return data.filter((d) => d.month == month);
  }

  return data;
}

/*----------------------------------
    Thiếu ngày
-----------------------------------*/

function getMissingDays(data, month) {
  const total = daysInMonth(month);

  let has = new Set();

  for (const item of data) {
    has.add(item.day);
  }

  let missing = [];

  for (let i = 1; i <= total; i++) {
    if (isSunday(i, month)) continue;

    if (!has.has(i)) missing.push(i);
  }

  return missing;
}

/*----------------------------------
    Tự thêm ngày
-----------------------------------*/

function autoFillMissingDays(data, missing, month) {
  for (const day of missing) {
    data.push({
      day,

      month,

      start: CONFIG.WORK_START,

      end: CONFIG.WORK_END,

      autoFill: true,

      text: "AUTO",
    });
  }

  data.sort((a, b) => a.day - b.day);
}

/*----------------------------------
    Validate toàn bộ
-----------------------------------*/

function validateInput() {
  const config = getSalaryConfig();

  // 1. fallback lương cơ bản
  if (!config.salary || config.salary <= 0) {
    config.salary = 6000000;
    toast("Chưa nhập lương cơ bản → đặt 6,000,000", "warning");
  }

  // 2. parse input an toàn
 let mode=document.querySelector("[name=inputMode]:checked").value;

let data=
mode=="text"
?parseInput(DOM.workInput.value)
:getCalendarData();

  // nếu không có dữ liệu → không crash
  if (data.length === 0) {
    toast("Không có dữ liệu chấm công", "error");
    return { config, data: [] };
  }

  // 3. xử lý trùng ngày (không throw)
  try {
    checkDuplicateDays(data);
  } catch (e) {
    toast(e.message, "warning");
  }

  // 4. check tháng (KHÔNG throw)
  data = checkMonth(data, config.month);

  // 5. thiếu ngày → tự động fill luôn (không confirm)
  let missing = getMissingDays(data, config.month);

  if (missing.length) {
    let ok = confirm(
      "Thiếu " +
        missing.length +
        " ngày tháng " +
        config.month +
        ":\n\n" +
        missing.join(", ") +
        "\n\n" +
        "Tự thêm các ngày này thành\n" +
        "07:30 - 16:30 ?",
    );
    if (ok) {
      toast(`Tự thêm ${missing.length} ngày thiếu (07:30-16:30)`, "info");
      autoFillMissingDays(data, missing, config.month);
    }
    // else {
    //   toast("Đã hủy tính lương.", "warning");
    //   return (null, null);
    // }
  }

  return {
    config,
    data,
  };
}

/*----------------------------------
    Debug
-----------------------------------*/

function printData(data) {
  console.table(
    data.map((e) => ({
      day: e.day,

      month: e.month,

      start: minuteToString(e.start),

      end: minuteToString(e.end),

      auto: e.autoFill,
    })),
  );
}
/*==================================================
    CALCULATOR - 3.1 CORE TIME LOGIC
==================================================*/

/*----------------------------------
    TÍNH PHÚT ĐI TRỄ
-----------------------------------*/

function calcLateMinutes(start) {
  // nếu đến trước hoặc đúng 07:30 thì không tính trễ
  if (start <= CONFIG.WORK_START) return 0;

  return start - CONFIG.WORK_START;
}

/*----------------------------------
    PHẠT ĐI TRỄ
    cứ 30 phút = 30k
-----------------------------------*/

function calcLatePenalty(lateMinutes, lateFinePer30Min) {
  if (lateMinutes <= 0) return 0;

  let blocks = Math.floor(lateMinutes / CONFIG.LATE_FINE_STEP);

  return blocks * (lateFinePer30Min == "" ? 30000 : lateFinePer30Min); //CONFIG.LATE_FINE_MONEY;
}

/*----------------------------------
    TÍNH OT NGÀY THƯỜNG
    sau 16:30
-----------------------------------*/

function calcOTWeekday(end) {
  if (end <= CONFIG.WORK_END) return 0;

  return end - CONFIG.WORK_END; // phút OT
}

/*----------------------------------
    TÍNH OT CHỦ NHẬT
    sau 14:00
-----------------------------------*/

function calcOTSunday(end) {
  if (end <= CONFIG.SUNDAY_END) return 0;

  return end - CONFIG.SUNDAY_END;
}

/*----------------------------------
    CHECK CHỦ NHẬT
-----------------------------------*/

function isSundayDay(day, month) {
  return isSunday(day, month);
}

/*----------------------------------
    XÁC ĐỊNH CÔNG NGÀY
-----------------------------------*/

function getWorkType(item) {
  // Chủ nhật
  if (isSunday(item.day, item.month)) return "SUNDAY";

  // Ngày thường
  return "NORMAL";
}

/*----------------------------------
    CHECK CÓ LÀM ĐỦ NGÀY KHÔNG
-----------------------------------*/

function isFullWorkDay(item) {
  let workMinutes = item.end - item.start;

  // coi >= 8h làm là full (480 phút)
  return workMinutes >= 8 * 60;
}
/*==================================================
    CALCULATOR - 3.2 DAILY CALC
==================================================*/

/*----------------------------------
    TÍNH TIỀN OT
-----------------------------------*/

function calcOTMoney(otMinutes) {
  if (otMinutes <= 0) return 0;

  let hours = otMinutes / 60;

  return hours * CONFIG.OT_PER_HOUR;
}

/*----------------------------------
    PHỤ CẤP NGÀY
-----------------------------------*/

function calcAllowance(config, isWork) {
  if (!isWork) return 0;

  return config.allowance ?? 30000;
}

/*----------------------------------
    TIỀN LƯƠNG 1 NGÀY
    baseSalary / 26
-----------------------------------*/

function calcBaseDailySalary(config) {
  return config.salary / CONFIG.STANDARD_WORK_DAYS;
}

/*----------------------------------
    LƯƠNG NGÀY THƯỜNG
-----------------------------------*/

function calcNormalSalary(baseDaily) {
  return baseDaily;
}

/*----------------------------------
    CHUYỂN ĐỔI 1 NGÀY HOÀN CHỈNH
-----------------------------------*/

function buildDailyResult(item, config) {
  let salaryBase = calcBaseDailySalary(config);

  let isSundayDayFlag = isSunday(item.day, item.month);
  let isHolidayFlag = isHoliday(item.day, item.month);

  let dailySalary;

  if (isSundayDayFlag) {
    dailySalary = (item.note == "Chủ nhật nghỉ" ? 1 : 2) * salaryBase;
  } else if (isHolidayFlag) {
    dailySalary = salaryBase * 2;
  } else {
    dailySalary = item.note == "Nghỉ" ? 0 : calcNormalSalary(salaryBase);
  }

  let late = calcLateMinutes(item.start);

  let latePenalty = calcLatePenalty(late, config.lateFine);

  let otMinutes = 0;

  let workDayValue = 1;

  // OT
  if (isSundayDayFlag) otMinutes = calcOTSunday(item.end);
  else otMinutes = calcOTWeekday(item.end);

  let otMoney = calcOTMoney(otMinutes);

  // phụ cấp
  let allowance = item.start == item.end ? 0 : calcAllowance(config, true);

  return {
    day: item.day,

    month: item.month,

    start: item.start,

    end: item.end,

    lateMinutes: late,

    latePenalty: latePenalty,

    otMinutes: otMinutes,

    otMoney: otMoney,

    workDay: item.start == item.end ? 0 : workDayValue,

    allowance: allowance,

    dailySalary: dailySalary,

    isSunday: isSundayDayFlag,

    autoFill: item.autoFill,

    text: item.text,

    note: isHolidayFlag
      ? "Lễ"
      : isSundayDayFlag
        ? "Chủ nhật"
        : late > 30
          ? "Đi trễ"
          : otMinutes > 180
            ? "OT nhiều"
            : "Bình thường",
  };
}
/*==================================================
    CALCULATOR - 3.3 FINAL AGGREGATION
==================================================*/

/*----------------------------------
    TÍNH TOÀN BỘ LƯƠNG
-----------------------------------*/

function isPaidSunday(day, month, data) {
  // Chủ nhật thì mới xét
  if (!isSunday(day, month)) return false;

  // Tìm ngày làm gần nhất trước CN
  let prev = day - 1;
  while (prev >= 1 && isSunday(prev, month)) prev--;

  // Tìm ngày làm gần nhất sau CN
  let next = day + 1;
  const last = daysInMonth(month);
  while (next <= last && isSunday(next, month)) next++;

  const hasPrev = data.some(d => d.day === prev);
  const hasNext = data.some(d => d.day === next);

  // Có làm cả trước hoặc sau thì tính lương CN
  return hasPrev || hasNext;
}

function calculateSalary(data, config) {
  let details = [];

  let totalLateMinutes = 0;
  let totalLatePenalty = 0;
  let totalOTMinutes = 0;
  let totalOTMoney = 0;
  let totalWorkDay = 0;
  let totalAllowance = 0;
  let totalDailySalary = 0;

  const workedDays = data.length;
  const allowPhep = workedDays >= 20;
  let usePhep = false;
  let nghiKhongPhep = false;

  const lastDay = daysInMonth(config.month);

  for (let day = 1; day <= lastDay; day++) {
    // tìm ngày chấm công
    let item = data.find((e) => e.day === day);

    // nếu không có thì tự tạo
    if (!item) {
      if (isSunday(day, config.month)) {
        item = {
          day,
          month: config.month,
          start: 450,
          end: 450,
          note: isPaidSunday(day, config.month, data)
                ? "Chủ nhật nghỉ"
                : "Nghỉ"
        };
      } else if (!usePhep && allowPhep) {
        usePhep = true;

        item = {
          day,
          month: config.month,
          start: 450,
          end: 990,
          note: "Nghỉ phép",
        };
      } else {
        nghiKhongPhep = true;

        item = {
          day,
          month: config.month,
          start: 450,
          end: 450,
          note: "Nghỉ",
        };
      }
    }

    let d = buildDailyResult(item, config);

    details.push(d);

    totalLateMinutes += d.lateMinutes;
    totalOTMinutes += d.otMinutes;
    totalOTMoney += d.otMoney;
    totalWorkDay += d.workDay;
    totalAllowance += d.allowance;
    totalDailySalary += d.dailySalary;
  }

  totalLatePenalty =
    Math.floor(totalLateMinutes / 30) * (config.lateFine ?? 30000);

  const baseDaily = calcBaseDailySalary(config);

  const fullAttendanceBonus =
    (!nghiKhongPhep ? config.fullBonus : 0) + (!usePhep ? baseDaily : 0);

  const totalIncome =
    totalDailySalary +
    totalOTMoney +
    totalAllowance +
    fullAttendanceBonus +
    config.otherBonus -
    config.otherCost -
    (config.insurance ?? 557000) -
    totalLatePenalty;

  return {
    details,
    summary: {
      totalLateMinutes,
      totalLatePenalty,
      totalOTMinutes,
      totalOTMoney,
      totalWorkDay,
      totalAllowance,
      fullAttendanceBonus,
      otherBonus: config.otherBonus,
      otherCost: config.otherCost,
      insurance: config.insurance,
      totalSalary: totalIncome,
    },
  };
}
/*==================================================
    RENDERER
==================================================*/

/*----------------------------------
    RENDER DETAIL TABLE
-----------------------------------*/

function renderDetailTable(details) {
  DOM.detailTable.innerHTML = "";

  for (let d of details) {
    let tr = document.createElement("tr");

    let timeHtml = "";

    if (d.note === "Nghỉ") {
      timeHtml = `<span class="error">Nghỉ</span>`;
    } else if (
      d.note === "Nghỉ phép" ||
      d.note === "Chủ nhật nghỉ"
    ) {
      timeHtml = `<span class="warning">${d.note}</span>`;
    } else if (d.isSunday) {
      timeHtml = `
        <span class="ok">
          ${minuteToString(d.start)} - ${minuteToString(d.end)}
        </span>
      `;
    } else {
      timeHtml = `
        ${minuteToString(d.start)}
        -
        ${minuteToString(d.end)}
      `;
    }

    tr.innerHTML = `
      <td>${d.day}/${DOM.month.value}</td>

      <td>${timeHtml}</td>

      <td>${d.workDay}</td>

      <td class="${d.lateMinutes > 0 ? "error" : "warning"}">
        ${d.lateMinutes}
      </td>

      <td class="ot">${(d.otMinutes / 60).toFixed(2)}</td>

      <td class="ok">${formatMoney(d.otMoney)}</td>

      <td>${formatMoney(d.allowance)}</td>

      <td>${formatMoney(d.dailySalary)}</td>

      <td class="ok">
        ${formatMoney(d.dailySalary + d.otMoney + d.allowance)}
      </td>
    `;

    DOM.detailTable.appendChild(tr);
  }
}

/*----------------------------------
    RENDER SUMMARY
-----------------------------------*/

function renderSummary(summary) {
  $("sumWork").innerText = summary.totalWorkDay;

  $("sumOT").innerText = (summary.totalOTMinutes / 60).toFixed(1) + "h";

  $("sumLate").innerText = summary.totalLateMinutes + "p";

  $("sumSalary").innerText = formatMoney(summary.totalSalary);

  $("tbWork").innerText = summary.totalWorkDay;

  $("tbOT").innerText = (summary.totalOTMinutes / 60).toFixed(2) + "h";

  $("tbLate").innerText = summary.totalLateMinutes;

  $("tbFine").innerText = formatMoney(summary.totalLatePenalty);

  $("tbMoneyOT").innerText = formatMoney(summary.totalOTMoney);

  $("tbAllowance").innerText = formatMoney(summary.totalAllowance);

  $("tbFullBonus").innerText = formatMoney(summary.fullAttendanceBonus);

  $("tbOtherBonus").innerText = formatMoney(summary.otherBonus);

  $("tbInsurance").innerText = formatMoney(summary.insurance);

  $("tbOtherCost").innerText = formatMoney(summary.otherCost);

  $("tbTotal").innerText = formatMoney(summary.totalSalary);
}

/*----------------------------------
    LOADING WRAPPER
-----------------------------------*/

function runWithLoading(fn) {
  loading(true);

  setTimeout(() => {
    try {
      const result = fn();

      // nếu fn trả false → không tiếp tục
      if (result === false) {
        loading(false);
        return;
      }
    } catch (e) {
      toast(e.message, "error");
    }

    loading(false);
  }, 300);
}

/*----------------------------------
    MAIN RENDER PIPELINE
-----------------------------------*/

function runCalculate() {
  runWithLoading(() => {
    const { config, data } = validateInput();
    if (!data || !config) return false;

    const result = calculateSalary(data, config);

    renderDetailTable(result.details);

    renderSummary(result.summary);

    saveData();

    toast("Tính lương thành công", "success");
    return true;
  });
}

/*----------------------------------
    INIT
-----------------------------------*/

function init() {
  loadData();

  DOM.btnCalc.onclick = runCalculate;

  DOM.btnClear.onclick = clearAll;

  DOM.btnExample.onclick = () => {
    DOM.workInput.value = `1/6 7h25-18h00
2/6 7h30-16h30
3/6 7h40-19h00
4/6 7h30-12h00`;

    toast("Đã tạo ví dụ", "success");
  };

  DOM.btnPrint.onclick = () => window.print();
}

/*----------------------------------
    AUTO START
-----------------------------------*/

init();
