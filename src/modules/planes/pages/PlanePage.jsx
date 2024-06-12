import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import axios from "axios";
import React, { useEffect, useState } from "react";

const data = [
  {
    key: "1",
    firstName: "Vietnam Airlines",

    tags: ["Active"],
  },
  {
    key: "2",
    firstName: "Vietjet Air",

    tags: ["Cancelled"],
  },
  {
    key: "3",
    firstName: "Bamboo Airways",

    tags: ["Active"],
  },
];

const PlanePage = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [modalOpen, setModalOpen] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://flightbooking-be.onrender.com/airlines"
      );
      console.log(response.data[0].logoUrl);
      setAirlines(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Planes Management</Typography.Title>
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
          Add Plane
        </Button>
        <Modal
          title="Add new planes"
          centered
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        >
          <Flex vertical align="center">
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 10 }}
              layout="horizontal"
              size="middle"
              style={{ width: "100%" }}
              labelAlign="left"
            >
              <Form.Item label="Airlines">
                <Select>
                  {airlines.map((airline) => (
                    <Select.Option key={airline.id} value={airline.id}>
                      {airline.airlineName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Status">
                <Select>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="cancelled"> Cancelled</Select.Option>
                  <Select.Option value="delay">Delayed</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
      </Flex>
      <Table dataSource={data}>
        <Column title="ID" dataIndex="key" key="key" />
        <Column title="Airline" dataIndex="firstName" key="firstName" />

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

export default PlanePage;
