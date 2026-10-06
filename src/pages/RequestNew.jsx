import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getPriority, LEVELS, SLA_HOURS } from '../data/priority'
import { createRequest, nextRequestId } from '../api/requests'
import PriorityTag from '../components/PriorityTag'

// 분류 → 세부분류
const CATEGORIES = {
  '강의실 장비': ['프로젝터·빔', '음향·마이크', '전자칠판'],
  'IT 환경': ['네트워크·WiFi', 'PC·노트북', '계정·권한'],
  '출결·인증': ['출결 인증기·교육장 단말'],
  '학습 시스템': ['LMS·온라인 강의', '온라인 시험'],
  '시설': ['냉난방', '전원'],
}

const CATEGORY_NAMES = Object.keys(CATEGORIES)

function fmt(d) {
  const p = (n) => String(n).padStart(2, '0')
  return (
    d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
    ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
  )
}

function RequestNew() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [requester, setRequester] = useState('')
  const [category, setCategory] = useState(CATEGORY_NAMES[0])
  const [subCategory, setSubCategory] = useState(CATEGORIES[CATEGORY_NAMES[0]][0])
  const [impact, setImpact] = useState('보통')
  const [urgency, setUrgency] = useState('보통')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const priority = getPriority(impact, urgency)
  const dueAt = fmt(new Date(Date.now() + SLA_HOURS[priority] * 60 * 60 * 1000))

  function handleCategoryChange(e) {
    const next = e.target.value
    setCategory(next)
    setSubCategory(CATEGORIES[next][0])
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !requester.trim()) {
      setError('제목, 요청 내용, 요청자는 필수입니다.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const requestedAt = fmt(new Date())
      const id = await nextRequestId()

      const created = await createRequest({
        id: id,
        title: title.trim(),
        content: content.trim(),
        requester: requester.trim(),
        assignee: null,
        aiAssignee: null,
        requestedAt: requestedAt,
        dueAt: fmt(new Date(Date.now() + SLA_HOURS[priority] * 60 * 60 * 1000)),
        completedAt: null,
        status: '접수중',
        category: category,
        subCategory: subCategory,
        impact: impact,
        urgency: urgency,
        priority: priority,
        aiReason: '관리자가 직접 등록한 요청입니다.',
        history: [{ status: '접수중', at: requestedAt }],
      })

      navigate('/requests/' + created.id)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← 목록으로</Link>
      <h1 className="page-title">요청 등록</h1>
      <p className="result-count">새 요청을 접수합니다.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <section className="card">
          <h2 className="card-title">요청 내용</h2>

          <div className="field">
            <label htmlFor="title">제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="어떤 문제인지 한 줄로 적어주세요"
            />
          </div>

          <div className="field">
            <label htmlFor="content">요청 내용</label>
            <textarea
              id="content"
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="증상, 발생 위치, 영향 범위를 적어주세요"
            />
          </div>

          <div className="field">
            <label htmlFor="requester">요청자</label>
            <input
              id="requester"
              type="text"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              placeholder="이름"
            />
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">분류 및 판단</h2>

          <div className="field">
            <label htmlFor="category">분류</label>
            <select id="category" value={category} onChange={handleCategoryChange}>
              {CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="subCategory">세부분류</label>
            <select
              id="subCategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              {CATEGORIES[category].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="impact">영향도</label>
            <select id="impact" value={impact} onChange={(e) => setImpact(e.target.value)}>
              {LEVELS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="urgency">긴급도</label>
            <select id="urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
              {LEVELS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="prio-box">
            <span className="prio-label">우선순위</span>
            <PriorityTag priority={priority} />
            <span className="prio-note">영향도 + 긴급도 기준 시스템 자동 계산</span>
          </div>

          <div className="sla-box">
            <div><span>처리 기한</span><strong>{dueAt}</strong></div>
          </div>
        </section>

        <div className="form-actions">
          {error && <span className="form-err">{error}</span>}
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? '등록 중...' : '요청 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RequestNew