import { Injectable } from '@angular/core';
import moment from 'moment';
import { Moment } from 'moment';
import { WeekDays } from '../common/types/week-days.type';
import { UtilsService } from '../common/services/utils/utils.service';
import { IDay } from './day.model';
import { IDayCalendarConfig } from './day-calendar-config.model';
import { IMonthCalendarConfig } from '../month-calendar/month-calendar-config';

@Injectable()
export class DayCalendarService {
  private readonly DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  readonly DEFAULT_CONFIG: IDayCalendarConfig = {
    showNearMonthDays: true,
    showWeekNumbers: false,
    firstDayOfWeek: 'su',
    weekDayFormat: 'ddd',
    format: 'DD-MM-YYYY',
    allowMultiSelect: false,
    monthFormat: 'MMM, YYYY',
    enableMonthSelector: true,
    locale: 'en',
    dayBtnFormat: 'DD'
  };

  constructor(private utilsService: UtilsService) {
  }

  private removeNearMonthWeeks(currentMonth: Moment, monthArray: IDay[][]): IDay[][] {
    if (monthArray[monthArray.length - 1].find((day) => day.date.isSame(currentMonth, 'month'))) {
      return monthArray;
    } else {
      return monthArray.slice(0, -1);
    }
  }

  getConfig(config: IDayCalendarConfig): IDayCalendarConfig {
    const _config = { ...this.DEFAULT_CONFIG, ...this.utilsService.clearUndefined(config) };
    moment.locale(_config.locale);

    return _config;
  }

  generateDaysMap(firstDayOfWeek: WeekDays): { [key: number]: string } {
    const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
    const daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
    return daysArr.reduce((map, day, index) => {
      (<any>map)[day] = index;

      return map;
    }, <{ [key: number]: string }>{});
  }

  generateMonthArray(config: IDayCalendarConfig, month: Moment, selected: Moment[]): IDay[][] {
    let monthArray: IDay[][] = [];
    const firstDayOfWeekIndex = this.DAYS.indexOf(config.firstDayOfWeek);
    const firstDayOfBoard = month.clone().startOf('month');

    while (firstDayOfBoard.day() !== firstDayOfWeekIndex) {
      firstDayOfBoard.subtract(1, 'day');
    }

    const current = firstDayOfBoard.clone();
    const prevMonth = month.clone().subtract(1, 'month');
    const nextMonth = month.clone().add(1, 'month');
    const today = moment();

    const daysOfCalendar: IDay[] = this.utilsService.createArray(42)
      .reduce((array: IDay[]) => {
        array.push({
          date: current.clone(),
          selected: !!selected.find(selectedDay => current.isSame(selectedDay, 'day')),
          currentMonth: current.isSame(month, 'month'),
          prevMonth: current.isSame(prevMonth, 'month'),
          nextMonth: current.isSame(nextMonth, 'month'),
          currentDay: current.isSame(today, 'day')
        });
        current.add(1, 'day');

        if (current.format('HH') !== '00') {
          current.startOf('day').add(1, 'day');
        }

        return array;
      }, []);

    daysOfCalendar.forEach((day, index) => {
      const weekIndex = Math.floor(index / 7);

      if (!monthArray[weekIndex]) {
        monthArray.push([]);
      }

      monthArray[weekIndex].push(day);
    });

    if (!config.showNearMonthDays) {
      monthArray = this.removeNearMonthWeeks(month, monthArray);
    }

    return monthArray;
  }

  generateWeekdays(firstDayOfWeek: WeekDays): Moment[] {
    const weekdayNames: { [key: string]: Moment } = {
      su: moment().day(0),
      mo: moment().day(1),
      tu: moment().day(2),
      we: moment().day(3),
      th: moment().day(4),
      fr: moment().day(5),
      sa: moment().day(6)
    };
    const weekdays: Moment[] = [];
    const daysMap = this.generateDaysMap(firstDayOfWeek);

    for (const dayKey in daysMap) {
      if (daysMap.hasOwnProperty(dayKey)) {
        (<any>weekdays)[(<any>daysMap)[dayKey]] = weekdayNames[dayKey];
      }
    }

    return weekdays;
  }

  isDateDisabled(day: IDay, config: IDayCalendarConfig): boolean {
    if (config.isDayDisabledCallback) {
      return config.isDayDisabledCallback(day.date);
    }

    if (config.min && day.date.isBefore(config.min, 'day')) {
      return true;
    }

    return !!(config.max && day.date.isAfter(config.max, 'day'));
  }

  // todo:: add unit tests
  getHeaderLabel(config: IDayCalendarConfig, month: Moment): string {
    if (config.monthFormatter) {
      return config.monthFormatter(month);
    }

    return month.format(config.monthFormat);
  }

  // todo:: add unit tests
  shouldShowLeft(min: Moment, currentMonthView: Moment): boolean {
    return min ? min.isBefore(currentMonthView, 'month') : true;
  }

  // todo:: add unit tests
  shouldShowRight(max: Moment, currentMonthView: Moment): boolean {
    return max ? max.isAfter(currentMonthView, 'month') : true;
  }

  generateDaysIndexMap(firstDayOfWeek: WeekDays) {
    const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
    const daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
    return daysArr.reduce((map, day, index) => {
      map[index] = day;

      return map;
    }, <{ [key: number]: string }>{});
  }

  // todo:: add unit tests
  getMonthCalendarConfig(componentConfig: IDayCalendarConfig): IMonthCalendarConfig {
    return this.utilsService.clearUndefined({
      min: componentConfig.min,
      max: componentConfig.max,
      format: componentConfig.format,
      isNavHeaderBtnClickable: true,
      allowMultiSelect: false,
      yearFormat: componentConfig.yearFormat,
      yearFormatter: componentConfig.yearFormatter,
      monthBtnFormat: componentConfig.monthBtnFormat,
      monthBtnFormatter: componentConfig.monthBtnFormatter,
      monthBtnCssClassCallback: componentConfig.monthBtnCssClassCallback,
      multipleYearsNavigateBy: componentConfig.multipleYearsNavigateBy,
      showMultipleYearsNavigation: componentConfig.showMultipleYearsNavigation
    });
  }

  getDayBtnText(config: IDayCalendarConfig, day: Moment): string {
    if (config.dayBtnFormatter) {
      return config.dayBtnFormatter(day);
    }

    return day.format(config.dayBtnFormat);
  }

  getDayBtnCssClass(config: IDayCalendarConfig, day: Moment): string {
    if (config.dayBtnCssClassCallback) {
      return config.dayBtnCssClassCallback(day);
    }

    return '';
  }
}
