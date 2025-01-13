import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/auth.jsx";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import UnderMaintainanceFile from "./UnderMaintainanceFile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <AuthProvider>
      <BrowserRouter>
        <NotificationProvider>
          {/* <App /> */}
          <UnderMaintainanceFile />
        </NotificationProvider>
      </BrowserRouter>
    </AuthProvider>
  </>
);
