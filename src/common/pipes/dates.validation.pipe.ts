import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DatesValidationPipe implements PipeTransform {
  async transform(data: any) {
    // Check if data strings are valid
    const dateStart = new Date(data.dateStart);
    const dateEnd = new Date(data.dateEnd);
    if (
      dateStart.toString() === 'Invalid Date' ||
      dateEnd.toString() === 'Invalid Date'
    ) {
      throw new BadRequestException("Incorrect dates values - can't parse");
    }
    return {
      ...data,
      dateStart,
      dateEnd,
    };
  }
}
