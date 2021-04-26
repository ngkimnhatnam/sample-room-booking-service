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

    return {
      messsage: 'Got here',
      user_id,
      status: 201,
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
  const [open_in_hour, open_in_minute] = opening_hour.split(':').map((value) => Number(value));
  const [closing_in_hour, closing_in_minute] = closing_hour.split(':').map((value) => Number(value));
  return booking_start.hour < open_in_hour ||
    (booking_start.hour === open_in_hour && booking_start.minute < open_in_minute) ||
    booking_end.hour > closing_in_hour ||
    (booking_end.hour === closing_in_hour && booking_end.minute > closing_in_minute)
    ? true
    : false;
};

const isBookingOverlapped = (
  current_bookings: roomModel.RoomBookings[],
  booking_start: DateTime,
  booking_end: DateTime,
): boolean => {
  const overlapping_bookings = current_bookings.filter((booking) => {
    if (!(booking.end_time < booking_start.toSeconds()) && !(booking.start_time > booking_end.toSeconds())) {
      return booking;
    }
  });
  return overlapping_bookings.length > 0 ? true : false;
};
