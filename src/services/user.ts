// Dependencies import
import { DateTime } from 'luxon';

// Helpers import
import * as authenticationHelper from '../helpers/authentication';

// Models import
import * as userModel from '../models/user';
import * as roomModel from '../models/room';

// EventBus import
import eventBus from '../subscriptions/eventEmitter';

export const handleSignup = async (email: string, password: string) => {
  try {
    const emailCheck = await userModel.checkUserEmailExistence(email);
    if (emailCheck.length !== 0) {
      throw { message: 'Email existed', status: 400 };
    }

    const hashedPass = await authenticationHelper.createPasswordHash(password);
    const user_id = await userModel.createNewUserRecord(email, hashedPass);

    eventBus.emit('signup-success', email);
    return {
      message: 'User signup success',
      status: 201,
      user_id,
    };
  } catch (err) {
    eventBus.emit('signup-error', err, email);
    if (err.status) {
      throw { message: err.message, status: err.status };
    }
    throw { message: 'Something went wrong', status: 500 };
  }
};

export const handleBooking = async (
  user_id: number,
  user_payload: { room_id: number; booking_start: string; booking_end: string },
) => {
  const { room_id, booking_start, booking_end } = user_payload;
  try {
    const { timezone, opening_hour, closing_hour, bookings_timestamps } = await roomModel.findOne(room_id);

    const user_booking_start = DateTime.fromISO(booking_start, { zone: timezone });
    const user_booking_end = DateTime.fromISO(booking_end, { zone: timezone });
    const room_local_time = DateTime.now().setZone(timezone);

    if (isBookingDurationTooShort(user_booking_start, user_booking_end)) {
      throw { message: 'Booking must last at least 15 minutes', status: 400 };
    }
    if (isBookingInThePast(user_booking_start, room_local_time)) {
      throw { message: 'Booking must not be in the past', status: 400 };
    }
    if (isBookingOutsideOpeningHours(user_booking_start, user_booking_end, opening_hour, closing_hour)) {
      throw { message: 'Booking must be within opening hours', status: 400 };
    }
    if (isBookingOverlapped(bookings_timestamps, user_booking_start, user_booking_end)) {
      throw { message: 'Booking has overlapping reservations', status: 400 };
    }

    const booking_id = await userModel.createNewBooking(
      user_id,
      room_id,
      user_booking_start.toSeconds(),
      user_booking_end.toSeconds(),
    );
    return {
      messsage: 'Booking created successfully',
      status: 201,
      booking_id,
    };
  } catch (err) {
    if (err.status) {
      throw { message: err.message, status: err.status };
    }
    throw { message: 'Something went wrong', status: 500 };
  }
};

const isBookingDurationTooShort = (booking_start: DateTime, booking_end: DateTime): boolean => {
  return booking_end.diff(booking_start, 'minutes').minutes < 15 ? true : false;
};

const isBookingInThePast = (booking_start: DateTime, room_local_time: DateTime): boolean => {
  return booking_start.diff(room_local_time, 'minutes').minutes < 0 ? true : false;
};

const isBookingOutsideOpeningHours = (
  booking_start: DateTime,
  booking_end: DateTime,
  opening_hour: string,
  closing_hour: string,
): boolean => {
  const { year, month, day, zoneName } = booking_start;
  const [open_in_hour, open_in_minute] = opening_hour.split(':').map((value) => Number(value));
  const [closing_in_hour, closing_in_minute] = closing_hour.split(':').map((value) => Number(value));

  const room_open_unix_stamp = DateTime.fromObject({
    year,
    month,
    day,
    hour: open_in_hour,
    minute: open_in_minute,
    zone: zoneName,
  }).toSeconds();

  const room_close_unix_stamp = DateTime.fromObject({
    year,
    month,
    day,
    hour: closing_in_hour,
    minute: closing_in_minute,
    zone: zoneName,
  }).toSeconds();

  return booking_start.toSeconds() < room_open_unix_stamp || booking_end.toSeconds() > room_close_unix_stamp
    ? true
    : false;
};

const isBookingOverlapped = (
  current_bookings: roomModel.RoomBookings[],
  booking_start: DateTime,
  booking_end: DateTime,
): boolean => {
  return current_bookings.filter(
    (booking) => !(booking.end_time < booking_start.toSeconds()) && !(booking.start_time > booking_end.toSeconds()),
  ).length > 0
    ? true
    : false;
};
