import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';

@Injectable()
export class DatesValidationPipe implements PipeTransform {
  async transform(data: any, metadata: ArgumentMetadata) {
    // Check if data strings are valid
    const dateStart = new Date(data.startDate);
    const dateEnd = new Date(data.endDate);
    if (
      dateStart.toString() === 'Invalid Date' ||
      dateEnd.toString() === 'Invalid Date'
    ) {
      throw new BadRequestException();
    }
    return {
      dateStart,
      dateEnd,
    };
  }
}
