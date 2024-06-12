import Icon from "@ant-design/icons";

const VoucherSvg = () => (
    <svg
        width="1.5rem"
        height="1.5rem"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M19 6V9C18.1633 9 17.4189 9.31607 16.8787 9.87868C16.3385 10.4413 16.0503 11.2035 16.0806 11.9878C16.1108 12.7721 16.4577 13.5104 17.062 14.1148C17.6664 14.7192 18.4047 15.0661 19.189 15.0963C19.9733 15.1266 20.7355 14.8384 21.2981 14.2982C21.8597 13.7579 22.1758 13.0135 22.1758 12.177V6H19Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15 10L9 16L6 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9 16V18C9 18.2652 9.10536 18.5196 9.29289 18.7071C9.48043 18.8946 9.73478 19 10 19H14C14.2652 19 14.5196 18.8946 14.7071 18.7071C14.8946 18.5196 15 18.2652 15 18V16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const VoucherIcon = (props) => <Icon component={VoucherSvg} {...props} />;

export default VoucherIcon;
