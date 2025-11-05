const fs = require("fs").promises;

async function analyzeCSV() {
  try {
    const data = await fs.readFile("./fe02_bank.csv", "utf-8");
    const lines = data.trim().split("\n");
    const header = lines[0].split(",").map(head => head.trim());

    const transactions = lines.slice(1).map(line => {
      const values = line.split(",").map(value => value.trim());
      const obj = {};
      header.forEach((head, i) => {
        obj[head] = values[i];
      });
      return obj;
    });

    const sorted_data = transactions.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    const summ_arr = {};

    sorted_data.forEach(element => {
      const name = element.AccountHolder;
      const amount = Number(element.Amount);
      const type = element.Type.toLowerCase();
      const remark = element.Remarks.toLowerCase();

      if (!summ_arr[name]) {
        summ_arr[name] = {
          AccountHolder: name,
          TotalCredit: 0,
          TotalDebit: 0,
          LargestTransaction: 0,
          SalaryTransactions: []
        };
      }

      if (type === "credit") summ_arr[name].TotalCredit += amount;
      else if (type === "debit") summ_arr[name].TotalDebit += amount;

      if (amount > summ_arr[name].LargestTransaction) {
        summ_arr[name].LargestTransaction = amount;
      }

      if (remark.includes("salary")) {
        summ_arr[name].SalaryTransactions.push(element.TransactionID);
      }
    });

    const summary_array = Object.values(summ_arr);
    const headerRow = "AccountHolder,TotalCredit,TotalDebit,LargestTransaction,SalaryTransactions";
    let csv = headerRow + "\n";

    for (let i = 0; i < summary_array.length; i++) {
      const user = summary_array[i];
      csv += `${user.AccountHolder},${user.TotalCredit},${user.TotalDebit},${user.LargestTransaction},"${user.SalaryTransactions.join(";")}"\n`;
    }

    await fs.writeFile("./bank_summary.csv", csv, "utf-8");
  } catch (err) {
    console.error("Error:", err);
  }
}
analyzeCSV();
