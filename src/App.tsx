import store from "./redux/store.ts";
import {Provider} from "react-redux";
import AppWrapper from "./AppWrapper.tsx";
import AppRouter from "./components/Router/AppRouter.tsx";

function App() {

    return (
        <Provider store={store}>
            <AppWrapper>
                <AppRouter/>
            </AppWrapper>
        </Provider>
    )
}

export default App
