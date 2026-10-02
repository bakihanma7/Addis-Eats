export function validateName(value = '') {
  const trimmed = value.trim();
  if (!trimmed) return 'Please enter your full name.';
  if (trimmed.length < 2) return 'Name must be at least 2 characters.';
  if (trimmed.length > 60) return 'Name must be 60 characters or fewer.';
  return '';
}

export function validatePhone(value = '') {
  const digits = value.trim().replace(/[\s()-]/g, '');
  if (!digits) return 'Please enter your phone number.';
  if (!/^(\+251|0)(9|7)\d{8}$/.test(digits)) {
    return 'Enter a valid Ethiopian mobile number, e.g. 0912345678 or +251912345678.';
  }
  return '';
}

export function validateArea(value = '') {
  if (!value) return 'Please choose a delivery area.';
  return '';
}

export function validateNote(value = '') {
  if (value.length > 200) return 'Notes must be 200 characters or fewer.';
  return '';
}

export function validateCheckoutForm({ name, phone, areaId, note }) {
  return {
    name: validateName(name),
    phone: validatePhone(phone),
    area: validateArea(areaId),
    note: validateNote(note),
  };
}
