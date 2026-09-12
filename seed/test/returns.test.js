const { openReturn } = require('../src/returns');

describe('openReturn - Delivery Validation (ODK-178)', () => {

  // Test 1: Ném lỗi nếu đơn hàng chưa giao (deliveredAt là null)
  it('should throw an error if order is not delivered', () => {
    const order = { id: 'ORD-123', deliveredAt: null };
    const lines = ['line-1'];

    expect(() => openReturn(order, lines)).toThrow(
      'cannot open a return on an undelivered order; please cancel the order instead'
    );
  });

  // Test 2: Ném lỗi nếu order không có thuộc tính deliveredAt
  it('should throw an error if order has missing deliveredAt property', () => {
    const order = { id: 'ORD-123' };
    const lines = ['line-1'];

    expect(() => openReturn(order, lines)).toThrow(
      'cannot open a return on an undelivered order; please cancel the order instead'
    );
  });

  // Test 3: Hoạt động bình thường nếu đơn hàng đã giao (có deliveredAt)
  it('should allow opening return if order is delivered', () => {
    const order = { id: 'ORD-123', deliveredAt: '2026-09-10T10:00:00Z' };
    const lines = ['line-1'];

    const returnRequest = openReturn(order, lines);
    expect(returnRequest.orderId).toBe('ORD-123');
    expect(returnRequest.lines).toEqual(['line-1']);
  });

});