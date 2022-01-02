import Money from 'dinero.js';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;
const MONEYZERO = Money({ amount: 0 });

const calculatePercentageDiscount = (amount, { condition, quantity }) => {
  if (condition?.percentage && quantity > condition.minimum) {
    return amount.percentage(condition.percentage);
  }
  return MONEYZERO;
};

const calculateQuantityDiscount = (amount, { condition, quantity }) => {
  const isEven = quantity % 2 === 0;

  if (condition?.quantity && quantity > condition?.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }
  return MONEYZERO;
};

export const calculateDiscount = (amount, quantity, conditions) => {
  const conditionIsArray = Array.isArray(conditions);
  const list = conditionIsArray ? conditions : [conditions];

  const [higherDiscount] = list
    .map((cond) => {
      if (cond?.percentage) {
        return calculatePercentageDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount();
      } else if (cond?.quantity) {
        return calculateQuantityDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount();
      } else {
        return MONEYZERO.getAmount();
      }
    })
    .sort((a, b) => b - a);

  return Money({ amount: higherDiscount });
};
