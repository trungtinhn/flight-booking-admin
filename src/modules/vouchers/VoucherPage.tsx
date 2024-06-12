import React, { useState, useEffect } from "react";
import {
    Button,
    Flex,
    Table,
    Typography,
    Modal,
    message,
    Form,
    Input,
    InputNumber,
    Upload,
    Space,
} from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { Voucher } from "./VoucherInterface.ts"; // Assuming Voucher interface exists
import "./VoucherPage.css";

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
            const response = await axios.get<Voucher[]>("http://localhost:7050/voucher/get-all");
            setVouchers(response.data);
        } catch (error) {
            console.error("Error fetching vouchers:", error);
            message.error("Failed to fetch vouchers!"); // Inform user about error
        }
    };

    const handleAddOrUpdateVoucher = async (values) => {
        try {
            let formData = new FormData();
            formData.append("Voucher Code", values.code);
            formData.append("Voucher Name", values.voucherName);
            formData.append("Voucher Discount", values.discountAmount);
            if (values.file) {
                formData.append("File", values.file.file);
            }

            const url = isEditing ? `http://localhost:7050/voucher/update/${currentVoucher?.id}` : "http://localhost:7050/voucher/add";
            const method = isEditing ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: formData,
                headers: isEditing ? {} : { 'Content-Type': 'multipart/form-data' }, // Content-Type header only needed for POST requests with file uploads
            });

            message.success(isEditing ? "Voucher updated successfully!" : "Voucher added successfully!");
            fetchVouchers();
            setModalOpen(false);
            form.resetFields();
            setIsEditing(false);
            setCurrentVoucher(null);
        } catch (error) {
            message.error("Failed to submit voucher.");
            console.error("Error submitting voucher:", error);
        }
    };

    const handleDeleteVoucher = async (id) => {
        try {
            await axios.delete(`http://localhost:7050/voucher/delete/${id}`);
            message.success("Voucher deleted successfully!");
            fetchVouchers();
        } catch (error) {
            message.error("Failed to delete voucher.");
            console.error("Error deleting voucher:", error);
        }
    };

    const handleEditVoucher = (record: Voucher) => { // Type assertion
        setIsEditing(true);
        setCurrentVoucher(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    return (
        <Flex vertical gap="large">
            <Typography.Title level={2}>Vouchers Management</Typography.Title>
            <Button
                type="primary"
                style={{ backgroundColor: "#8DD3BB", fontWeight: 500 }}
                onClick={() => setModalOpen(true)}
            >
                Add Voucher
            </Button>
            <Modal
                title={isEditing ? "Edit Voucher" : "Add Voucher"}
                centered
                open={modalOpen}
                onOk={form.submit}
                onCancel={() => {
                    setModalOpen(false);
                    form.resetFields();
                    setIsEditing(false);
                    setCurrentVoucher(null);
                }}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrUpdateVoucher}>
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
                        label="Voucher Discount"
                        name="discountAmount"
                        rules={[{ required: true, message: "Please enter discount amount" }]}
                    >
                        <InputNumber min={0} max={100} /> </Form.Item>
                    <Form.Item label="File" name="file">
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Table dataSource={vouchers} rowKey="id">
                <Column title="Code" dataIndex="code" key="code" />
                <Column title="Name" dataIndex="voucherName" key="voucherName" />
                <Column title="Discount" dataIndex="discountAmount" key="discountAmount" />
                <Column title="Image URL" dataIndex="voucherImageUrl" key="voucherImageUrl" render={(text) => <a href={text} target="_blank" rel="noopener noreferrer">View Image</a>} />
                <Column
                    title="Actions"
                    key="actions"
                    render={(_, record) => ( // Type assertion
                        <Space size="middle">
                            <Button type="primary" onClick={() => handleEditVoucher(record as Voucher)}>Edit</Button>
                            <Button danger onClick={() => handleDeleteVoucher((record as Voucher).id)}>Delete</Button>
                        </Space>
                    )}
                />
            </Table>
        </Flex >
    )
}
