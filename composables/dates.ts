import { format, formatISO, isToday, isYesterday } from "date-fns";
import * as timeago from "timeago.js";
import type { Vendor, VendorSchedule } from "~/types/user";

// the local dict example is below.

export const gpDates = {
  formatDate(date: string | Date) {
    return format(new Date(date), "MMM do, yyyy");
  },

  getCreatedAt(date: Date | string) {
    return format(new Date(date), "MMM dd, 'at' h:mm a");
  },

  formatMonthYear(date: Date | string) {
    return format(new Date(date), "MMM yyyy");
  },

  formatIntlDate(date: Date | string) {
    return format(new Date(date), "dd/MMM/yyyy");
  },

  getReadableDate(date: string | Date) {
    date = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    else if (date.toDateString() === yesterday.toDateString())
      return "Yesterday";
    else
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  },

  getTime(date: string | Date) {
    const dateString = new Date(date);
    const time = dateString.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return time;
  },

  getChatsTime(date: string | Date) {
    date = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return this.getTime(date);
    else if (date.toDateString() === yesterday.toDateString())
      return "Yesterday";
    else return this.formatDate(date);
  },

  getTimeAgo(date: string | Date) {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return timeago.format(date);
    }
  },
  getExactTimeAgo(date: string | Date) {
    return timeago.format(date);
  },

  getTimeDifference(from: number, to: number) {
    if (from < 60 && to < 60) {
      return `${from} - ${to} mins`;
    } else if (from < 60 && to > 60) {
      return `${from}mins - ${Math.round((to / 60) * 2) / 2}hr`;
    }
  },

  getVendorSchedule(
    schedule: Vendor["schedule"],
    type: "day" | "time" = "time",
  ) {
    if (!schedule) return " Closed";
    else {
      const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const currentDay = new Date()
        .toLocaleString("en-US", {
          timeZone: schedule?.timezone,
          weekday: "short",
        })
        .toLowerCase();

      const todaySchedule: VendorSchedule | null =
        schedule.schedule[currentDay];

      if (!todaySchedule) return "Closed";

      const { from, to } = todaySchedule;
      const formatTime = ({ hr, min }) => {
        const period = hr >= 12 ? "pm" : "am";
        const formattedHr = hr % 12 || 12; // Convert 0 or 24 to 12 for 12-hour format
        return `${formattedHr}${period}`;
      };

      return type === "time"
        ? `${formatTime(from)} - ${formatTime(to)}`
        : `Opens <span class="capitalize">${currentDay}</span> at <span class="uppercase">${formatTime(from)}</span>`;
    }
  },

  // Example usage
};
