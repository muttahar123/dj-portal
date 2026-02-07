import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import DashboardLayout from './components/DashboardLayout';
import useAuthStore from './store/useAuthStore';
import UserManagement from './pages/Admin/UserManagement';
import ClassManagement from './pages/Admin/ClassManagement';
import AuditLogs from './pages/Admin/AuditLogs';
import Attendance from './pages/Teacher/Attendance';
import TeacherAssignments from './pages/Teacher/TeacherAssignments';
import StudentAttendance from './pages/Student/StudentAttendance';
import StudentAssignments from './pages/Student/StudentAssignments';
import StudentSchedule from './pages/Student/StudentSchedule';
import Settings from './pages/Settings';
import Announcements from './pages/Admin/Announcements';
import AnnouncementsFeed from './pages/AnnouncementsFeed';
import Profile from './pages/Profile';


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isInitialLoad } = useAuthStore();

  if (isInitialLoad) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Dispatcher component to route user to correct dashboard sub-route
const DashboardDispatcher = () => {
  const { user } = useAuthStore();

  if (user?.role === 'ADMIN') return <AdminDashboard />;
  if (user?.role === 'TEACHER') return <TeacherDashboard />;
  return <StudentDashboard />;
};

// Dispatcher for announcements - Admin gets full CRUD, others get read-only
const AnnouncementsDispatcher = () => {
  const { user } = useAuthStore();

  if (user?.role === 'ADMIN') return <Announcements />;
  return <AnnouncementsFeed />;
};

function App() {
  const { checkAuth } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="App selection:bg-blue-500/30">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Index route for /dashboard resolves based on role */}
            <Route index element={<DashboardDispatcher />} />

            {/* Specific Admin Routes */}
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            } />

            <Route path="classes" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                <ClassManagement />
              </ProtectedRoute>
            } />

            <Route path="audit" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AuditLogs />
              </ProtectedRoute>
            } />

            <Route path="announcements" element={
              <ProtectedRoute>
                <AnnouncementsDispatcher />
              </ProtectedRoute>
            } />

            {/* Teacher Specific */}
            <Route path="attendance" element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <Attendance />
              </ProtectedRoute>
            } />

            <Route path="assignments" element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <TeacherAssignments />
              </ProtectedRoute>
            } />

            {/* Student Specific */}
            <Route path="student/attendance" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentAttendance />
              </ProtectedRoute>
            } />

            <Route path="student/assignments" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentAssignments />
              </ProtectedRoute>
            } />

            <Route path="schedule" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentSchedule />
              </ProtectedRoute>
            } />

            <Route path="settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;
