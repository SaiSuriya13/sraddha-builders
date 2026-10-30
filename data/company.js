// Central source of truth for all company-level information.
// Every value mirrors the supplied company profile exactly.

export const company = {
  name: "SRADDHA BUILDERS",
  constitution: "Partnership Firm",
  operatingSince: 1999,
  operatingLocation: "Bangalore",
  partnersCount: "Two",
  partners: ["Mr. V. Sudheer Kumar", "Mr. M. Kiran Kumar"],
  legalAdvisor: "K.V.N. Narendra & Associates",
  addressLines: [
    "#3092, Ground Floor,",
    "Opp. E.S.I. Staff Quarters,",
    "Double Road,",
    "HAL II Stage,",
    "Indiranagar,",
    "Bangalore - 560 008.",
  ],
  email: "sraddhabuilders@gmail.com",
  landline: "25288923",
  phones: ["98451 98438", "94480 43646"],
  customerCareStatement:
    "We are committed to customer care and shall always be available to attend to any kind of assistance requested. We are confident of handling all kinds of challenging jobs with utmost diligence.",
};

// Google Maps directions link built from the verified office address.
// No coordinates are invented — Maps resolves the written address itself.
// Address lines already carry trailing commas, so they are joined with a
// single space rather than a comma separator.
const directionsQuery = company.addressLines.join(" ");
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  directionsQuery
)}`;

export function telHref(phone) {
  return `tel:${phone.replace(/[\s-]/g, "")}`;
}

export function whatsappLink(message) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${number}${text ? `?text=${text}` : ""}`;
}