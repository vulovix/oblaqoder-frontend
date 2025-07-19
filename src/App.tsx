import { MantineThemeProvider } from "./providers/MantineTheme";
import { BrowserRouter, Route, Routes } from "react-router";
import "~/styles/index.scss";
import { CollapseDesktopLayout } from "./components/Layout";
import { IndexRoute } from "./routes/Index";
import AuthProvider from "./providers/Auth";
import { AuthLayout } from "./components/Layout/Auth";
import AuthRoute from "./routes/Auth";

function App() {
  return (
    <MantineThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth"
              element={
                <AuthLayout>
                  <AuthRoute />
                </AuthLayout>
              }
            />
            <Route
              path="/:main/:section/:item"
              element={
                <CollapseDesktopLayout>
                  <IndexRoute />
                </CollapseDesktopLayout>
              }
            />
            <Route
              path="/:main/:section"
              element={
                <CollapseDesktopLayout>
                  <IndexRoute />
                </CollapseDesktopLayout>
              }
            />
            <Route
              path="/:main"
              element={
                <CollapseDesktopLayout>
                  <IndexRoute />
                </CollapseDesktopLayout>
              }
            />
            <Route
              index
              element={
                <CollapseDesktopLayout>
                  <IndexRoute />
                </CollapseDesktopLayout>
              }
            />
          </Routes>
          {/* <div>
          <CreatePost />
          <PostList />
        </div> */}
        </BrowserRouter>
      </AuthProvider>
    </MantineThemeProvider>
  );
}

export default App;
