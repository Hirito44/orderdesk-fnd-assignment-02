// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

function isOutsideReturnWindow(order, now = new Date()) {
  if (!order.deliveredAt) {
    return false;
  }

  const deliveredAt = new Date(order.deliveredAt);
  const elapsedMilliseconds = now.getTime() - deliveredAt.getTime();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return elapsedMilliseconds > thirtyDays;
}

/**
 * Open a return request against an order.
 *
 * @param {object} order the order being returned against
 * @param {Array} lines the order lines the customer is sending back
 * @returns {object} the new return request
 */
function openReturn(order, lines) {
  // Product decision: undelivered orders are rejected by ODK-178.
  // The ODK-152 return-window rule applies only after delivery.
  if (!order || !order.deliveredAt) {
    throw new Error(
      'cannot open a return on an undelivered order; please cancel the order instead'
    );
  }

  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }

  if (isOutsideReturnWindow(order)) {
    throw new Error('a return is outside the 30-day return window');
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