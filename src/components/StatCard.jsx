function StatCard({label, value, note, tone}){
    return (
        <div className={'stat ' + tone}>
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}<em>건</em></strong>
        <span className="stat-note">{note}</span>
        </div>
    )
}

export default StatCard