// ---- Sample data: replace with your API / database results ----
const NOTIFICATIONS = [
  { icon: 'bi-check2-circle', title: 'Application approved', text: 'Your learner licence application APP-2026-0015 was approved.', time: '2 hours ago', unread: true },
  { icon: 'bi-calendar-event', title: 'Driving test scheduled', text: 'Your driving test is on 2026-11-04 at 10:30 AM.', time: '5 hours ago', unread: true },
  { icon: 'bi-file-earmark-text', title: 'Document needed', text: 'Please upload your medical certificate for APP-2026-0024.', time: 'Yesterday', unread: true },
  { icon: 'bi-mortarboard', title: 'Training update', text: 'Session 9 of 20 was recorded at Sai Motor Driving School.', time: '2 days ago', unread: false },
  { icon: 'bi-send', title: 'Application submitted', text: 'We received your application APP-2026-0031.', time: '3 weeks ago', unread: false },
]

export default function Notifications() {
  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <div className="eyebrow">Updates</div>
          <h1 className="page-title">Notifications</h1>
          <p className="text-muted mb-0">Updates on your applications, training and test.</p>
        </div>
        <button className="btn btn-outline-primary">Mark all as read</button>
      </div>

      <div className="card-soft py-2">
        {NOTIFICATIONS.map(n => (
          <div className={'activity px-2' + (n.unread ? ' unread' : '')} key={n.title}>
            <div className="icon-tile"><i className={'bi ' + n.icon} /></div>
            <div>
              <b>{n.title}</b>
              <div className="text-muted small">{n.text}</div>
              <small className="text-muted">{n.time}</small>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
