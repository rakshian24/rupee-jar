export interface ICreateTodoFormValueTypes {
  title: string;
  description: string;
  isCompleted: boolean;
}

export const InitCreateTodoFormValues: ICreateTodoFormValueTypes = {
  title: "",
  description: "",
  isCompleted: false,
};
