import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { requests } from "../data/requests";
import { getPriority, LEVELS } from "../data/priority";
import StatusBadge from "../components/StatusBadge";
import PriorityTag from "../components/PriorityTag";

const ASSIGNEES = [...new Set(requests.map((r) => r.assignee).filter(Boolean))]

function RequestDetail(){
    const {id} = useParams ()
    const req = requests.find((r) => r.id === id)

    const [impact, setImpact] = useState(req?.impact || '보통')
    const [urgency, setUrgency] = useState(req?.urgency || '보통')
    const [assignee, setAssignee] = useState(req?.assignee || '')

    const priority = getPriority(impact,urgency)
    const changed = priority !== req?.priority

    if(!req){
        return(
            <div className="page">
                <Link to="/" className="back-link">← 목록으로</Link>
                <p className="empty">존재하지 않는 요청입니다.</p>
            </div>
        )
    }

    return(
        <div className="page">
            <Link to ="/" className="back-link">← 목록으로</Link>
            <div className="detail-head">
                <div>
                    <h1 className="page-title">{req.title}</h1>
                    <p className="result-count">{req.id}</p>
                </div>
                <div className="detail-tags">
                    <PriorityTag priority={req.priority}/>
                    <StatusBadge status={req.status}/>
                </div>
            </div>
            
            <div className="detail-grid">
                <div className="detail-main">
                    <section className="card">
                        <h2 className="card-title">AI 추천 vs 최종 적용</h2>
                        <table className="ai-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>AI 추천</th>
                                    <th>최종 적용</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>분류</th>
                                    <td>{req.category}</td>
                                    <td className="fixed">{req.category}</td>
                                </tr>
                                <tr>
                                    <th>세부분류</th>
                                    <td>{req.subCategory}</td>
                                    <td className="fixed">{req.subCategory}</td>
                                </tr>
                                <tr>
                                    <th>영향도</th>
                                     <td>{req.impact}</td>
                                     <td>
                                        <select value={impact} onChange={(e) => setImpact(e.target.value)}>{LEVELS.map((v) => <option key={v} value={v}>{v}</option>)}</select>
                                     </td>
                                </tr>
                                <tr>
                                    <th>긴급도</th>
                                    <td>{req.urgency}</td>
                                    <td>
                                        <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                                            {LEVELS.map((v) => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>담당자</th>
                                    <td>{req.aiAssignee}</td>
                                    <td>
                                        <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                                            <option value="">미배정</option>
                                            {ASSIGNEES.map((a) => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section className="card">
                        <h2 className="card-title">AI 판단 근거</h2>
                        <p className="pre">{req.aiReason}</p>
                    </section>
                    <section className="card">
                        <h2 className="card-title">우선순위 및 처리기한</h2>
                        <div className="prio-box">
                            <span className="prio-label">우선순위</span>
                            <PriorityTag priority={priority}/>
                            <div className="prio-note">영향도 + 긴급도 기준 시스템 자동 계산</div>
                        </div>
                        {changed && (
                            <p className="prio-changed">
                                AI 추천값({req.impact} / {req.urgency} 기준으로는 <b>{req.priority}</b> 였습니다.)
                            </p>
                        )}
                        <div className="sla-box">
                            <div><span>처리 기한</span><strong>{req.dueAt}</strong></div>
                            <div><span>완료 일시</span><strong>{req.completedAt || '미완료'}</strong></div>
                        </div>
                    </section>
                </div>
                <aside className="detail-side">
                <section className="card">
                    <h2 className="card-title">요청 정보</h2>
                    <dl className="info-list">
                        <div><dt>요청자</dt><dd>{req.requester}</dd></div>
                        <div><dt>담당자</dt><dd>{req.assignee || '미배정'}</dd></div>
                        <div><dt>요청일시</dt><dd>{req.requestedAt}</dd></div>
                        <div><dt>분류</dt><dd>{req.category}</dd></div>
                        <div><dt>세부분류</dt><dd>{req.subCategory}</dd></div>
                    </dl>
                    <div className="info-content">
                        <span className="info-label">요청 내용</span>
                        <p className="pre">{req.content}</p>
                    </div>
                </section>

                <section className="card">
                    <h2 className="card-title">진행 현황</h2>
                    <ol className="timeline">
                        {req.history.map((h, i)=> (
                            <li key={h.status} className={i === req.history.length - 1 ? 'on' : ''}>
                                <span className="tl-status">{h.status}</span>
                                <span className="tl-time">{h.at}</span>
                            </li>
                        ))}
                    </ol>
                </section>

            </aside>
            </div>
            
        </div>
    )
}

export default RequestDetail