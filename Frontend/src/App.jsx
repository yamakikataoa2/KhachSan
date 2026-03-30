import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Import Components Khách
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Import Components Admin
import AdminNavbar from './components/AdminNavbar';
import AdminRooms from './pages/AdminRooms';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoomTypes from './pages/AdminRoomTypes';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
// --------------------------------------------------------
// 1. BỘ KHUNG CHO KHÁCH HÀNG (Có Navbar sáng màu và Footer)
// --------------------------------------------------------
const ClientLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* <Outlet /> chính là vị trí mà nội dung các trang (Home, Rooms...) sẽ được chèn vào */}
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

// --------------------------------------------------------
// 2. BỘ KHUNG CHO ADMIN (Có AdminNavbar tối màu, không có Footer)
// --------------------------------------------------------
const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

// --------------------------------------------------------
// 3. CẤU HÌNH ĐƯỜNG DẪN CHÍNH
// --------------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Nhóm 1: Tất cả các đường dẫn bọc trong ClientLayout */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slugOrId" element={<ServiceDetail />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Nhóm 2: Tất cả các đường dẫn bọc trong AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/room-types" element={<AdminRoomTypes />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          {/* Bạn sẽ thêm các trang admin/room-types, admin/bookings... vào đây sau */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;