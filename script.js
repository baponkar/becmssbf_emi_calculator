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
  let startDate = getDateFromInput("startDate");

  if (isNaN(A) || isNaN(T) || isNaN(R) || A <= 0 || T <= 0 || R < 0 || !startDate) {
    alert("⚠️ Please enter valid values and select a start date");
    return;
  }

  showSpinner("Calculating EMI...");

  setTimeout(() => {
    let months = T * 12;
    let principalPart = Math.floor((A / months) / 100) * 100;
    let resultHTML = "<h3>📅 EMI Schedule</h3><table><tr><th>#</th><th>Month</th><th>Principal</th><th>Interest</th><th>Total EMI</th></tr>";

    let remaining = A;

    for (let m = 1; m <= months; m++) {
      let interest = remaining * (R / 12 / 100);
      let principal = (m === months) ? remaining : principalPart;
      let emi = principal + interest;

      // Use modular calendar date
      let monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + m - 1, 1);
      let monthName = monthDate.toLocaleString('default', { month: 'short' });
      let year = monthDate.getFullYear();

      resultHTML += `<tr>
                      <td>${m}</td>
                      <td>${monthName} ${year}</td>
                      <td>${principal.toFixed(2)}</td>
                      <td>${interest.toFixed(2)}</td>
                      <td>${emi.toFixed(2)}</td>
                     </tr>`;

      remaining -= principal;
    }

    resultHTML += "</table>";
    document.getElementById("result").innerHTML = resultHTML;

    hideSpinner();
  }, 800);
}

// Set default loan start date = today
document.addEventListener("DOMContentLoaded", () => {
  setDefaultDate("startDate");
});


function printPDF() {
  let now = new Date();
  let dateTime = now.toLocaleString();
  document.getElementById("printInfo").innerHTML = "🖨 Printed on: " + dateTime;
  window.print();
}

function showLoading() {
  document.getElementById("loadingOverlay").style.visibility = "visible";
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.visibility = "hidden";
}

function calculateEMI() {
  let A = parseFloat(document.getElementById("amount").value);
  let T = parseInt(document.getElementById("years").value);
  let R = parseFloat(document.getElementById("rate").value);

  if (isNaN(A) || isNaN(T) || isNaN(R) || A <= 0 || T <= 0 || R < 0) {
    alert("⚠️ Please enter valid values");
    return;
  }

  showLoading();

  // Simulate processing delay for smooth animation
  setTimeout(() => {
    let months = T * 12;
    let principalPart = Math.floor((A / months) / 100) * 100;
    let resultHTML = "<h3>📅 EMI Schedule</h3><table><tr><th>#</th><th>Month</th><th>Principal</th><th>Interest</th><th>Total EMI</th></tr>";

    let remaining = A;
    let currentDate = new Date();

    for (let m = 1; m <= months; m++) {
      let interest = remaining * (R / 12 / 100);
      let principal = (m === months) ? remaining : principalPart;
      let emi = principal + interest;

      let monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + m - 1, 1);
      let monthName = monthDate.toLocaleString('default', { month: 'short' });
      let year = monthDate.getFullYear();

      resultHTML += `<tr>
                      <td>${m}</td>
                      <td>${monthName} ${year}</td>
                      <td>${principal.toFixed(2)}</td>
                      <td>${interest.toFixed(2)}</td>
                      <td>${emi.toFixed(2)}</td>
                     </tr>`;

      remaining -= principal;
    }

    resultHTML += "</table>";
    document.getElementById("result").innerHTML = resultHTML;

    hideLoading();
  }, 800); // delay to show animation
}
