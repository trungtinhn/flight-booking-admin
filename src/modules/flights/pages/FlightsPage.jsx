import React, { useState } from "react";
import {
  Button,
  Flex,
  Space,
  Table,
  Tag,
  Typography,
  Input,
  Modal,
  message,
  Upload,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Column, ColumnGroup } = Table;
const { Search } = Input;
import "./FlightsPage.css";

const data = [
  {
    key: "1",
    firstName: "Vietnam Airlines",
    origin: "Ho Chi Minh",
    destination: "Ha Noi",
    duration: 2,
    tags: ["Active"],
  },
  {
    key: "2",
    firstName: "Vietjet Air",
    origin: "Ho Chi Minh",
    destination: "Ha Noi",
    duration: 4,

    tags: ["Cancelled"],
  },
  {
    key: "3",
    firstName: "Bamboo Airways",
    origin: "Ha Noi",
    destination: "My",
    duration: 2,

    tags: ["Active"],
  },
];

const uploadProps = {
  name: "file",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const FlightsPage = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Flights Management</Typography.Title>
      <Flex justify="space-between">
        <Search
          placeholder="Search flights"
          onSearch={onSearch}
          enterButton
          className="search-input"
        />
        <Button
          type="primary"
          style={{ backgroundColor: "#8DD3BB", fontWeight: 500 }}
          onClick={() => setModalOpen(true)}
        >
          Add Flight
        </Button>
        <Modal
          title="Add new flights"
          centered
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        >
          <Flex vertical align="center">
            <Upload {...uploadProps} accept=".csv">
              <Button icon={<UploadOutlined />}>Add by excel file</Button>
            </Upload>
            <Divider plain>Or</Divider>
            <p>some contents...</p>
          </Flex>
        </Modal>
      </Flex>
      <Table dataSource={data}>
        <Column title="ID" dataIndex="key" key="key" />
        <Column title="Name" dataIndex="firstName" key="firstName" />
        <Column title="From" dataIndex="origin" key="origin" />
        <Column title="To" dataIndex="destination" key="destination" />
        <Column title="Duration" dataIndex="duration" key="duration" />
        <Column
          title="Status"
          dataIndex="tags"
          key="tags"
          render={(tags) => (
            <>
              {tags.map((tag) => {
                let color;
                if (tag === "Active") {
                  color = "green";
                } else if (tag === "Cancelled") {
                  color = "red";
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          )}
        />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Button type="primary" style={{ backgroundColor: "#8DD3BB" }}>
                Edit
              </Button>
              <Button danger>Delete</Button>
            </Space>
          )}
        />
      </Table>
    </Flex>
  );
};

export default FlightsPage;
