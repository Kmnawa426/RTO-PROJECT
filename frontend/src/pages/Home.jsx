import axios from 'axios'
import { Link } from 'react-router-dom'
import { host } from '../../../Admin/src/Context/MyContext'
import { useContext, useEffect, useState } from 'react'
import { MyContainer } from '../Context/MyContext'
import Services from './Services'

// ---- Sample data: replace with your API / database results ----
// const USER_NAME = 'Priya'

// Journey steps are summarised from ApplicationStatus / TrainingStatus / TestStatus
const JOURNEY = [
  { label: 'Application', note: 'Approved', state: 'done', icon: 'bi-check-lg' },
  { label: 'Driving training', note: '45% complete', state: 'current', icon: 'bi-mortarboard' },
  { label: 'Driving test', note: 'Not scheduled yet', state: 'todo', icon: 'bi-calendar-event' },
  { label: 'Driving licence', note: 'After test', state: 'todo', icon: 'bi-person-vcard' },
]

const QUICK = [
  { title: 'Learner Licence', text: 'For first-time drivers', icon: 'bi-person-plus', to: '/apply?type=Learner%20Licence' },
  { title: 'Driving Licence', text: 'After training and test', icon: 'bi-person-vcard', to: '/apply?type=Driving%20Licence' },
  { title: 'Pay a fine', text: 'Search by vehicle number', icon: 'bi-receipt', to: '/fines' },
  { title: 'Driving school?', text: 'Register your school', icon: 'bi-building', to: '/school-register' },
]

const ACTIVITY = [
  { icon: 'bi-check2-circle', text: 'Your Learner Licence application was approved.', time: '2 hours ago' },
  { icon: 'bi-file-earmark-check', text: 'Your Adhaar Card was verified.', time: 'Yesterday' },
  { icon: 'bi-mortarboard', text: 'Training session 3 was completed at Sai Motor Driving School.', time: '2 days ago' },
  { icon: 'bi-send', text: 'Application submitted.', time: '3 days ago' },
]
const token = localStorage.getItem("UserToken")
export default function Home() {
  const context = useContext(MyContainer)
  const user = context.user
  return (
    <>
      {/* Hero */}
      <section className="hero mb-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="hero-chip">Your next step, made simple.</span>
            <h1>Welcome  {user?.FullName}</h1>
            <p className="fs-6 mb-4">Your applications, training, and driving journey — all in one place.</p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/services" className="btn btn-light">Apply for a Service</Link>
              <Link to="/applications" className="btn btn-outline-light">Track My Applications</Link>
            </div>
          </div>
          <div className="col-lg-5 d-none d-lg-block">
            {/* Replace this icon with your own hero image: <img src="/hero.jpg" className="img-fluid rounded-4" /> */}
            <div className="hero-art"><i className="bi bi-car-front-fill" /></div>
          </div>
        </div>
      </section>

      {/* Continue your journey */}
      {/* <section className="mb-5">
        <h2 className="section-title mb-3">Continue your journey</h2>
        <div className="card-soft">
          <div className="journey mb-4">
            {JOURNEY.map(s => (
              <div key={s.label} className={'j-step ' + s.state}>
                <div className="j-dot"><i className={'bi ' + s.icon} /></div>
                <b>{s.label}</b>
                <small>{s.note}</small>
              </div>
            ))}
          </div>
          <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top">
            <div className="flex-grow-1">
              <div className="small text-muted mb-1">Next step: finish your driving training</div>
              <div className="progress"><div className="progress-bar" style={{ width: '45%' }} /></div>
            </div>
            <Link to="/training" className="btn btn-primary">View training</Link>
          </div>
        </div>
      </section> */}


      {/* Quick services */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title">Quick services</h2>
          <Link to="/services" className="small fw-semibold">All services</Link>
        </div>
        <div className="row g-3">
          {QUICK.map(q => (
            <div className="col-sm-6 col-lg-3" key={q.title}>
              <Link to='/services' className="card-soft hover d-block text-reset">
                <div className="icon-tile mb-3"><i className={'bi ' + q.icon} /></div>
                <b>{q.title}</b>
                <div className="small text-muted">{q.text}</div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Services />
    </>
  )
}
