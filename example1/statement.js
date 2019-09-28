import createStatementData from "./createStatementData";

export function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

export function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;

  for (let performance of data.performances) {
    result += `  ${performance.play.name}: ${usd(performance.amount)} (${
      performance.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalvolumeCredits} credits\n`;
  return result;

  function usd(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount / 100);
  }
}
