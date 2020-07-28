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
  provider_id: string;
}

// Dependency Inversion

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameDate) {
      throw Error("This appointment is already booked");
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
