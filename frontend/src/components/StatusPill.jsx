// Colours for every status value used in your models
const TONE = {
  // green
  Approved: 'ok', Verified: 'ok', Completed: 'ok', 'Test Passed': 'ok', Passed: 'ok', Paid: 'ok',
  // amber
  Submitted: 'warn', Pending: 'warn', Scheduled: 'warn', Rescheduled: 'warn', 'Not Started': 'warn', 'Test Scheduled': 'warn',
  // blue
  'Under Verification': 'info', Training: 'info', 'In Progress': 'info', 'Ready for Test': 'info',
  // red
  Rejected: 'bad', 'Documents Rejected': 'bad', 'Test Failed': 'bad', Failed: 'bad', Absent: 'bad', Cancelled: 'bad',
}
export default function StatusPill({ status }) {
  return <span className={'pill ' + (TONE[status] || 'mute')}>{status}</span>
}
