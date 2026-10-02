import { deliveryEstimate } from '../utils/deliveryEstimate.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export function DeliveryEstimate({ areaId }) {
  const { fee, etaLabel, areaName } = deliveryEstimate(areaId);

  return (
    <div className="estimate-box">
      <span className="estimate-box__item">
        <span aria-hidden="true">📍</span>
        <strong>{areaName}</strong>
      </span>
      <span className="estimate-box__item">
        <span aria-hidden="true">🛵</span>
        Delivery fee <strong className="price">{formatCurrency(fee)}</strong>
      </span>
      <span className="estimate-box__item">
        <span aria-hidden="true">⏱</span>
        Arrives in <strong>{etaLabel}</strong>
      </span>
    </div>
  );
}

export default DeliveryEstimate;
