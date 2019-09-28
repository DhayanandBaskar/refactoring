export function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  return renderPlainText(statementData, plays);

  function enrichPerformance(performance) {
    const result = Object.assign({}, performance);
    return result;
  }
}

export function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}\n`;

  for (let performance of data.performances) {
    result += `  ${playFor(performance).name}: ${usd(
      amountFor(performance)
    )} (${performance.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalvolumeCredits()} credits\n`;
  return result;

  function totalAmount() {
    let totalAmount = 0;
    for (let performance of data.performances) {
      totalAmount += amountFor(performance);
    }
    return totalAmount;
  }

  function totalvolumeCredits() {
    let volumeCredits = 0;
    for (let performance of data.performances) {
      volumeCredits += volumeCreditsFor(performance);
    }
    return volumeCredits;
  }

  function usd(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount / 100);
  }

  function volumeCreditsFor(performance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(performance.audience - 30, 0);
    if ("comedy" === playFor(performance).type)
      volumeCredits += Math.floor(performance.audience / 5);
    return volumeCredits;
  }

  function amountFor(performance) {
    let amount = 0;
    switch (playFor(performance).type) {
      case "tragedy":
        amount = 40000;
        if (performance.audience > 30) {
          amount += 1000 * (performance.audience - 30);
        }
        break;
      case "comedy":
        amount = 30000;
        if (performance.audience > 20) {
          amount += 10000 + 500 * (performance.audience - 20);
        }
        amount += 300 * performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${playFor(performance).type}`);
    }
    return amount;
  }

  function playFor(performance) {
    return plays[performance.playID];
  }
}
