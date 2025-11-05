const fs = require("fs").promises;
async function analyzeCSV() {
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
}
  const sorted_data = transactions.sort((a, b) => new Date(a.Date) - new Date(b.Date));
  
