import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Home } from "@/pages/Home";
import { CourseDetail } from "@/pages/CourseDetail";
import { NewReview } from "@/pages/NewReview";
import About from "@/pages/About";
import { AdminReview } from "@/pages/AdminReview";
import { Navbar } from "@/components/Navbar";
import { Toast } from "@/components/Toast";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 选课经验墙 · 学长学姐帮你避坑</p>
          <p className="mt-1">共建诚信社区，理性选课，拒绝恶意评价</p>
        </div>
      </footer>
      <Toast />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/course/:courseId", element: <CourseDetail /> },
      { path: "/review/new", element: <NewReview /> },
      { path: "/about", element: <About /> },
      { path: "/admin/review", element: <AdminReview /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
