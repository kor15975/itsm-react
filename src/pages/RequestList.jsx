import { useState } from "react";
import { requests } from "../data/requests";
import {STATUSES} from "../data/priority"
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import PriorityTag from "../components/PriorityTag";



function RequestList() {
const [keyword, setKeyword] = useState('')
const [status, setStatus] = useState('전체')

const visibleRequests = requests.filter((req) => {
    const text = (req.id + req.title + req.requester + (req.assignee || '')).toLowerCase()
    const matchKeyword = text.includes(keyword.toLowerCase())
    const matchStatus = status === '전체' || req.status === status
    return matchKeyword && matchStatus

})
const PER_PAGE = 10
const [page, setPage] = useState(1)

const totalPages = Math.ceil(visibleRequests.length / PER_PAGE)
const pageItems = visibleRequests.slice((page - 1) * PER_PAGE, page * PER_PAGE)

const pageNumbers = []
for (let i = 1 ; i <= totalPages; i++) pageNumbers.push(i)
  return (
    <div className="page">
      <h1 className="page-title">관리자 요청 목록</h1>
      <div className="toolbar">
        <input 
        type="text" 
        value={keyword}
        onChange={(e)=> {setKeyword(e.target.value); setPage(1)}}
        placeholder="번호 / 제목 / 요청자 / 담당자"
        />
    <select value={status} onChange={(e)=> {setStatus(e.target.value); setPage(1)}}>
        <option value="전체">상태 전체</option>
        {STATUSES.map((s) => (
            <option key ={s} value={s}>{s}</option>
        ))}
    </select>
<button className="btn-reset" onClick={() => {setKeyword(''); setStatus('전체'); setPage(1)}}>초기화</button>
      </div>
      <p className="result-count">총 {visibleRequests.length}건</p>
      {visibleRequests.length === 0 ? (<p className="empty">조건에 맞는 요청이 없습니다.</p>): 
      (<table className="req-table">
        <thead>
          <tr>
            <th>요청 번호</th>
            <th>요청 제목</th>
            <th>요청자</th>
            <th>요청일</th>
            <th>담당자</th>
            <th>마감 일시</th>
            <th>상태</th>
            <th>우선순위</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((req) => (
            <tr key={req.id}>
              <td className="col-id">{req.id}</td>
              <td className="col-title"><Link to={'/requests/' + req.id}>{req.title}</Link></td>
              <td>{req.requester}</td>
              <td>{req.requestedAt.slice(0, 10)}</td>
              <td>{req.assignee || "-"}</td>
              <td>{req.dueAt}</td>
              <td><StatusBadge status={req.status} /></td>
               <td><PriorityTag priority={req.priority} /></td>
              
            </tr>
          ))}
        </tbody>
      </table>
)}
{totalPages > 1 && (
    <div className="pagination">
        <button onClick={()=> setPage(page - 1 )} disabled={page === 1}>이전</button>
        {pageNumbers.map((n)=> (
            <button key={n} className={page === n ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
        ))}

        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>다음</button>
    </div>
)}
    </div>
  );
}

export default RequestList;
