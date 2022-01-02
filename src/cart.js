import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';
import { calculateDiscount } from './discount.utils';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;
const MONEYZERO = Money({ amount: 0 });

export class Cart {
  items = [];

  add(item) {
    const itemToFind = { product: item.product };
    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }

    this.items.push(item);
  }

  remove(product) {
    remove(this.items, { product });
  }

  getTotal() {
    const total = this.items.reduce((acc, { quantity, product, condition }) => {
      const amount = Money({ amount: quantity * product.price });
      let discount = MONEYZERO;

      if (condition) {
        discount = calculateDiscount(amount, quantity, condition);
      }

      return acc.add(amount).subtract(discount);
    }, MONEYZERO);

    return total.getAmount(); // from dinero instance
  }

  summary() {
    const total = this.getTotal();
    const formatted = Money({ amount: total }).setLocale('pt-br').toFormat();
    return {
      total,
      formatted,
      items: this.items,
    };
  }

  checkout() {
    const summary = this.summary();

    this.items = [];

    return summary;
  }
}
