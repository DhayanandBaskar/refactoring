import TragedyCalculator from "./calculator/TragedyCalculator";
import ComedyCalculator from "./calculator/ComedyCalculator";

export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalvolumeCredits = totalvolumeCredits(statementData);
  return statementData;

  function enrichPerformance(performance) {
    const calculator = createPerformanceCalculator(
      performance,
      playFor(performance)
    );
    const result = Object.assign({}, performance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function createPerformanceCalculator(performance, play) {
    switch (play.type) {
      case "tragedy":
        return new TragedyCalculator(performance, play);
      case "comedy":
        return new ComedyCalculator(performance, play);
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
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
}
