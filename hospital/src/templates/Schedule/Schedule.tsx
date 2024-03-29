import { Header } from 'src/molecules'
import './Schedule.scss'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { ReactComponent as Group } from 'src/public/Group.svg'
import { ReactComponent as Arrow } from 'src/public/CollapseArrow.svg'
import { useEffect, useState } from 'react'
import { getDoctorsSchedule } from 'src/api/Schedule/Schedule'
import { IDoctor } from 'src/redux/types/doctorsTypes'
import { DataPicker, Radio } from 'src/atoms'
import { DatePickerProps, RadioChangeEvent } from 'antd'
import { CALENDAR_OPTIONS, REQUEST, REQUEST_TYPE, VIEW } from 'src/constants'
import { Typography } from 'src/Typography'
import { EventPropGetter, EventType, ICustomHeader, ICustomTooolbar, View } from './SheduleType'
import classNames from 'classnames'

export const Schedule = () => {
  const uuid = localStorage.getItem('uuid') as string
  const [time, setTime] = useState<IDoctor[]>([])
  const [view, setView] = useState<View>('week')
  const [requestType, setRequestType] = useState<string>(REQUEST.MY)
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(moment())
  const [eventDateAfter, setEventDateAfter] = useState<string>(
    moment().startOf('week').format('YYYY-MM-DDTHH:mm')
  )
  const [eventDateBefore, setEventDateBefore] = useState<string>(
    moment().endOf('week').format('YYYY-MM-DDTHH:mm')
  )

  const localizer = momentLocalizer(moment)

  const Event = ({ item }: EventType) => (
    <div
      className={classNames('event', {
        'event__all-request': requestType === REQUEST.ALL,
        'event__patients-group': item.requests_in_group < 1
      })}
    >
      <div className="event__status-wrapper">
        <div className="event__patients-count">
          <Group />
          <div className="event__patinets">({item.requests_in_group})</div>
        </div>
        <Typography.Body2 className="event__status">{item.service_request_status}</Typography.Body2>
      </div>
      <Typography.Subtitle2 className="event__patient-name">
        {item.patient_name}
      </Typography.Subtitle2>
    </div>
  )
  const eventsList = time.map((item) => ({
    start: moment(item.application_can_start_at).toDate(),
    end: moment(item.application_time).toDate(),
    title: <Event item={item} />
  }))

  useEffect(() => {
    if (view === VIEW.WEEK) {
      setEventDateAfter(moment(selectedDate).startOf('week').format('YYYY-MM-DDTHH:mm'))
      setEventDateBefore(moment(selectedDate).endOf('week').format('YYYY-MM-DDTHH:mm'))
    } else if (view === VIEW.DAY) {
      setEventDateAfter(moment(selectedDate).startOf('day').format('YYYY-MM-DDTHH:mm'))
      setEventDateBefore(moment(selectedDate).endOf('day').format('YYYY-MM-DDTHH:mm'))
    }
  }, [view, selectedDate])

  useEffect(() => {
    let getData = {
      event_date_after: eventDateAfter,
      event_date_before: eventDateBefore
    }
    if (requestType === REQUEST.MY) {
      getData = { ...getData, ...{ doctors: uuid } }
    }
    getDoctorsSchedule(getData).then((resp) => setTime(resp.data))
  }, [eventDateAfter, eventDateBefore, requestType])

  const onRadioValueChange = ({ target: { value } }: RadioChangeEvent) => {
    setView(value)
  }

  const onDataPickerChange: DatePickerProps['onChange'] = (date) => {
    setSelectedDate(date)
  }
  const CustomToolbar = (toolbar: ICustomTooolbar) => {
    const { date, onNavigate, view } = toolbar
    const goToBack = () => {
      onNavigate('PREV')
    }

    const goToNext = () => {
      onNavigate('NEXT')
    }

    return (
      <div
        className={classNames('schedule-button', {
          'schedule-button__week-view': view === VIEW.WEEK,
          'schedule-button__day-view': view === VIEW.DAY
        })}
      >
        <div className="schedule-button__back" onClick={goToBack}>
          <Arrow />
        </div>
        <div className="schedule-button__date">{moment(date).format('dddd DD')}</div>
        <div className="schedule-button__next" onClick={goToNext}>
          <Arrow />
        </div>
      </div>
    )
  }

  const CustomHeader = (header: ICustomHeader) => {
    const { date } = header
    return (
      <div className="calendar-header">
        <div
          className={classNames('calendar-header__week-day', {
            'calendar-header__choosen-week-day': date.getDay() === selectedDate?.day()
          })}
        >
          {moment(date).format('ddd')}
        </div>
        <div
          className={classNames('calendar-header__date', {
            'calendar-header__choosen-date': date.getDay() === selectedDate?.day()
          })}
        >
          {moment(date).format('DD')}
        </div>
      </div>
    )
  }

  const onRequestTypeChange = ({ target: { value } }: RadioChangeEvent) => {
    setRequestType(value)
  }

  const eventPropGetter = (event: EventPropGetter) => ({
    ...(event.title.props.item.doctor_uuid !== uuid && {
      className: 'another-request'
    }),
    ...(event.title.props.item.doctor_uuid === uuid &&
      requestType === REQUEST.ALL && {
        className: 'all-request'
      })
  })

  return (
    <div className="schedule">
      <Header.VisitsPage />
      <div className="schedule__wrapper">
        <div>
          <DataPicker
            dropdownClassName="schedule__data-picker-popup"
            propsDataPicker={{ onChange: onDataPickerChange, open: true }}
          />
          <Radio
            className="schedule__request-type"
            propsRadio={{
              defaultValue: REQUEST.MY,
              onChange: onRequestTypeChange,
              options: REQUEST_TYPE
            }}
          />
        </div>
        <div>
          <div className="schedule__radio-button-container">
            <Typography.Headline3>Schedule</Typography.Headline3>
            <Radio
              className="schedule__radio"
              propsRadio={{
                defaultValue: VIEW.WEEK,
                onChange: onRadioValueChange,
                optionType: 'button',
                options: CALENDAR_OPTIONS
              }}
            />
          </div>
          <Calendar
            date={selectedDate?.toDate()}
            view={view}
            views={{ day: true, week: true }}
            eventPropGetter={eventPropGetter}
            className="shedule__calendar"
            localizer={localizer}
            events={eventsList}
            startAccessor="start"
            endAccessor="end"
            onView={(view) => {
              setView(view)
            }}
            onNavigate={(date) => {
              setSelectedDate(moment(date))
            }}
            components={{
              toolbar: CustomToolbar,
              week: {
                header: CustomHeader
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
