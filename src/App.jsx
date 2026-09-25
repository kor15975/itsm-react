import{Routes, Route, NavLink} from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import RequestList from "./pages/RequestList";
import RequestDetail from './pages/RequestDetail';
import "./App.css";



function App() {
  return (
    <div className="app">
      <header className="gnb">
        <div className="gnb-inner">
          <div className="brand">
            <span className="brand-mark">IT</span>
            <div className="brand-text">
              <strong>다세대IT</strong>
              <small>교육기관 ITSM 통합 플랫폼</small>
            </div>
          </div>
          <nav className="gnb-nav">
            <NavLink to="/dashboard">대시보드</NavLink>
            <NavLink to="/" end>요청 목록</NavLink>
          </nav>
          <span className="gnb-user">2AD_관리자</span>
        </div>
      </header>
      <main>
        <Routes>
          <Route path='/' element={<RequestList/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path="/requests/:id" element={<RequestDetail/>}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
