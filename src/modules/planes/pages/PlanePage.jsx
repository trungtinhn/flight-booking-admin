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

const PlanePage = () => {
  const onSearch = (value, _e, info) => {
    setPlanes(
      planes.filter((item) => item.flightNumber.toString().includes(value))
    );
    console.log(info?.source, value);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAirlineData = async () => {
    try {
      const response = await axios.get(
        "https://flightbookingbe-production.up.railway.app/airlines"
      );

      setAirlines(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaneData = async () => {
    try {
      const response = await axios.get(
        "https://flightbookingbe-production.up.railway.app/airlines/get-all-plane"
      );
      console.log(response.data);

      setPlanes(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addPlane = async () => {
    try {
      console.log(selectedAirline);
      const response = await axios.post(
        `https://flightbookingbe-production.up.railway.app/airlines/create-new-plane?airlineId=${selectedAirline}`
      );
      fetchPlaneData();
      console.log(response);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlineData();
    fetchPlaneData();
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
          onOk={() => {
            addPlane();
            setModalOpen(false);
          }}
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
                <Select onChange={(value) => setSelectedAirline(value)}>
                  {airlines.map((airline) => (
                    <Select.Option key={airline.id} value={airline.id}>
                      {airline.airlineName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
      </Flex>
      <Table dataSource={planes}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column
          title="Flight Number"
          dataIndex="flightNumber"
          key="flightNumber"
        />

        <Column title="Airline" dataIndex="airlineId" key="airlineId" />
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
