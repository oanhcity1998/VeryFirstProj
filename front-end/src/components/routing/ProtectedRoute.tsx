import { ROUTES_APP } from '@/app/routes';
import { Navigate, Outlet } from 'react-router-dom';

// Giả sử sessionId được lưu trong localStorage sau khi đăng nhập
const getSessionId = () => {
    return localStorage.getItem('sessionId'); // Hoặc lấy từ Redux store
};

const ProtectedRoute = () => {
    const sessionId = getSessionId();

    // Nếu không có sessionId, chuyển hướng đến trang NotAuthenticated
    if (!sessionId) {
        return <Navigate to={ROUTES_APP.notAuthenticated} replace />;
    }

    // Nếu có sessionId, cho phép truy cập các tuyến đường con
    return <Outlet />;
};

export default ProtectedRoute;