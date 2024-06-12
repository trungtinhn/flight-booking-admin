import React, { useState, useEffect } from "react";
import {
    Button,
    Flex,
    Space,
    Table,
    Typography,
    Input,
    Modal,
    message,
    Form,
    Select,
} from "antd";
import axios from "axios";
import "./PricesPage.css";

interface Price {
    key: string;
    class: string;
    price: number; // Adjust the type based on your actual data
}

const { Column } = Table;
const { Search } = Input;

const PricesPage = () => {
    const [prices, setPrices] = useState<Price[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const response = await axios.get("https://flightbookingbe-production.up.railway.app/regulations/getRegulation");
            const { firstClassPrice, businessPrice, economyPrice } = response.data;

            setPrices([
                { key: "1", class: "First Class", price: firstClassPrice },
                { key: "2", class: "Business", price: businessPrice },
                { key: "3", class: "Economy", price: economyPrice }
            ]);
        } catch (error) {
            console.error("Error fetching prices:", error);
        }
    };


    const onSearch = (value) => {
        console.log(value);
    };

    const handleUpdatePrice = async (values) => {
        try {
            const { classType, price } = values;
            let updateUrl = "";

            switch (classType) {
                case "First Class":
                    updateUrl = "https://flightbookingbe-production.up.railway.app/regulations/updateFirstClassPrice";
                    break;
                case "Business":
                    updateUrl = "https://flightbookingbe-production.up.railway.app/regulations/updateBusinessPrice";
                    break;
                case "Economy":
                    updateUrl = "https://flightbookingbe-production.up.railway.app/regulations/updateEconomyPrice";
                    break;
                default:
                    break;
            }

            await axios.put(updateUrl, null, { params: { price } });
            message.success("Price updated successfully!");
            fetchPrices();
            setModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error("Failed to update price.");
            console.error("Error updating price:", error);
        }
    };

    return (
        <Flex vertical gap="large">
            <Typography.Title level={2}>Prices Management</Typography.Title>
            <Flex justify="space-between">
                <Search
                    placeholder="Search prices"
                    onSearch={onSearch}
                    enterButton
                    className="search-input"
                />
                <Button
                    type="primary"
                    style={{ backgroundColor: "#8DD3BB", fontWeight: 500 }}
                    onClick={() => setModalOpen(true)}
                >
                    Update Price
                </Button>
                <Modal
                    title="Update Price"
                    centered
                    open={modalOpen}
                    onOk={form.submit}
                    onCancel={() => setModalOpen(false)}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdatePrice}
                    >
                        <Form.Item
                            label="Class"
                            name="classType"
                            rules={[{ required: true, message: "Please select a class" }]}
                        >
                            <Select>
                                <Select.Option value="First Class">First Class</Select.Option>
                                <Select.Option value="Business">Business</Select.Option>
                                <Select.Option value="Economy">Economy</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: "Please enter a price" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Flex>
            <Table dataSource={prices}>
                <Column title="Class" dataIndex="class" key="class" />
                <Column title="Price" dataIndex="price" key="price" />
            </Table>
        </Flex>
    );
};

export default PricesPage;
