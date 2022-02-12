import TabelArticles from './components/Articles';
import FormularArticle from './components/FormularArticle';
import FormularReference from './components/FormularReference';
import TabelReferences from './components/References';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TabelArticles />} />
          <Route path="/formularArticle" element={<FormularArticle />} />
          <Route path="/references" element={<TabelReferences />} />
          <Route path="/formularReference" element={<FormularReference />} />

         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
