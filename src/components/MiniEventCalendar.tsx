'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/content-locale';
import { formatVietnamDateInput } from '@/lib/vietnam-time';

interface Event {
  id: string;
  title: string;
  date: Date;
  isPast: boolean;
}

interface MiniEventCalendarProps {
  events: Event[];
}

function getCalendarDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getVietnamTodayAsCalendarDate() {
  const [year, month, day] = formatVietnamDateInput(new Date()).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function MiniEventCalendar({ events }: MiniEventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(getVietnamTodayAsCalendarDate);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  const monthNames = isEn
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  const dayNames = isEn ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];

    const dateKey = getCalendarDateKey(date);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return formatVietnamDateInput(eventDate) === dateKey;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const todayKey = formatVietnamDateInput(new Date());

  return (
    <div className="bg-[#FFF8DC] p-4 shadow-md h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-montserrat">{isEn ? 'Event Calendar' : 'Lịch sự kiện'}</h3>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]}/{currentDate.getFullYear()}
        </h4>
        <div className="flex gap-1">
          <button
            onClick={previousMonth}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label={isEn ? 'Previous month' : 'Tháng trước'}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label={isEn ? 'Next month' : 'Tháng sau'}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3 flex-1 content-start">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateEvents = getEventsForDate(date);
          const hasUpcomingEvents = dateEvents.some((event) => !event.isPast);
          const hasPastEvents = dateEvents.some((event) => event.isPast);
          const isToday = getCalendarDateKey(date) === todayKey;

          return (
            <div
              key={index}
              className="aspect-square flex items-center justify-center relative"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isToday ? 'bg-gray-800 text-white' : 'text-gray-800'
                }`}
              >
                {date.getDate()}
              </div>

              {(hasUpcomingEvents || hasPastEvents) && (
                <div className="absolute bottom-1 flex items-center gap-1">
                  {hasUpcomingEvents && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#0A7029' }}
                    />
                  )}
                  {hasPastEvents && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#F97316' }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 pt-3 border-t text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0A7029' }}></div>
          <span className="text-gray-600">{isEn ? 'Upcoming events' : 'Sự kiện sắp tới'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F97316' }}></div>
          <span className="text-gray-600">{isEn ? 'Past events' : 'Sự kiện đã qua'}</span>
        </div>
      </div>
    </div>
  );
}
