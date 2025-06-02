import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Nhớ import CSS



// Custom Toast khi thêm sản phẩm thành công
export const showSuccessToast = (message) => {
    toast.success(message, {
        autoClose: 500,
        style: {
            background: "#4CAF50",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
    });
};

// Custom Toast khi xóa sản phẩm thành công
export const showDeleteToast = (message) => {
    toast.success(message, {
   
        style: {
            background: "#d32f2f",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
    });
};