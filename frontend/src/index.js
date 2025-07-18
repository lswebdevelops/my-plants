import React from "react";
import ReactDOM from "react-dom/client";
import HomeScreen from "./screens/HomeScreen";
import HomePlantScreen from "./screens/HomePlantScreen";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PlantsScreen from "./screens/PlantsScreen";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";
import App from "./App";

import ProfileScreen from "./screens/ProfileScreen";

import PlantListScreen from "./screens/admin/PlantListScreen";
import PlantEditScreen from "./screens/admin/PlantEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";

import BlogListScreen from "./screens/admin/BlogListScreen";
import BlogEditScreen from "./screens/admin/BlogEditScreen";
import BlogScreen from "./screens/BlogScreen";
import BlogDetailsScreen from "./screens/BlogDetailsScreen";
import BlogCreateScreen from "./screens/admin/BlogCreateScreen";

import UsersEmailListScreen from "./screens/admin/UsersEmailListScreen"; // Import UsersEmailListScreen
import UpcomingScreen from "./screens/UpcomingScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/plant/:id" element={<HomePlantScreen />} />
           <Route path="/login/" element={<LoginScreen />} /> 
           <Route path="/register/" element={<RegisterScreen />} />      
      <Route path="/plants" element={<PlantsScreen />} />

      <Route path="/blogs" element={<BlogScreen />} />
      <Route path="/blog/:id" element={<BlogDetailsScreen />} />
      <Route path="/upcoming" element={<UpcomingScreen />} />

      {/* user private route */}
      <Route path="" element={<PrivateRoute />}>     
      
        <Route path="/profile/" element={<ProfileScreen />} />
      </Route>

      {/* admin routes */}
      <Route path="" element={<AdminRoute />}>
    
        <Route path="/admin/plantlist/" element={<PlantListScreen />} />
        <Route
          path="/admin/plantlist/:pageNumber/"
          element={<PlantListScreen />}
        />
        <Route path="/admin/plant/:id/edit" element={<PlantEditScreen />} />
        <Route path="/admin/userlist/" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
        <Route path="/admin/email-list" element={<UsersEmailListScreen />} />
      
        {/* Blog admin routes */}
        <Route path="/admin/bloglist/" element={<BlogListScreen />} />{" "}
        <Route path="/admin/blog/create" element={<BlogCreateScreen />} />{" "}
        <Route path="/admin/blog/:id/edit" element={<BlogEditScreen />} />{" "}
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
