import { Cart } from './cart';

const product1Mock = {
  title: 'Tenis',
  price: 35388, // 353,88
};

const product2Mock = {
  title: 'Camisa',
  price: 41872, // 418,72
};

describe('Cart', () => {
  let sut;

  beforeEach(() => {
    sut = new Cart();
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      const result = sut.getTotal();

      expect(result).toBe(0);
    });

    it('should multiply quantity and price an receive the total amount', () => {
      sut.add({
        product: product1Mock,
        quantity: 2, // 707,76
      });

      const result = sut.getTotal();

      expect(result).toBe(70776);
    });

    it('should ensure no more than on product exists at a time', () => {
      sut.add({
        product: product1Mock,
        quantity: 2, // 707,76
      });

      sut.add({
        product: product1Mock,
        quantity: 1, // 353,88
      });

      const result = sut.getTotal();

      expect(result).toBe(35388);
    });

    it('should update total when a product gets included and then removed', () => {
      sut.add({
        product: product1Mock,
        quantity: 1, // 353,88
      });

      sut.add({
        product: product2Mock,
        quantity: 1, // 418,72
      });

      sut.remove(product1Mock);

      const result = sut.getTotal();

      expect(result).toBe(41872);
    });
  });

  describe('summary()', () => {
    it('should return an object with the total and the list of items', () => {
      sut.add({
        product: product1Mock,
        quantity: 3, // 106164
      });

      sut.add({
        product: product2Mock,
        quantity: 2, // 83744
      });

      const result = sut.summary();

      expect(result).toMatchSnapshot();
      expect(result.total).toBeGreaterThan(0);
    });

    it('should include formatted amount in the summary', () => {
      sut.add({
        product: product1Mock,
        quantity: 3, // 106164
      });

      sut.add({
        product: product2Mock,
        quantity: 2, // 83744
      });

      const result = sut.summary();
      expect(result.formatted).toMatchInlineSnapshot(`"R$ 1.899,08"`);
    });
  });

  describe('checkout()', () => {
    it('should return an object with the total and the list of items', () => {
      sut.add({
        product: product1Mock,
        quantity: 3, // 106164
      });

      sut.add({
        product: product2Mock,
        quantity: 2, // 83744
      });

      const result = sut.checkout();

      expect(result).toMatchSnapshot();
    });

    it('should reset the cart when checkout() is called', () => {
      sut.add({
        product: product1Mock,
        quantity: 5, // 353,88
      });

      sut.checkout();

      const result = sut.getTotal();

      expect(result).toBe(0);
    });
  });

  describe('special conditions', () => {
    it('should apply percentage discount quantity above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };
      sut.add({
        product: product1Mock,
        condition,
        quantity: 5, // 353,88
      });

      expect(sut.getTotal()).toBe(123858);
    });

    it('should not apply percentage discount quantity above minimum does not pass', () => {
      // item.condition?.percentage && item.quantity > item.condition.minimum
      const condition = {
        percentage: 30,
        minimum: 10,
      };
      sut.add({
        product: product1Mock,
        condition,
        quantity: 5, // 353,88
      });

      expect(sut.getTotal()).toBe(176940);
    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      sut.add({
        product: product1Mock,
        condition,
        quantity: 4, // 353,88
      });

      expect(sut.getTotal()).toBe(70776);
    });

    it('should apply quantity discount for odd quantity', () => {
      const condition = {
        quantity: 2,
      };

      sut.add({
        product: product1Mock,
        condition,
        quantity: 5, // 353,88
      });

      expect(sut.getTotal()).toBe(106164);
    });

    // it('should not apply any discount when condition is empty', () => {
    //   const condition = {};

    //   sut.add({
    //     product: product1Mock,
    //     condition,
    //     quantity: 5, // 353,88
    //   });

    //   expect(sut.getTotal()).toBe(176940);
    // });

    // it('should not apply any discount when condition in an array is empty', () => {
    //   const condition = [{}, { quantity: 2 }];

    //   sut.add({
    //     product: product1Mock,
    //     condition,
    //     quantity: 5, // 353,88
    //   });

    //   expect(sut.getTotal()).toBe(176940);
    // });

    it('should not apply quantity discount when quantity is below or equal', () => {
      const condition = {
        quantity: 2,
      };

      sut.add({
        product: product1Mock,
        condition,
        quantity: 2, // 353,88
      });

      expect(sut.getTotal()).toBe(70776);
    });

    it('should receive two or more conditions and determine/apply the best discount. First Case', () => {
      const condition1 = {
        percentage: 30,
        minimum: 2,
      };

      const condition2 = {
        quantity: 2, // 707,76
      };

      sut.add({
        product: product1Mock,
        condition: [condition1, condition2],
        quantity: 5, // 353,88 -> 1.769,40
      });

      expect(sut.getTotal()).toBe(106164);
    });

    it('should receive two or more conditions and determine/apply the best discount. Second Case', () => {
      const condition1 = {
        percentage: 80,
        minimum: 2,
      };

      const condition2 = {
        quantity: 2, // 707,76
      };

      sut.add({
        product: product1Mock,
        condition: [condition1, condition2],
        quantity: 5, // 353,88 -> 1.769,40
      });

      expect(sut.getTotal()).toBe(35388);
    });

    it('should not apply conditions when condition is empty', () => {
      const condition2 = {};

      sut.add({
        product: product1Mock,
        condition: [condition2],
        quantity: 1, // 353,88
      });

      expect(sut.getTotal()).toBe(35388);
    });
  });
});
