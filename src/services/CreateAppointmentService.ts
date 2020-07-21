import Appointment from './../models/Appointment'
import {startOfHour} from 'date-fns'
import AppointmentsRepository from './../repositories/AppointmentsRepository'
/*  Recebimento das informações
* Tratativa de errors/excessões
* Acesso ao repositório
*/

interface Request {
  date: Date;
  provider: string;
}

// Dependency Inversion

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository
  }

  public execute({date, provider}: Request): Appointment{
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(appointmentDate)

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked')
    }

    const appointment = this.appointmentsRepository.create({provider, date: appointmentDate})

    return appointment
  }
}

export default CreateAppointmentService