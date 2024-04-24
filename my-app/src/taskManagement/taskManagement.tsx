import React, { useEffect, useState } from "react";
import dataDummy from "../dummy-data.json";
import { Button, DatePicker, Form, FormInstance, Input, Modal } from "antd";
import moment from "moment";
import dayjs from 'dayjs';
import { concat, filter, find, isEmpty, reduce } from "lodash";
import {
  CollectionCreateFormModalProps,
  CollectionCreateFormProps,
  TaskType,
  Values,
} from "./taskManagement.model";
import ManagementTable from "./managementTable";

const TaskManagement: React.FC = () => {
  const [taskList, setTaskList] = useState([] as TaskType[]);
  const [openModal, setOpenModal] = useState(false);
  const [taskEdit, setTaskEdit] = useState({});
  const { TextArea } = Input;

  useEffect(() => {
    const taskListJson = localStorage.getItem("task-list");
    if (taskListJson) {
      const taskList = JSON.parse(taskListJson);
      const newData = reduce(
        taskList,
        (result, task) => {
          const { startDate, endDate } = task;
          let status = moment().isBefore(moment(startDate))
            ? "open"
            : moment().isBefore(moment(endDate))
            ? "inProgress"
            : "late";
          return concat(result || [], {
            ...task,
            status: status,
          });
        },
        [] as TaskType[]
      );
      setTaskList(newData);
    } else {
      const newData = reduce(
        dataDummy,
        (result, task) => {
          const { startDate, endDate } = task;
          let status = moment().isBefore(moment(startDate))
            ? "open"
            : moment().isBefore(moment(endDate))
            ? "inProgress"
            : "late";
          return concat(result || [], {
            ...task,
            status: status,
          });
        },
        [] as TaskType[]
      );
      localStorage.setItem("task-list", JSON.stringify(newData));
      setTaskList(newData);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(taskList)) {
      localStorage.setItem("task-list", JSON.stringify(taskList));
    }
  }, [taskList]);

  const createTask = (values: Values) => {
    const { startDate, endDate } = values;
    let status = moment().isBefore(moment(startDate))
      ? "open"
      : moment().isBefore(moment(endDate))
      ? "inProgress"
      : "late";
    const newTask = {
      ...values,
      status,
      key: moment().valueOf().toString(),
    } as TaskType;
    setTaskList(concat(taskList, newTask));
    setOpenModal(false);
  };

  const updateTask = (values: Values) => {
    const { startDate, endDate } = values;
    let status = moment().isBefore(moment(startDate))
      ? "open"
      : moment().isBefore(moment(endDate))
      ? "inProgress"
      : "late";
    const newTask = {
      ...values,
      status,
      startDate: moment(values.startDate).format("YYYYMMDD"),
      endDate: moment(values.endDate).format("YYYYMMDD"),
    } as TaskType;
    const oldTask = filter(taskList, (task) => task.key !== values.key);
    setTaskList(concat(oldTask, newTask));
    setTaskEdit({});
    setOpenModal(false);
  };

  const deleteTask = (key: string) => {
    const newTaskList = filter(taskList, (task) => task.key !== key);
    setTaskList(newTaskList);
  };

  const editTask = (key: string) => {
    const taskEdit = find(taskList, (task) => task.key === key);
    if (!isEmpty(taskEdit)) {
      const values = {
        ...taskEdit,
        startDate: moment(taskEdit.startDate),
        endDate: moment(taskEdit.endDate),
      };
      setTaskEdit(values);
      setOpenModal(true);
    }
  };

  const FormInputTask: React.FC<CollectionCreateFormProps> = ({
    initialValues,
    onFormInstanceReady,
  }) => {
    const [form] = Form.useForm();
    const startDate = Form.useWatch("startDate", { form, preserve: true });
    const endDate = Form.useWatch("endDate", { form, preserve: true });
    useEffect(() => {
      onFormInstanceReady(form);
    }, []);
    return (
      <Form
        layout="vertical"
        form={form}
        name="form_in_modal"
        initialValues={initialValues}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Descriptions"
          name="descriptions"
          rules={[{ required: true, message: "Please input descriptions!" }]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          label="Start date"
          name="startDate"
          rules={[{ required: true, message: "Please input start date!" }]}
        >
          <DatePicker format="YYYY/MM/DD" maxDate={dayjs(endDate)} />
        </Form.Item>

        <Form.Item
          label="End date"
          name="endDate"
          rules={[{ required: true, message: "Please input end date!" }]}
        >
          <DatePicker format="YYYY/MM/DD" minDate={dayjs(startDate)} />
        </Form.Item>
      </Form>
    );
  };

  const FormModal: React.FC<CollectionCreateFormModalProps> = ({
    open,
    onCreate,
    onCancel,
    initialValues,
  }) => {
    const [formInstance, setFormInstance] = useState<FormInstance>();
    return (
      <Modal
        open={open}
        title="Create new task"
        okText={isEmpty(taskEdit) ? "Create" : "Update"}
        cancelText="Cancel"
        okButtonProps={{ autoFocus: true }}
        onCancel={onCancel}
        destroyOnClose
        onOk={async () => {
          try {
            const values = await formInstance?.validateFields();
            formInstance?.resetFields();
            const newValues = {
              ...values,
              key: initialValues.key,
              startDate: values.startDate.format("YYYYMMDD"),
              endDate: values.endDate.format("YYYYMMDD"),
            };
            onCreate(newValues);
          } catch (error) {
            console.log("Failed:", error);
          }
        }}
      >
        <FormInputTask
          initialValues={initialValues}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
        />
      </Modal>
    );
  };

  return (
    <>
      <Button
        className="ant-btn ant-btn-primary ant-btn-background-ghost add-btn"
        onClick={() => setOpenModal(true)}
      >
        + Add new task
      </Button>
      <ManagementTable
        taskList={taskList}
        editTask={editTask}
        deleteTask={deleteTask}
      />
      <FormModal
        open={openModal}
        onCreate={isEmpty(taskEdit) ? createTask : updateTask}
        onCancel={() => {
          setOpenModal(false);
          setTaskEdit({});
        }}
        initialValues={taskEdit}
      />
    </>
  );
};

export default TaskManagement;
