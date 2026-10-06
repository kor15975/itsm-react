const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_KEY

const headers = {
  apikey: KEY,
  Authorization: 'Bearer ' + KEY,
}

export async function fetchRequests() {
  const res = await fetch(
    URL + '/rest/v1/requests?select=*&order=requestedAt.desc',
    { headers }
  )

  if (!res.ok) {
    throw new Error('요청 목록을 불러오지 못했습니다 (' + res.status + ')')
  }

  return res.json()
}

export async function fetchRequest(id) {
  const res = await fetch(
    URL + '/rest/v1/requests?id=eq.' + id + '&select=*',
    { headers }
  )

  if (!res.ok) {
    throw new Error('요청을 불러오지 못했습니다 (' + res.status + ')')
  }

  const rows = await res.json()
  return rows[0] || null
}

export async function updateRequest(id, changes) {
  const res = await fetch(URL + '/rest/v1/requests?id=eq.' + id, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: 'Bearer ' + KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(changes),
  })

  if (!res.ok) {
    throw new Error('저장하지 못했습니다 (' + res.status + ')')
  }

  const rows = await res.json()
  return rows[0]
}


// 요청번호 생성 — 오늘 날짜의 마지막 번호를 찾아 +1
// 실제 서비스라면 서버에서 생성해야 합니다.
// 두 사람이 동시에 등록하면 같은 번호가 나올 수 있기 때문입니다.
export async function nextRequestId() {
  const now = new Date()
  const prefix =
    'REQ-' +
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')

  const res = await fetch(
    URL + '/rest/v1/requests?select=id&id=like.' + prefix + '*&order=id.desc&limit=1',
    { headers }
  )

  if (!res.ok) {
    throw new Error('요청번호를 생성하지 못했습니다 (' + res.status + ')')
  }

  const rows = await res.json()
  const last = rows[0] ? parseInt(rows[0].id.slice(-4), 10) : 0

  return prefix + '-' + String(last + 1).padStart(4, '0')
}

export async function createRequest(payload) {
  const res = await fetch(URL + '/rest/v1/requests', {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: 'Bearer ' + KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('등록하지 못했습니다 (' + res.status + ')')
  }

  const rows = await res.json()
  return rows[0]
}