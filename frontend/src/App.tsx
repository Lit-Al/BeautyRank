import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import AuthorizationPage from "./pages/AuthorizationPage/AuthorizationPage";
import SelectAvatarPage from "./pages/SelectAvatarPage/SelectAvatarPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import UserPage from "./pages/UserPage/UserPage";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from './redux/store'
import { useEffect } from "react";

function App() { 
  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
          <Routes>
            <Route path="/" element={<AuthorizationPage />} />
            <Route path="*" element={<AuthorizationPage />} />
            <Route path="/selectAvatar" element={<SelectAvatarPage />} />
            <Route path="/userPage" element={<UserPage />} />
          </Routes>
      </PersistGate>
    </Provider>
  );
}

export default App;