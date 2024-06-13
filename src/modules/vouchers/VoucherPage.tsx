import React, { useState, useEffect } from "react";
import { Button, Table, Typography, Modal, message, Form, Input, InputNumber, Upload, Space } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { Voucher } from "./VoucherInterface";

const { Column } = Table;

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await axios.get<Voucher[]>("https://flightbookingbe-production.up.railway.app/voucher/get-all");
            setVouchers(response.data);
        } catch (error) {
            handleError("Error fetching vouchers:", error);
        }
    };

    const handleAddVoucher = async (values) => {
        try {
            const formData = new FormData();
            formData.append("File", values.file.file);
            formData.append("Voucher Code", values.code);
            formData.append("Voucher Name", values.voucherName);
            formData.append("Minimum Order", values.minOrder);
            formData.append("Voucher Discount", values.discountAmount);

            await axios.post("https://flightbookingbe-production.up.railway.app/voucher/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success("Voucher added successfully!");
            fetchVouchers();
            resetForm();
        } catch (error) {
            handleError("Failed to add voucher.", error);
        }
    };

    const handleUpdateVoucher = async (values) => {
        try {
            const formData = new FormData();
            formData.append("File", values.file.file);
            formData.append("Voucher Code", values.code);
            formData.append("Voucher Name", values.voucherName);
            formData.append("Minimum Order", values.minOrder);
            formData.append("Voucher Discount", values.discountAmount);

            await axios.put(`https://flightbookingbe-production.up.railway.app/voucher/update/${currentVoucher?.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success("Voucher updated successfully!");
            fetchVouchers();
            resetForm();
        } catch (error) {
            handleError("Failed to update voucher.", error);
        }
    };

    const handleDeleteVoucher = async (id) => {
        try {
            await axios.delete(`https://flightbookingbe-production.up.railway.app/voucher/delete/${id}`);
            message.success("Voucher deleted successfully!");
            fetchVouchers();
        } catch (error) {
            handleError("Failed to delete voucher.", error);
        }
    };

    const handleEditVoucher = (record: Voucher) => {
        setIsEditing(true);
        setCurrentVoucher(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const resetForm = () => {
        form.resetFields();
        setIsEditing(false);
        setCurrentVoucher(null);
        setModalOpen(false);
    };

    const handleError = (messageText, error) => {
        console.error(messageText, error);
        message.error(messageText);
    };

    return (
        <div>
            <Typography.Title level={2}>Vouchers Management</Typography.Title>
            <Button
                type="primary"
                style={{ backgroundColor: "#8DD3BB", fontWeight: 500 }}
                onClick={() => {
                    setModalOpen(true);
                    setIsEditing(false);
                }}
            >
                Add Voucher
            </Button>
            <Modal
                title={isEditing ? "Edit Voucher" : "Add Voucher"}
                centered
                visible={modalOpen}
                onOk={form.submit}
                onCancel={resetForm}
            >
                <Form form={form} layout="vertical" onFinish={isEditing ? handleUpdateVoucher : handleAddVoucher}>
                    <Form.Item
                        label="Voucher Code"
                        name="code"
                        rules={[{ required: true, message: "Please enter voucher code" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Voucher Name"
                        name="voucherName"
                        rules={[{ required: true, message: "Please enter voucher name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Minimum Order"
                        name="minOrder"
                        rules={[{ required: true, message: "Please enter minimum order amount" }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        label="Voucher Discount"
                        name="discountAmount"
                        rules={[{ required: true, message: "Please enter discount amount" }]}
                    >
                        <InputNumber min={0} max={100} />
                    </Form.Item>
                    <Form.Item label="File" name="file" valuePropName="file">
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Table dataSource={vouchers} rowKey="id">
                <Column title="Code" dataIndex="code" key="code" />
                <Column title="Name" dataIndex="voucherName" key="voucherName" />
                <Column title="Min Order" dataIndex="minOrder" key="minOrder" />
                <Column title="Discount" dataIndex="discountAmount" key="discountAmount" />
                <Column
                    title="Image URL"
                    dataIndex="voucherImageUrl"
                    key="voucherImageUrl"
                    render={(text) => <a href={text} target="_blank" rel="noopener noreferrer">View Image</a>}
                />
                <Column
                    title="Actions"
                    key="actions"
                    render={(_, record: Voucher) => (
                        <Space size="middle">
                            <Button type="primary" onClick={() => handleEditVoucher(record)}>Edit</Button>
                            <Button danger onClick={() => handleDeleteVoucher(record.id)}>Delete</Button>
                        </Space>
                    )}
                />
            </Table>
        </div>
    );
};

export default VoucherPage;
