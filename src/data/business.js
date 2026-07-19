export const business = {
  name: 'Hadassah Lifestyle',
  owner: 'Ajoke Ola',
  phone: '+234 704 006 3000',
  whatsappNumber: '2347040063000',
  primaryEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '[professional email to be confirmed]',
  address: [
    'Shop 3, B10 Plaza',
    'B10 Street',
    'Citec Mbora Estate',
    'Along Jabi Airport Road',
    'Abuja, Nigeria',
  ],
};

export const whatsappHref = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
  'Hello Hadassah Lifestyle, I would love help choosing the right piece.',
)}`;
