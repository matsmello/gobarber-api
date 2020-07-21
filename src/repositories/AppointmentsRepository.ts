import Appointment from './../models/Appointment'
import {isEqual} from 'date-fns'

interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

class AppointmentsRepository {
  private appointments: Appointment[]

  constructor() {
    this.appointments = [];
  }

  public all(): Appointment[] {
    return this.appointments
  }

  public findByDate(date: Date): Appointment | undefined {
    const findAppointmentInSameDate = this.appointments.find(appointment => isEqual(appointment.date, date))

    return findAppointmentInSameDate
  }

  public create({provider, date}: CreateAppointmentDTO): Appointment {
    // DTO = Data Transfer Object
    const appointment = new Appointment({provider, date})

    this.appointments.push(appointment)

    return appointment
  }
}

export default AppointmentsRepository;