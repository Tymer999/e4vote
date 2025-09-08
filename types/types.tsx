export interface Voter {
  name: string;
  email: string;
  uniqueField: string;
  password: string;
  verificationPhoto: string;
  phone: string;
  isVerified?: boolean;
}