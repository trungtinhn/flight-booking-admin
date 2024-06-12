import React, { useEffect, useState } from "react";
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
  Form,
  Radio,
  Select,
  TreeSelect,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Column, ColumnGroup } = Table;
const { Search } = Input;
import "./FlightsPage.css";
import axios from "axios";

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [airports, setAirports] = useState([]);

  const fetchAirportData = async () => {
    try {
      const response = await axios.get(
        "https://flightbooking-be.onrender.com/airports"
      );

      setAirports(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://flightbooking-be.onrender.com/flight/get-all-flight"
      );

      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAirportData();
  }, []);

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
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 10 }}
              layout="horizontal"
              size="middle"
              style={{ width: "100%" }}
              labelAlign="left"
            >
              <Form.Item label="From">
                <Select>
                  {airports.map((airport) => (
                    <Select.Option key={airport.id} value={airport.id}>
                      {airport.airportName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="To">
                <Select>
                  {airports.map((airport) => (
                    <Select.Option key={airport.id} value={airport.id}>
                      {airport.airportName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Departure Day">
                <DatePicker showTime />
              </Form.Item>
              <Form.Item label="Arrival Day">
                <DatePicker showTime />
              </Form.Item>
              <Form.Item label="Plane">
                <Select>
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                  <Select.Option value="3">3</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Status">
                <Select>
                  <Select.Option value="scheduled">SCHEDULED</Select.Option>
                  <Select.Option value="cancelled"> CANCELLED</Select.Option>
                  <Select.Option value="delay">DELAYED</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
      </Flex>
      <Table dataSource={data}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column
          title="From"
          dataIndex="departureAirportId"
          key="departureAirportId"
        />
        <Column
          title="To"
          dataIndex="arrivalAirportId"
          key="arrivalAirportId"
        />
        <Column
          title="Departure Day"
          dataIndex="departureDate"
          key="departureDate"
          render={(item) => {
            const date = new Date(item);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
            return <>{<span key={item}>{formattedDate}</span>}</>;
          }}
        />
        <Column
          title="Arrival Day"
          dataIndex="arrivalDate"
          key="arrivalDate"
          render={(item) => {
            const date = new Date(item);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
            return <>{<span key={item}>{formattedDate}</span>}</>;
          }}
        />
        <Column title="Duration" dataIndex="duration" key="duration" />
        <Column title="Plane" dataIndex="planeId" key="planeId" />
        <Column
          title="Status"
          dataIndex="flightStatus"
          key="flightStatus"
          render={(tags) => <>{<Tag key={tags}>{tags.toUpperCase()}</Tag>}</>}
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
