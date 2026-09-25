export const STATUS_CLASS = {
  접수중: 'recv',
  배정완료: 'assigned',
  처리중: 'working',
  답변완료: 'answered',
  처리완료: 'done',
  반려: 'rejected',
}

function StatusBadge({ status }) {
  return <span className={'badge ' + STATUS_CLASS[status]}>{status}</span>
}

export default StatusBadge