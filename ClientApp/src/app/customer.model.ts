export interface Customer {
  id: number;
  fullName: string;
  gender: string;
  occupation: string;
  birthDate: Date;
  email: string;
  website: string;
  subscribeToAds: boolean;
  address: string;
  city: string;
  phoneNumbers: string[];
  notes: string;
}
