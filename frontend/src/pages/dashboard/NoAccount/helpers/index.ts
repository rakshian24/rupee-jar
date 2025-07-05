export interface ICreateAccFormValueTypes {
  balance: number;
  bankName: string;
  accountNumber: string;
}

export const InitialCreateAccFormValues: ICreateAccFormValueTypes = {
  balance: 0,
  bankName: "",
  accountNumber: "",
};
