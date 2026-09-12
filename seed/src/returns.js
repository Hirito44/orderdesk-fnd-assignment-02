// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

/**
 * Open a return request against an order.
 *
 * @param {object} order  the order being returned against
 * @param {Array}  lines  the order lines the customer is sending back
 * @returns {object} the new return request
 */
function isOutsideReturnWindow(order, now = new Date()) {
  if (!order.deliveredAt) {
    return false;
  }

  const deliveredAt = new Date(order.deliveredAt);
  const elapsedMilliseconds = now.getTime() - deliveredAt.getTime();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return elapsedMilliseconds > thirtyDays;
}
function openReturn(order, lines) {
  if (isOutsideReturnWindow(order)) {
    throw new Error('a return is outside the 30-day return window');
  }

  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }

  return {
    orderId: order.id,
    lines,
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
  };
}

function approve(returnRequest, clerkId, reason) {
  if (!reason) {
    throw new Error('a refund approval must carry a reason');
  }

  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
    reason,
  };
}

module.exports = { openReturn, approve };
