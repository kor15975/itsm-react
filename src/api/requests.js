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