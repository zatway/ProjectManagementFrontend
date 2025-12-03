import type {FC} from 'react';
import {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {AppState} from "../../redux/store.ts";
import ProjectsPage from "../Pages/ProjectsPage.tsx";
import AuthPage from "../Pages/AuthPage.tsx";
import ProjectDetailsPage from "../ProjectItemComponents/ProjectDetailsPage.tsx";
import {Button, Result} from "antd";
import {signalRService} from "../../signalR/SignalRService.ts";
import {setSignalRConnected} from "../../redux/slices/systemDataSlice.ts";

const AppRouter: FC = () => {
    const isAuthenticated = useSelector((state: AppState) => state.systemData.isAuthorized);
    const isSignalRConnected = useSelector((state: AppState) => state.systemData.isSignalRConnected);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated || isSignalRConnected) {
            return;
        }

        dispatch(setSignalRConnected(true));

        if (signalRService.getConnectionState() !== 'Connected') {
            signalRService.connect().catch(console.error);
        }
    }, [isAuthenticated, isSignalRConnected, dispatch]);

    return (
        <Router>
            <Routes>
                {isAuthenticated ? (
                    <>
                        <Route path="/" element={<Navigate to="/projects" replace />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<AuthPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                )}
                <Route path="/projects/:projectId" element={<ProjectDetailsPage openedTab='projectDetails' />} />
                <Route path="/projects/:projectId/reports" element={<ProjectDetailsPage openedTab='reportsList'  />} />
                <Route path="/projects/:projectId/stages" element={<ProjectDetailsPage openedTab='stagesList' />} />
                <Route path="/projects/*" element={<Result
                    status="404"
                    title="404"
                    subTitle="Страница не найдена"
                    extra={<Button type="primary" onClick={() => window.location.href = '/projects'}>Вернуться на главную</Button>}
                />}/>
            </Routes>
        </Router>
    );
};

export default AppRouter;
