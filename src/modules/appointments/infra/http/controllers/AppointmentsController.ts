import { parseISO } from "date-fns";
import {container} from 'tsyringe';

import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

import { Request, Response } from "express";

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);
  
    const createAppointment = container.resolve(CreateAppointmentService)
  
    const appointment = await createAppointment.execute({
      provider_id,
      date: parsedDate,
    });
  
    return response.json(appointment);
  }
}