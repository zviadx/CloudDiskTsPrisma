
import FolderModal from "./components/FolderModal/FolderModal";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


const App = () => {


    return (
        <BrowserRouter>
            <div className="">
                <div className="fixed top-0 left-0 right-0 mb-9 z-10 bg-white/50">
                    <Navbar />
                </div>
                <div className="mt-20">
                
                        <Routes>
                            <Route path="/createFolder" element={<FolderModal />} />                            
                            <Route path="*" element={<Navigate to={`/`} />} />                           
                        </Routes>

                </div> 
            </div>


        </BrowserRouter>
    )
};

export default App;