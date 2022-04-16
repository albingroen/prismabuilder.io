import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import Schema from "./routes/schemas/[schemaId]";
import Container from "./components/Container";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Container>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/schemas/:schemaId" element={<Schema />} />
        <Route path="/schemas/:schemaId/models/:modelId" element={<Schema />} />
      </Routes>
    </Container>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
