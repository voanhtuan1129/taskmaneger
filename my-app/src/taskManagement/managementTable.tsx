import React, { useRef, useState } from "react";
import {
  Button,
  Input,
  InputRef,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
} from "antd";
import moment from "moment";
import { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {
  DataIndex,
  ManagementTableType,
  TaskType,
} from "./taskManagement.model";

const ManagementTable = (props: ManagementTableType) => {
  const { taskList, editTask, deleteTask } = props;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<TaskType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps<TaskType>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Descriptions",
      dataIndex: "descriptions",
      key: "descriptions",
      ...getColumnSearchProps("descriptions"),
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) =>
        moment(a.startDate).toDate().valueOf() -
        moment(b.startDate).toDate().valueOf(),
      render: (_, { startDate }) => {
        const dateFormat =
          startDate.substring(0, 4) +
          "-" +
          startDate.substring(4, 6) +
          "-" +
          startDate.substring(6);
        return <span>{dateFormat}</span>;
      },
    },
    {
      title: "End date",
      key: "endDate",
      dataIndex: "endDate",
      sorter: (a, b) =>
        moment(a.endDate).toDate().valueOf() -
        moment(b.endDate).toDate().valueOf(),
      render: (_, { endDate }) => {
        const dateFormat =
          endDate.substring(0, 4) +
          "-" +
          endDate.substring(4, 6) +
          "-" +
          endDate.substring(6);
        return <span>{dateFormat}</span>;
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      ...getColumnSearchProps("status"),
      render: (_, { status, key }) => {
        switch (status) {
          case "late":
            return <Tag color={"volcano"}>Late</Tag>;
          case "open":
            return <Tag color={"green"}>Open</Tag>;
          case "inProgress":
            return <Tag color={"geekblue"}>In-Progress</Tag>;
          default:
            break;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, { key }) => {
        return (
          <div className="btn-wrap">
            <Button
              className="ant-btn ant-btn-primary ant-btn-background-ghost"
              onClick={() => editTask(key)}
            >
              Edit
            </Button>

            <Button
              className="ant-btn ant-btn-dangerous"
              onClick={() => deleteTask(key)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={taskList} className="table" />;
};

export default ManagementTable;
