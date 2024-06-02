import React from "react";
import Chart from "chart.js/auto";

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Flex } from "antd";
import { Bar, Line } from "react-chartjs-2";

const options = {
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const OverviewPage = () => {
  return (
    <Flex vertical gap="large">
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Active Booking"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Revenue"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Active Flights"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#8DD3BB" }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ],
                datasets: [
                  {
                    type: "line",
                    label: "Revenue",
                    borderColor: "#8DD3BB",
                    borderWidth: 2,
                    fill: false,
                    data: [
                      200, 100, 400, 300, 500, 200, 400, 800, 500, 100, 400,
                      1200,
                    ],
                  },
                  {
                    type: "bar",
                    label: "Bookings",
                    backgroundColor: "#A7E6FF",
                    borderRadius: 10,
                    data: [
                      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100,
                      1200,
                    ],
                  },
                ],
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    type: "bar",
                    label: "Daily Flights",
                    backgroundColor: "#A1DD70",
                    borderRadius: 10,
                    barThickness: 12,
                    borderSkipped: false,
                    data: [100, 200, 300, 400, 500, 600, 700, 800],
                  },
                ],
              }}
            ></Bar>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
};

export default OverviewPage;
