import { Status, Chips, Button } from 'src/atoms'
import { Typography } from 'src/Typography'
import { ReactComponent as Doctor } from 'src/public/Doctor.svg'
import './RequestCards.scss'
import { RequestCardsType } from './RequestCardsType'
import { STATUS_VARIANTS } from 'src/constants'

export const RequestCards = ({
  uuid,
  is_grouped,
  status,
  urgency,
  service,
  patient_name,
  doctor_name,
  time
}: RequestCardsType) => {
  return (
    <div key={uuid} className="request-card container">
      <div className="request-card__header">
        <Typography.Subtitle2 className="request-card__request-type">
          {is_grouped ? 'Group' : 'Single'} request
        </Typography.Subtitle2>
        <Status variant={STATUS_VARIANTS[status]} type="visits" children={status} />
      </div>
      <Chips.Default className="request-card__urgency" variant="request" children={urgency} />
      <div className="request-card__body">
        <Typography.Subtitle1 className="request-card__body-title">Type:</Typography.Subtitle1>
        <Typography.Subtitle1 className="request-card__body-description">
          {service}
        </Typography.Subtitle1>
      </div>
      <div className="request-card__body">
        <Typography.Subtitle1 className="request-card__body-title">Time:</Typography.Subtitle1>
        <Typography.Subtitle1 className="request-card__body-description">
          {time}
        </Typography.Subtitle1>
      </div>
      <Typography.Subtitle1 className="request-card__patient-name">
        {patient_name}
      </Typography.Subtitle1>
      {!!doctor_name && (
        <>
          <div className="request-card__line" />
          <Typography.Subtitle2 className="request-card__footer-title">Doctor</Typography.Subtitle2>
          <div className="request-card__footer-info">
            <Doctor />
            <Typography.Subtitle1 className="request-card__doctor-name">
              {doctor_name}
            </Typography.Subtitle1>
          </div>
          <Button.Default variant="text" className="request-card__button">
            <Typography.Button2>Open Details</Typography.Button2>
          </Button.Default>
        </>
      )}
    </div>
  )
}
