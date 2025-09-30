// App.jsx - Component chính điều hướng toàn bộ ứng dụng
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Import các components và pages
import Dashboard from "./components/dashboard";
import MemberDashboard from "./components/member-dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin pages
import ManageCategory from "./pages/admin/category";
import ManageBike from "./pages/admin/bike";
import ManageUsers from "./pages/admin/users";
import ManageTransactions from "./pages/admin/transactions";
import AdminReports from "./pages/admin/reports";

// Member pages
import MemberProfile from "./pages/member/profile";
import PostListing from "./pages/member/post-listing";
import SearchBuy from "./pages/member/search-buy";
import MyListings from "./pages/member/my-listings";
import TransactionHistory from "./pages/member/transaction-history";
import Favorites from "./pages/member/favorites";

// Context để quản lý authentication
import { AuthProvider } from "./context/AuthContext";

function App() {
  // Định nghĩa router với các routes cho admin và member
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />, // Trang đăng nhập làm trang chủ
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    // Admin routes - Dashboard cho quản trị viên
    {
      path: "/admin",
      element: <Dashboard />,
      children: [
        {
          path: "bikes",
          element: <ManageBike />,
        },
        {
          path: "categories",
          element: <ManageCategory />,
        },
        {
          path: "users",
          element: <ManageUsers />,
        },
        {
          path: "transactions",
          element: <ManageTransactions />,
        },
        {
          path: "reports",
          element: <AdminReports />,
        },
      ],
    },
    // Member routes - Dashboard cho thành viên
    {
      path: "/member",
      element: <MemberDashboard />,
      children: [
        {
          path: "profile",
          element: <MemberProfile />,
        },
        {
          path: "post-listing",
          element: <PostListing />,
        },
        {
          path: "search-buy",
          element: <SearchBuy />,
        },
        {
          path: "my-listings",
          element: <MyListings />,
        },
        {
          path: "transactions",
          element: <TransactionHistory />,
        },
        {
          path: "favorites",
          element: <Favorites />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;