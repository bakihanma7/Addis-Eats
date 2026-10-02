export const DELIVERY_AREAS = [
  { id: 'bole', name: 'Bole', fee: 60, etaMin: 20, etaMax: 30 },
  { id: 'kazanchis', name: 'Kazanchis', fee: 50, etaMin: 15, etaMax: 25 },
  { id: 'cmcc', name: 'CMC', fee: 80, etaMin: 25, etaMax: 35 },
  { id: 'piassa', name: 'Piassa', fee: 90, etaMin: 30, etaMax: 40 },
  { id: 'merkato', name: 'Merkato', fee: 110, etaMin: 35, etaMax: 45 },
  { id: 'sarbet', name: 'Sarbet', fee: 70, etaMin: 20, etaMax: 30 },
  { id: 'gerji', name: 'Gerji', fee: 75, etaMin: 25, etaMax: 35 },
  { id: 'summit', name: 'Summit', fee: 85, etaMin: 30, etaMax: 40 },
];

export function getArea(areaId) {
  return DELIVERY_AREAS.find((area) => area.id === areaId);
}

export function deliveryEstimate(areaId) {
  const area = getArea(areaId) ?? DELIVERY_AREAS[1];
  return {
    fee: area.fee,
    etaLabel: `${area.etaMin}–${area.etaMax} min`,
    areaName: area.name,
  };
}
