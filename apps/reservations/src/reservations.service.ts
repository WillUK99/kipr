import { Injectable } from '@nestjs/common';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationsRepository } from './reservations.repository';
import { UserDto } from '@app/common';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository) { }

  create(createReservationDto: CreateReservationDto, { _id: userId }: UserDto) {
    return this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId,
    });
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(id: string) {
    return this.reservationsRepository.findOne({ _id: id });
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({ _id: id }, { $set: updateReservationDto });
  }

  remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id: id });
  }
}
