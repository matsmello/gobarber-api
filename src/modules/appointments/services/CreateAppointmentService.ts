import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import { startOfHour } from "date-fns";
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'

interface IRequest {
  date: Date;
  provider_id: string;
}

// Dependency Inversion

class CreateAppointmentService {

  constructor(private appointmentsRepository: IAppointmentsRepository ) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameDate) {
      throw Error("This appointment is already booked");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
