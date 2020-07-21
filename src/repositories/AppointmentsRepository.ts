import Appointment from './../models/Appointment'
import {isEqual} from 'date-fns'

class AppointmentsRepository {
  private appointments: Appointment[]

  constructor() {
    this.appointments = [];
  }

  public findByDate(date: Date): Appointment | undefined {
    const findAppointmentInSameDate = this.appointments.find(appointment => isEqual(appointment.date, date))

    return findAppointmentInSameDate
  }

  public create(provider: string, date: Date): Appointment {
    const appointment = new Appointment(provider, date)

    this.appointments.push(appointment)

    return appointment
  }
}

export default AppointmentsRepository;