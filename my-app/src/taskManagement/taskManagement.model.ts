import { FormInstance } from "antd";

export type TaskType = {
  key: string;
  title: string;
  descriptions: string;
  startDate: string;
  endDate: string;
  status: string;
};
export type Values = {
  key?: string;
  title?: string;
  descriptions?: string;
  startDate?: string;
  endDate?: string;
};
export type CollectionCreateFormProps = {
  initialValues: Values;
  onFormInstanceReady: (instance: FormInstance<Values>) => void;
};
export type CollectionCreateFormModalProps = {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  initialValues: Values;
};
export type DataIndex = keyof TaskType;
export type ManagementTableType = {
  taskList: TaskType[];
  editTask: (key: string) => void;
  deleteTask: (key: string) => void;
};
