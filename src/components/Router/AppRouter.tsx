import type {FC} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type {AppState} from "../../redux/store.ts";
import ProjectsPage from "../Pages/ProjectsPage.tsx";
import AuthPage from "../Pages/AuthPage.tsx";
import ProjectDetailsPage from "../ProjectsComponents/ProjectDetailsPage.tsx";

const AppRouter: FC = () => {
    const isAuthenticated = useSelector((state: AppState) => state.systemData.isAuthorized);

    return (
        <Router>
            <Routes>
                {isAuthenticated ? (
                    <>
                        <Route path="/" element={<Navigate to="/ProjectsPage" replace />} />
                        <Route path="/ProjectsPage" element={<ProjectsPage />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<AuthPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                )}
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
