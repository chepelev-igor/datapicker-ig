import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from "rxjs";

export const Slides = {
  isYearList: "isYearList",
  isMonthList: "isMonthList",
  isDayList: "isDayList"
}

@Component({
  selector: 'app-datapicker',
  templateUrl: './datapicker.component.html',
  styleUrls: ['./datapicker.component.scss']
})
export class DatapickerComponent implements OnInit {
  @Input() value: Date | string | null | undefined;
  @Input() outputFormat: string | undefined;
  @Input() dilabledDates = [] as Date[];

  fullYear$ = new BehaviorSubject(new Date().getFullYear());
  dateStringVal = '';
  monthList = [] as Date[];
  yearList = [] as Date[];
  dayList = [] as Date[];
  isOpen = false;
  typeSlide = 'isYearList';
  day: Date | string = '';
  month: Date | string = '';
  slides = Slides;

  ngOnInit(): void {
    const currentDate = new Date();
    this.monthList = new Array(12).fill(undefined).map((_, index) => new Date(currentDate.getFullYear(), index + 1));
    this.yearList = new Array(12).fill(undefined).map((_, index) => new Date(currentDate.getFullYear() + index, 1, 0));
    this.month = currentDate;
    this.day = currentDate;
    this.fullYear$.pipe().subscribe(year => {
      this.monthList = this.monthList.map(val => new Date(year, val.getMonth() + 1));
    });
    this.setDateList(currentDate.getFullYear(), currentDate.getMonth())
  }

  setDateList(year: number, month: number): void {
    this.dayList = new Array(new Date(year, month + 1, 0).getDate())
      .fill(undefined).map((_, index) => new Date(year, month, index + 1));
  }

  isCurrentDate(date: Date): boolean {
    const month = new Date(this.value!)?.getMonth();
    const year = new Date(this.value!)?.getFullYear();
    const day = new Date(this.value!)?.getDate();
    if (this.slides.isMonthList === this.typeSlide) {
      return date.getMonth() === month && date.getFullYear() === year;
    } else if (this.slides.isYearList === this.typeSlide) {
      return date.getFullYear() === year;

    } else if (this.slides.isDayList === this.typeSlide) {
      return date.getMonth() === month && date.getFullYear() === year && date.getDay() === day;

    } else {
      return true
    }

  }

  dateFilter(date: Date | null): boolean {
    if (date && this.dilabledDates.length) {
      const month = date.getMonth();
      const year = date?.getFullYear();
      const day = new Date(this.value!)?.getDate();
      if (this.slides.isMonthList === this.typeSlide) {
        return this.dilabledDates.some(date => date.getMonth() === month && date.getFullYear() === year);
      } else if (this.slides.isYearList === this.typeSlide) {
        return this.dilabledDates.some(date => date.getFullYear() === year);
      } else if (this.slides.isDayList === this.typeSlide) {
        return this.dilabledDates.some(date => date.getMonth() === month && date.getFullYear() === year && date.getDay() === day);
      } else {
        return false
      }
    } else {
      return false;
    }
  };

  closePopup(): void {
    this.isOpen = false;
  }

  setDaySlide(): void {
    this.typeSlide = Slides.isDayList;
  }

  setMonthSlide(): void {
    this.typeSlide = Slides.isMonthList;
  }

  setYearSlide(): void {
    this.typeSlide = Slides.isYearList
  }

  monthChange(event: Date): void {
    this.month = new Date(this.fullYear$.getValue(), event.getMonth());
    this.setDateList(this.fullYear$.getValue(), event.getMonth())
  }

  yearChange(event: Date): void {
    this.fullYear$.next(event.getFullYear());
    this.setDateList(this.fullYear$.getValue(), event.getMonth())
  }

  onDayChange(event: Date): void {
    this.day = event;
  }

  getStringMonthOut(): Date | string {
    return new Date(this.day)
  }

}
