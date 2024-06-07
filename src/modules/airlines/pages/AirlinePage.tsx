import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  TreeSelect,
  Typography,
  Upload,
  message,
} from "antd";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import React, { useState } from "react";
import "./AirlinePage.css";

const data = [
  {
    key: "1",
    name: "Vietnam Airlines",
    totalPlanes: "100",
    tags: ["Active"],
  },
  {
    key: "2",
    name: "Vietjet Air",
    totalPlanes: "100",
    duration: 4,

    tags: ["Offline"],
  },
  {
    key: "3",
    name: "Bamboo Airways",
    totalPlanes: "100",

    tags: ["Active"],
  },
];

const AirlinePage = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Airline Management</Typography.Title>
      <Flex justify="space-between">
        <Search
          placeholder="Search airlines"
          onSearch={onSearch}
          enterButton
          className="search-input"
        />
        <Button
          type="primary"
          style={{ backgroundColor: "#8DD3BB", fontWeight: 500 }}
          onClick={() => setModalOpen(true)}
        >
          Add Airline
        </Button>
        <Modal
          title="Add new airline"
          centered
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        >
          <Flex vertical align="center">
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size="middle"
              style={{ width: "100%" }}
            >
              <Form.Item label="Name">
                <Input />
              </Form.Item>
              <Form.Item label="Planes">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="Status">
                <Select>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="offline">Offline</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
      </Flex>
      <Table dataSource={data}>
        <Column title="ID" dataIndex="key" key="key" />
        <Column title="Name" dataIndex="name" key="name" />
        <Column
          title="Total Planes"
          dataIndex="totalPlanes"
          key="totalPlanes"
        />

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
                } else if (tag === "Offline") {
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

export default AirlinePage;
