import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";

function App() {
    return (
        <div>
            <Header />
            <div className="min-h-[90vh]  px-5 py-3 dark:bg-gray-800/90">
                <MainContent />
            </div>
            <Footer />
        </div>
    );
}

export default App;
