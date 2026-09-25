const PRIORITY_CLASS = {
  긴급: 'urgent',
  높음: 'high',
  보통: 'mid',
  낮음: 'low',
}

function PriorityTag({ priority }) {
  return <span className={'prio ' + PRIORITY_CLASS[priority]}>{priority}</span>
}

export default PriorityTag