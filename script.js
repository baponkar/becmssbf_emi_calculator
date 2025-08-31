// 📅 Calendar Helpers (Reusable)
function getDateFromInput(inputId) {
  const value = document.getElementById(inputId).value;
  return value ? new Date(value) : null;
}

function setDefaultDate(inputId, date = new Date()) {
  const input = document.getElementById(inputId);
  input.value = date.toISOString().split("T")[0]; // yyyy-mm-dd
}

// 🔹 Example usage for EMI Calculator
function calculateEMI() {
  let A = parseFloat(document.getElementById("amount").value);
  let T = parseInt(document.getElementById("years").value);
  let R = parseFloat(document.getElementById("rate").value);

  let startDateValue = document.getElementById("startDate").value;
  if (!startDateValue) {
    alert("⚠️ Please select a start date");
    return;
  }
  let startDate = new Date(startDateValue);

  if (isNaN(A) || isNaN(T) || isNaN(R) || A <= 0 || T <= 0 || R < 0 || !startDate) {
    alert("⚠️ Please enter valid values and select a start date");
    return;
  }

  setTimeout(() => {
    let months = T * 12;
    let principalPart = Math.floor((A / months) / 100) * 100;
    let remaining = A;

    let resultHTML = `
      <h3>📅 EMI Schedule</h3>
      <table>
        <tr>
          <th>Sr.</th>
          <th>Month</th>
          <th>Principal</th>
          <th>Interest</th>
          <th>Total EMI</th>
        </tr>
    `;

    for (let m = 1; m <= months; m++) {
      let principal = (m === months) ? remaining : principalPart;
      let interest;

      // First EMI is pro-rated for partial month
      if (m === 1) {
        let lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        let daysInMonth = lastDayOfMonth.getDate();
        let remainingDays = daysInMonth - startDate.getDate() + 1; // inclusive
        interest = remaining * (R / 12 / 100) * (remainingDays / daysInMonth);
      } else {
        interest = remaining * (R / 12 / 100); // full month
      }

      let emi = principal + interest;

      // Calculate month name and year
      let monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
      let monthName = monthDate.toLocaleString("default", { month: "short" });
      let year = monthDate.getFullYear();

      resultHTML += `
        <tr>
          <td>${m}</td>
          <td>${monthName} ${year}</td>
          <td>${principal.toFixed(2)}</td>
          <td>${interest.toFixed(2)}</td>
          <td>${emi.toFixed(2)}</td>
        </tr>
      `;

      remaining -= principal;
    }

    resultHTML += "</table>";
    document.getElementById("result").innerHTML = resultHTML;

  }, 800);

  alert("✅ Successfully Calculated EMI Schedule!");
}





function printPDF() {
  let now = new Date();
  let dateTime = now.toLocaleString();
  document.getElementById("printInfo").innerHTML = "🖨 Printed on: " + dateTime;
  window.print();
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Loan details
  let A = parseFloat(document.getElementById("amount").value);
  let T = parseInt(document.getElementById("years").value);
  let R = parseFloat(document.getElementById("rate").value);

  // 🔹 Calculate totals
  let months = T * 12;
  let remaining = A;
  let principalPart = Math.floor((A / months) / 100) * 100;
  let totalInterest = 0;

  for (let m = 1; m <= months; m++) {
    let interest = remaining * (R / 12 / 100);
    let principal = (m === months) ? remaining : principalPart;
    totalInterest += interest;
    remaining -= principal;
  }

  let totalPayment = A + totalInterest;

  // Title
  doc.setFontSize(18);
  doc.text("EMI Schedule", 14, 20);

  // Generated date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

  // Loan summary details
  doc.setFontSize(12);
  doc.text(`Loan Amount: ${A.toFixed(2)}`, 14, 40);
  doc.text(`Tenure: ${T} years (${months} months)`, 14, 48);
  doc.text(`Interest Rate: ${R}% p.a.`, 14, 56);
  doc.text(`Total Interest: ${totalInterest.toFixed(2)}`, 14, 64);
  doc.text(`Total Payment (Principal + Interest): ${totalPayment.toFixed(2)}`, 14, 72);

  // Convert EMI Table into PDF
  doc.autoTable({
    html: '#result table',
    startY: 80, // push table below summary
    styles: { fontSize: 9 },
    headStyles: { fillColor: [52, 152, 219] },
    theme: 'grid'
  });

  // Footer: URL
  doc.setFontSize(8);
  let currentURL = window.location.href;
  doc.text(`Source: ${currentURL}`, 14, doc.internal.pageSize.height - 10);

  // Save PDF
  doc.save('emi_schedule.pdf');

  alert("✅ Successfully PDF Downloaded!");
}





function showLoading() {
  document.getElementById("loadingOverlay").style.visibility = "visible";
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.visibility = "hidden";
}



