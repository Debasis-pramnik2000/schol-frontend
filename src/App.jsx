import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/Layout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import OnlineAdmission from './pages/OnlineAdmission';
import ApplicationStatus from './pages/ApplicationStatus';  // ✅ NEW

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentTimetable from './pages/student/Timetable';
import StudentResults from './pages/student/Results';
import StudentExams from './pages/student/Exams';
import StudentNotices from './pages/student/Notices';
import StudentProfile from './pages/student/Profile';
import StudentMaterials from './pages/student/Materials';
import StudentReportCard from './pages/student/ReportCard';
import StudentLeave from './pages/student/LeaveApplication';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherClasses from './pages/teacher/Classes';
import TeacherClassStudents from './pages/teacher/ClassStudents';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherAttendanceReport from './pages/teacher/AttendanceReport';
import TeacherMarks from './pages/teacher/Marks';
import TeacherStudentMarks from './pages/teacher/StudentMarks';
import TeacherMaterials from './pages/teacher/Materials';
import TeacherProfile from './pages/teacher/Profile';
import TeacherTimetable from './pages/teacher/Timetable';
import TeacherLeave from './pages/teacher/LeaveApplication';
import TeacherMyStudents from './pages/teacher/MyStudents';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminTeachers from './pages/admin/Teachers';
import AdminParents from './pages/admin/Parents';
import AdminClasses from './pages/admin/Classes';
import AdminSubjects from './pages/admin/Subjects';
import AdminTimetable from './pages/admin/Timetable';
import AdminAttendanceReports from './pages/admin/AttendanceReports';
import AdminExams from './pages/admin/Exams';
import AdminNotices from './pages/admin/Notices';
import AdminProfile from './pages/admin/Profile';
import AdminLeaves from './pages/admin/Leaves';
import AdminAdmissions from './pages/admin/Admissions';              // ✅ NEW
import AdminAdmissionDetail from './pages/admin/AdmissionDetail';    // ✅ NEW

// Parent Pages
import ParentDashboard from './pages/parent/Dashboard';
import ParentChildren from './pages/parent/Children';
import ParentChildAttendance from './pages/parent/ChildAttendance';
import ParentChildResults from './pages/parent/ChildResults';
import ParentProfile from './pages/parent/Profile';
import ParentNotices from './pages/parent/Notices';

// Common Pages
import ChangePassword from './pages/student/ChangePassword';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import About from './pages/About';
import SchoolInfo from './pages/about/SchoolInfo';
import Teachers from './pages/about/Teachers';
import Classes from './pages/about/Classes';
import Facilities from './pages/about/Facilities';
import Story from './pages/about/Story';
import Vision from './pages/about/Vision';
import Contact from './pages/about/Contact';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apply-online" element={<OnlineAdmission />} />
            <Route path="/application-status" element={<ApplicationStatus />} />  {/* ✅ NEW */}
             {/* ==================== ABOUT ROUTES ==================== */}
<Route path="/about" element={<About />} />
<Route path="/about/school-info" element={<SchoolInfo />} />
<Route path="/about/teachers" element={<Teachers />} />
<Route path="/about/classes" element={<Classes />} />
<Route path="/about/facilities" element={<Facilities />} />
<Route path="/about/story" element={<Story />} />
<Route path="/about/vision" element={<Vision />} />
<Route path="/about/contact" element={<Contact />} />
            {/* ==================== STUDENT ROUTES ==================== */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="timetable" element={<StudentTimetable />} />
              <Route path="results" element={<StudentResults />} />
              <Route path="exams" element={<StudentExams />} />
              <Route path="materials" element={<StudentMaterials />} />
              <Route path="notices" element={<StudentNotices />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="report-card" element={<StudentReportCard />} />
              <Route path="leaves" element={<StudentLeave />} />
            </Route>

            {/* ==================== TEACHER ROUTES ==================== */}
            <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="classes/:classId/students" element={<TeacherClassStudents />} />
              <Route path="attendance" element={<TeacherAttendance />} />
              <Route path="attendance/:classId" element={<TeacherAttendance />} />
              <Route path="attendance-report" element={<TeacherAttendanceReport />} />
              <Route path="marks" element={<TeacherMarks />} />
              <Route path="marks/:classId" element={<TeacherMarks />} />
              <Route path="marks/student/:studentId" element={<TeacherStudentMarks />} />
              <Route path="materials" element={<TeacherMaterials />} />
              <Route path="profile" element={<TeacherProfile />} />
              <Route path="timetable" element={<TeacherTimetable />} />
              <Route path="leaves" element={<TeacherLeave />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="students" element={<TeacherMyStudents />} />
            </Route>

            {/* ==================== ADMIN ROUTES ==================== */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* ✅ ADMISSIONS - NEW */}
              <Route path="admissions" element={<AdminAdmissions />} />
              <Route path="admissions/:id" element={<AdminAdmissionDetail />} />
              
              <Route path="students" element={<AdminStudents />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="parents" element={<AdminParents />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="subjects" element={<AdminSubjects />} />
              <Route path="timetable" element={<AdminTimetable />} />
              <Route path="attendance-reports" element={<AdminAttendanceReports />} />
              <Route path="exams" element={<AdminExams />} />
              <Route path="notices" element={<AdminNotices />} />
              <Route path="leaves" element={<AdminLeaves />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            {/* ==================== PARENT ROUTES ==================== */}
            <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']} />}>
              <Route path="dashboard" element={<ParentDashboard />} />
              <Route path="children" element={<ParentChildren />} />
              <Route path="attendance/:childId" element={<ParentChildAttendance />} />
              <Route path="results/:childId" element={<ParentChildResults />} />
              <Route path="notices" element={<ParentNotices />} />
              <Route path="profile" element={<ParentProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            {/* ==================== FALLBACK ==================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;