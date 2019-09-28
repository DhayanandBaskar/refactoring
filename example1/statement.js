export function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));

  function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalvolumeCredits = totalvolumeCredits(statementData);
    return statementData;
  }

  function enrichPerformance(performance) {
    const result = Object.assign({}, performance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalvolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function playFor(performance) {
    return plays[performance.playID];
  }

  function amountFor(performance) {
    let amount = 0;
    switch (performance.play.type) {
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
        throw new Error(`unknown type: ${performance.play.type}`);
    }
    return amount;
  }

  function volumeCreditsFor(performance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(performance.audience - 30, 0);
    if ("comedy" === performance.play.type)
      volumeCredits += Math.floor(performance.audience / 5);
    return volumeCredits;
  }
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
