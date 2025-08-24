import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import PrivateRoute from './routes/PrivateRoute'
import Dashboard from './pages/admin/Dashboard'
import ManageTasks from './pages/admin/ManageTasks'
import CreateTask from './pages/admin/CreateTask'
import ManageUser from './pages/admin/ManageUser'
import UserDashboard from './pages/User/UserDashboard'
import ViewTasksdetails from './pages/User/ViewTasksdetails'
import Mytasks from './pages/User/Mytasks'

const App = () => {
  return (
      <div>
        <Router>
            <Routes>
               <Route path='/login' element={<Login/>} />
               <Route path='/signup' element={<SignUp/>} />

               {/* <Route element={<PrivateRoute Roles={["admin"]}/>}> */}
                  <Route path='/admin/dashboard' element={<Dashboard />} />
                  <Route path='/admin/tasks' element={<ManageTasks/>} />
                  <Route path='/admin/create-task' element={<CreateTask/>} />
                  <Route path='/admin/users' element={<ManageUser/>} />
               {/* </Route> */}

               {/* <Route element={<PrivateRoute allowedRoles={["admin"]}/>}> */}
                  <Route path='/user/dashboard' element={<UserDashboard />} />
                  <Route path='/user/tasks' element={<Mytasks/>} />
                  <Route path='/user/task-details/:id' element={<ViewTasksdetails/>} />
               {/* </Route> */}
            </Routes>
        </Router>
      </div>
  )
}

export default App
