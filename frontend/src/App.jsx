import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Request from "./components/Request";
import { Toaster } from "react-hot-toast";
import Error from "./components/Error";
import Home from "./components/Home";
import Memberships from "./components/Memberships";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import Chat from "./components/Chat";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="login" element={<Login />} />
          <Route path="feed" element={<Feed />} />
          <Route path="profile" element={<Profile />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Request />} />
          <Route path="memberships" element={<Memberships />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancel" element={<PaymentFailed />} />
          <Route path="chat/:id" element={<Chat />} />

          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
