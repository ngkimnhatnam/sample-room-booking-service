// Dependencies import
import { DateTime } from 'luxon';

// Helpers import
import * as authenticationHelper from '../helpers/authentication';
import * as paymentHelper from '../helpers/payment';

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
    /* Room details fetched */
    const { timezone, opening_hour, closing_hour, bookings_timestamps, base_price } = await roomModel.findOne(room_id);

    /* Booking time & room local time converted to correct timezone */
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

    /* Retrieve user Stripe ID */
    const stripe_id = await userModel.findUserStripeId(user_id);

    /* Price calculation & payment initiation */
    const final_amount = finalBookingPrice(user_booking_start, user_booking_end, base_price);
    const { status, amount_received } = await paymentHelper.payRoomBooking(final_amount, stripe_id);
    if (status !== 'succeeded') {
      throw { message: 'Payment unsuccessful', status: 400 };
    }

    /* Insert new booking to DB */
    const booking_id = await userModel.createNewBooking(
      user_id,
      room_id,
      user_booking_start.toSeconds(),
      user_booking_end.toSeconds(),
      amount_received,
    );

    return {
      message: 'Booking created successfully',
      status: 201,
      booking_id,
      amount_paid: `${amount_received / 100}???`,
    };
  } catch (err) {
    if (err.status) {
      throw { message: err.message, status: err.status };
    }
    throw { message: 'Something went wrong', status: 500 };
  }
};

/**
 * Function checking if potential booking duration is too short
 * @param booking_start - Luxon Datetime object.
 * Represent user's wanted booking starting time
 * @param booking_end - Luxon Datetime object.
 * Represent user's wanted booking ending time
 * @returns boolean
 */
const isBookingDurationTooShort = (booking_start: DateTime, booking_end: DateTime): boolean => {
  return booking_end.diff(booking_start, 'minutes').minutes < 15 ? true : false;
};

/**
 * Function checking if potential booking is in the past
 * @param booking_start - Luxon Datetime object.
 * Represent user's wanted booking starting time
 * @param room_local_time - Luxon Datetime object.
 * Represent current local time at room's location/timezone
 * @returns boolean
 */
const isBookingInThePast = (booking_start: DateTime, room_local_time: DateTime): boolean => {
  return booking_start.diff(room_local_time, 'minutes').minutes < 0 ? true : false;
};

/**
 * Function checking if potential booking is outside room's opening hours
 * @param booking_start - Luxon Datetime object.
 * Represent user's wanted booking starting time
 * @param booking_end - Luxon Datetime object.
 * Represent user's wanted booking ending time
 * @param opening_hour - Room daily opening hour.
 * Represented by string e.g. 08:00:00
 * @param closing_hour - Room daily closing hour.
 * Represented by string e.g. 17:00:00
 * @returns boolean
 */
const isBookingOutsideOpeningHours = (
  booking_start: DateTime,
  booking_end: DateTime,
  opening_hour: string,
  closing_hour: string,
): boolean => {
  const { year, month, day, zoneName } = booking_start;
  /* Room's opening & ending time converted to arrays of integers 
  representing hours (0-24), minutes (0-60) */
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

/**
 * Function checking if potential booking is overlapped by existing ones
 * @param current_bookings - Array of current bookings for a room.
 * Containing start & end timestamp
 * @param booking_start - Luxon Datetime object.
 * Represent user's wanted booking starting time
 * @param booking_end - Luxon Datetime object.
 * Represent user's wanted booking ending time
 * @returns boolean
 */
const isBookingOverlapped = (
  current_bookings: roomModel.RoomBookings[],
  booking_start: DateTime,
  booking_end: DateTime,
): boolean => {
  /* All bookings happening before & after potential booking's time is trimmed. 
  Any items remaining in the new filtered array indicates overlapping */
  return current_bookings.filter(
    (booking) => !(booking.end_time < booking_start.toSeconds()) && !(booking.start_time > booking_end.toSeconds()),
  ).length > 0
    ? true
    : false;
};

/**
 * Function returning final calculated price for a booking
 * @param booking_start - Luxon Datetime object.
 * Represent user's wanted booking starting time
 * @param booking_end - Luxon Datetime object.
 * Represent user's wanted booking ending time
 * @param base_price - Room base price per hour
 * @returns integer
 */
const finalBookingPrice = (booking_start: DateTime, booking_end: DateTime, base_price: number) => {
  return Math.round(base_price * booking_end.diff(booking_start, 'hours').hours);
};

export const handleGettingBookings = async (user_id: number) => {
  try {
    const booking_timestamps = await userModel.findUserBookings(user_id);

    /* Format the booking timestamp to room's local time */
    const data = booking_timestamps.map(({ booking_id, room_id, start_time, end_time, amount_paid, timezone }) => {
      const start = DateTime.fromSeconds(start_time, { zone: timezone }).toFormat('dd-MM-yyyy HH:mm');
      const end = DateTime.fromSeconds(end_time, { zone: timezone }).toFormat('dd-MM-yyyy HH:mm');
      return {
        booking_id,
        room_id,
        timezone,
        start,
        end,
        amount_paid: `${amount_paid / 100}???`,
      };
    });

    return {
      message: 'User bookings listed successfully',
      status: 200,
      data,
    };
  } catch (err) {
    throw { message: 'Something went wrong', status: 500 };
  }
};
