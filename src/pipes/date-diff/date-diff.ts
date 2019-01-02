import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
/**
 * Generated class for the DateDiffPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateDiff',
})
export class DateDiffPipe implements PipeTransform {
  transform(startDate,endDate) {
    startDate=moment(startDate);
    endDate=moment(endDate);
    var daysDiff=endDate.diff(startDate,'days');
    return daysDiff+1;
  }
}
