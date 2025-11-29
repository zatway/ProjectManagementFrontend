import type {FC, ReactNode} from "react";
import {ConfigProvider, theme} from "antd";

interface AppWrapperPropsInterface {
    children: ReactNode;
}

const AppWrapper: FC<AppWrapperPropsInterface> = ({children}) => {
    const customTheme = {
        algorithm: theme.defaultAlgorithm,
        token: {
            colorPrimary: '#208100',
            colorSuccess: '#52c41a',
            colorWarning: '#faad14',
            colorError: '#f5222d',

            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: 14,

            paddingXS: 8,
            borderRadius: 6,

            colorBgContainer: '#ffffff',
            colorText: 'rgba(0, 0, 0, 0.88)',
        },
    };

    return (
        <ConfigProvider theme={customTheme}>
            {children}
        </ConfigProvider>
    );
};

export default AppWrapper;
