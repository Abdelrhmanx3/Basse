export const egyptianPhonePattern = /^01[0125][0-9]{8}$/;

export type CheckoutFields = {
  fullName: string;
  phone1: string;
  phone2: string;
  governorate: string;
  city: string;
  address: string;
};

export function validateCheckout(fields: CheckoutFields) {
  const errors: Partial<Record<keyof CheckoutFields, "required" | "phone">> = {};

  for (const field of ["fullName", "phone1", "phone2", "governorate", "city", "address"] as const) {
    if (!fields[field].trim()) errors[field] = "required";
  }

  for (const field of ["phone1", "phone2"] as const) {
    if (fields[field].trim() && !egyptianPhonePattern.test(fields[field].trim())) {
      errors[field] = "phone";
    }
  }

  return errors;
}
