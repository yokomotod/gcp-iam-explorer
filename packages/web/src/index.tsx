import CssBaseline from "@material-ui/core/CssBaseline";
import * as Sentry from "@sentry/browser";
import React from "react";
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://ed7ac40a58ca45968f9aead6489400a7@sentry.io/1871947",
  });
}

const ScrollToTop: React.FC = () => {
  const history = useHistory();

  React.useEffect(() => {
    if (history.action === "PUSH") {
      window.scrollTo(0, 0);
    }
  }, [history.location.pathname, history.action]);

  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const gtag: (...arg: any) => any;
const Tracker: React.FC = () => {
  const history = useHistory();

  React.useEffect(() =>
    history.listen((_location, _action) => {
      if (process.env.NODE_ENV === "production") {
        gtag("event", "page_view");
      }
    }),
  );

  return null;
};

const rootElement = document.getElementById("root");
const renderOrHydrate = rootElement?.hasChildNodes() ? render : hydrate;
renderOrHydrate(
  <React.StrictMode>
    <Router>
      <CssBaseline />
      <ScrollToTop />
      <Tracker />
      <App />
    </Router>
  </React.StrictMode>,
  rootElement,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
