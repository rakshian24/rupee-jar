export interface IRegisterFormValueTypes {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const InitialRegisterFormValues: IRegisterFormValueTypes = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};
