import { HTTP_METHODS } from 'src/helper/api'
import { IPatient, IPatientById } from 'src/redux/types/patientsTypes'
import Fetcher from 'src/services/fetcher'
import {
  PatientDateInfoType,
  PatientsDateInfo,
  PatientsRequest,
  PatientsZipCode
} from './PatientsType'

const fetcher = new Fetcher()

export const requestPatientsInfo = () =>
  fetcher.requestToReceive<{}, IPatient[]>({
    url: 'patients/',
    method: HTTP_METHODS.GET
  })

export const requestPostZipCode = (data: PatientsZipCode) =>
  fetcher.requestToReceive<PatientsZipCode, {}>({
    url: 'locations/validate/',
    method: HTTP_METHODS.POST,
    data
  })

export const getAvailableTime = (
  date: string,
  zip_code: string,
  patients_number: number,
  address_line: string[]
) =>
  fetcher.requestToReceive<PatientsDateInfo, PatientDateInfoType[]>({
    url: 'shifts/day-slots/',
    params: { date, zip_code, patients_number, address_line },
    method: HTTP_METHODS.GET
  })

export const createRequest = (data: PatientsRequest) =>
  fetcher.requestToReceive<PatientsRequest, {}>({
    url: 'service-requests/',
    method: HTTP_METHODS.POST,
    data
  })

export const getPatientInfo = (uuid: string) =>
  fetcher.requestToReceive<string, IPatientById>({
    url: `users/${uuid}/`,
    method: HTTP_METHODS.GET
  })

export const saveEditInfo = (uuid: string, data: IPatientById) =>
  fetcher.requestToReceive<IPatientById, IPatientById>({
    url: `users/${uuid}/`,
    method: HTTP_METHODS.PUT,
    data
  })
