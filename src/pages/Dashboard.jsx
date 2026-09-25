import { Link } from "react-router-dom";
import { requests } from "../data/requests";
import { STATUSES } from "../data/priority";
import StatusBadge, {STATUS_CLASS} from "../components/StatusBadge";
import PriorityTag from "../components/PriorityTag";
import StatCard from "../components/StatCard";

const OPEN = ['접수중', '배정완료', '처리중', '답변완료']

function toDate(s){
    return new Date(s.replace(' ', 'T'))
}

function Dashboard(){
    const NOW = new Date('2026-09-24T10:00:00')
    const now = NOW

    const openList = requests.filter((r) => OPEN.includes(r.status))
    const aiPending = requests.filter((r) => r.status === '접수중')
    const urgentList = openList.filter((r) => r.priority === '긴급' || r.priority === '높음')
    const slaRisk = openList.filter((r) => toDate(r.dueAt) - now < 4*60*60*1000)

    const statusCount = STATUSES.map((s) => ({
        status: s,
        count: requests.filter((r) => r.status === s).length,
    }))

    const assigness = [...new Set(openList.map((r) => r.assignee).filter(Boolean))]
    const byAssignee = assigness
    .map((name) => ({
        name,
        count: openList.filter((r) => r.assignee === name).length,
    }))
    .sort((a, b) => b.count - a.count)

    return(
        <div className="page">
            <h1 className="page-title">관리자 대시보드</h1>
            <p className="result-count">{now.toLocaleDateString('ko-KR')}</p>

            <div className="stat-grid">
                <StatCard tone="v" label="AI 승인 대기" value={aiPending.length} note="AI 분석 검토 필요"/>
                <StatCard tone="n" label="전체 미해결" value={openList.length} note="전체 미처리 요청"/>
                <StatCard tone="r" label="긴급 · 우선" value={urgentList.length} note="긴급 처리 필요"/>
                <StatCard tone="y" label="SLA 임박 · 초과" value={slaRisk.length} note="기한 모니터링 필요"/>
            </div>

            <section className="card">
                <h2 className="card-title">분류 및 배정 검토 대기</h2>
                {aiPending.length === 0? (
                    <p className="pre">검토 대기 중인 요청이 없습니다.</p>
                ) : (
                    <ul className="pending-list">
                        {aiPending.map((r) => (
                            <li key={r.id}>
                                <div className="pd-head">
                                    <Link to={'/requests/' + r.id}>{r.title}</Link>
                                    <PriorityTag priority={r.priority}/>
                                </div>
                                <span className="pd-id">{r.id}</span>
                                <div className="pd-tags">
                                    <span className="chip">분류: {r.category}</span>
                                    <span className="chip">영향도: {r.impact}</span>
                                    <span className="chip">긴급도: {r.urgency}</span>
                                </div>
                                <p className="pre pd-reason">{r.aiReason}</p>
                            </li>
                        ))}
                    </ul>  
                )}
            </section>

            <div className="dash-grid">
                <section className="card">
                    <h2 className="card-title">상태별 분포</h2>
                    <div className="bar">
                        {statusCount.map((s) => 
                        s.count === 0 ? null : (
                            <span key={s.status}
                            className={'seg ' + STATUS_CLASS[s.status]}
                            style={{width: (s.count / requests.length) * 100 + '%'}}
                            />
                        )
                        )}
                        </div>
                        <ul className="legend">
                            {statusCount.map((s)=> (
                                <li key={s.status}>
                                    <StatusBadge status={s.status}/>
                                    <b>{s.count}건</b>
                                </li>
                            ))}
                        </ul>
                        <p className="legend-total">전체 {requests.length}건</p>
                    
                </section>
                <section className="card">
                    <h2 className="card-title">담당자별 미해결 현황</h2>
                    <table className="assignee-table">
                        <thead>
                            <tr><th>담당자</th><th>미해결</th></tr>
                        </thead>
                        <tbody>
                            {byAssignee.map((a) => (
                                <tr key={a.name}>
                                    <td><span className="avatar">{a.name.slice(0,1)}</span>{a.name}</td>
                                    <td>{a.count}건</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>


            </div>

        </div>
    )
}

export default Dashboard