import { Route, Switch } from "wouter";

import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Book from "./pages/Book.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />

      <Route path="/onboarding" component={Onboarding} />
      <Route path="/book" component={Book} />
      <Route path="/dashboard" component={Dashboard} />

      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
    </Switch>
  );
}
