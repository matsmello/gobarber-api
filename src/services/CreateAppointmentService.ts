import Appointment from "./../models/Appointment";
import { startOfHour } from "date-fns";
import AppointmentsRepository from "./../repositories/AppointmentsRepository";
import { getCustomRepository } from "typeorm";
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
  public async execute({ date, provider }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameDate) {
      throw Error("This appointment is already booked");
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
