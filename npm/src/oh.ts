import {
	format,
  isSameDay,
  endOfDay,
  startOfWeek,
  differenceInCalendarDays,
  addDays,
  getDay
} from 'date-fns';

export const DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

export const parseBusinessHours = (
  businessHoursString: string,
  date: Date = new Date()
) => {
  const oh = new OpeningHours(businessHoursString);
  const intervals = oh.getIntervals(date);
  let businessHours: { [key: string]: { start: Date; end: Date; } } = {};
  for (const day of DAYS) {
    const dayIntervals = intervals[day] || [];
    const { start, end } = dayIntervals[0] || {};
    if (!start || !end) {
      continue;
    }
    if (isSameDay(start, end)) {
      const dayNo = getDay(start);
      const day = DAYS[dayNo];
      businessHours[day] = { start, end };
    } else {
      for (let index = 0; index <= differenceInCalendarDays(end, start); index ++) {
        const updatedStart: Date = addDays(start, index);
        const dayNo = getDay(updatedStart);
        const day = DAYS[dayNo];
        businessHours[day] = { start: updatedStart, end: endOfDay(updatedStart) };
      }
    }
  }
  return businessHours;
};

export default class OpeningHours {
  private _openingHours: { [key: string]: string[]; };
	private _alwaysOpen?: boolean;
	private _alwaysClosed?: boolean;

	constructor(input: string) {
		this._openingHours = {
			su: [],
			mo: [],
			tu: [],
			we: [],
			th: [],
			fr: [],
			sa: [],
			ph: []
		};
		this.parse(input);
	}

  get alwaysOpen() {
    return this._alwaysOpen;
  }

  get alwaysClosed() {
    return this._alwaysClosed;
  }

	/**
	 * Parses the input and creates openingHours Object
	 */
	private parse(input: string) {
		const parts = input.toLowerCase().replace(/\s*([-:,;])\s*/g, '$1').split(';');
		parts.forEach(part => this.parseHardPart(part));
	}

	private parseHardPart(part: string) {
		if (part == '24/7') {
			part = 'mo-su 00:00-23:59';
		}
		let segments = part.split(/\ |\,/);
		let tempData: { [key: string]: string[]; } = {};
		let days: string[] = [];
		let times: string[] = [];
		segments.forEach((segment) => {
			if (this.checkDay(segment)) {
				if (times.length == 0) {
					days = days.concat(this.parseDays(segment));
				} else {
					// append
					days.forEach((day) => {
						if (tempData[day]) {
							tempData[day] = tempData[day].concat(times);
						} else {
							tempData[day] = times;
						}
					})
					days = this.parseDays(segment);
					times = [];
				}
			} else if (this.isTimeRange(segment)) {
				if (segment === 'off') {
					times = [];
				} else {
					segment = segment.replace(/^([0-9]{1})(:[0-9]{2})/, '0$1$2');
					segment = segment.replace(/\-[0-9]{1}:[0-9]{2}/, '0$1$2');
					times.push(segment);
				}
			}
		});

		// commit last times to it days
		days.forEach((day) => {
			if (tempData[day]) {
				tempData[day] = tempData[day].concat(times);
			} else {
				tempData[day] = times;
			}
		});

		// apply data to main obj
		for (let key in tempData) {
			this._openingHours[key] = tempData[key];
		}
	}

	private parseDays(part: string): string[] {
		let days: string[] = [];
		let softparts = part.split(',');
		softparts.forEach((part) => {
			let rangecount = (part.match(/\-/g) || []).length;
			if (rangecount == 0) {
				days.push(part);
			} else {
				days = days.concat(this.calcDayRange(part))
			}
		});
		return days;
	}

	/**
	 * Calculates the days in range 'mo-we' -> ['mo', 'tu', 'we']
	 */
	private calcDayRange(range: string): string[] {
		let def: { [key: string]: number; } = {
			su: 0,
			mo: 1,
			tu: 2,
			we: 3,
			th: 4,
			fr: 5,
			sa: 6
		}
		let rangeElements = range.split('-');
		let dayStart = def[rangeElements[0]];
		let dayEnd = def[rangeElements[1]];
		let numberRange = this.calcRange(dayStart, dayEnd, 6);
		let outRange: string[] = [];
		numberRange.forEach(n => {
			for (let key in def) {
				def[key] == n && outRange.push(key);
			}
		});
		return outRange;
	}

	/**
	 * Creates a range between two number.
	 * if the max value is 6 a range bewteen 6 and 2 is 6, 0, 1, 2
	 */
	private calcRange(min: number, max: number, maxval: number): number[] {
		if (min == max) {
			return [min];
		}
		let range = [min];
		let rangepoint = min;
		while (rangepoint < ((min < max) ? max : maxval)) {
			rangepoint++;
			range.push(rangepoint);
		}
		if (min > max) {
			// add from first in list to max value
			range = range.concat(this.calcRange(0, max, maxval));
		}
		return range;
	}

	/**
	 * Check if string is time range
	 */
	private isTimeRange(input: string): boolean {
		// e.g. 09:00+
		if (input.match(/[0-9]{1,2}:[0-9]{2}\+/)) {
			return true;
		} else if (input.match(/[0-9]{1,2}:[0-9]{2}\-[0-9]{1,2}:[0-9]{2}/)) { // e.g. 08:00-12:00
			return true;
		} else if (input.match(/off/)) { // off
			return true;
		}
		return false;
	}

	/**
	 * check if string is day or dayrange
	 */
	private checkDay(input: string): boolean {
		let days = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su', 'ph'];
		if (input.match(/\-/g)) {
			let rangeElements = input.split('-');
			if (days.indexOf(rangeElements[0]) !== -1 && days.indexOf(rangeElements[1]) !== -1) {
				return true;
			}
		} else if (days.indexOf(input) !== -1) {
			return true;
		}
		return false;
	}

	/**
	 * Compares to timestrings e.g. '18:00'
	 * if time1 > time2 -> 1
	 * if time1 < time2 -> -1
	 * if time1 == time2 -> 0
	 */
	private compareTime(time1: string, time2: string) {
		const date1 = Number(time1.replace(':', ''));
		const date2 = Number(time2.replace(':', ''));
		if (date1 > date2) {
			return 1;
		} else if (date1 < date2) {
			return -1;
		} else {
			return 0;
		}
	}

	public getTable() {
		return this._openingHours;
	}

	public getIntervals(date: Date = new Date) {
		const startDateOfWeek = startOfWeek(date);
		const intervals: { [key: string]: { start: Date; end: Date; }[] } = {
			su: [],
			mo: [],
			tu: [],
			we: [],
			th: [],
			fr: [],
			sa: [],
			ph: []
		};
		DAYS.forEach((day, index) => {
			const openingHours = this._openingHours[day];
			for (const openingHour of openingHours) {
				const openingHourMatch = openingHour.match(/([0-9]{1,2}:[0-9]{2})\-([0-9]{1,2}:[0-9]{2})/);
				const updatedDate = addDays(startDateOfWeek, index);
				if (openingHourMatch) {
					intervals[day].push({
						start: new Date(format(updatedDate, `yyyy/MM/dd ${openingHourMatch[1]}`)),
						end: new Date(format(updatedDate, `yyyy/MM/dd ${openingHourMatch[2]}`)),
					});
				}
			}
		});
		return intervals;
	}

	public isOpen(date?: Date): boolean {
		if (typeof this._openingHours === 'boolean') {
			return this._openingHours;
		}
		date = date || new Date();
		const testDay = date.getDay();
		const testTime = `${date.getHours()}:${date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()}`;
		let i = 0;
		let times: string[] = [];
		for (let key in this._openingHours) {
			if (i == testDay) {
				times = this._openingHours[key];
			}
			i++;
		}
		let isOpen = false
		times.some(time => {
			const timeData = time.replace(/\+$/, '-24:00').split('-')
			if (
				(this.compareTime(testTime, timeData[0]) != -1) &&
				(this.compareTime(timeData[1], testTime) != -1)
			) {
				isOpen = true;
				return true;
			}
      return false;
		});
		return isOpen;
	}
}
