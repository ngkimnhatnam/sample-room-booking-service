## Core requirements for the application

- User can signup / login
- User can see a room's availability
- User can book a meeting room to his desired duration
- User can view own bookings
- Bookings must not overlap

## Extended requirements

- Timezone & opening hours added to room details
- Booking must last at least 15 minutes each
- Booking must not be in the past
- Booking then must be within room's opening hours
- Payment expansion to booking
- Some means of notification either emailing or similar
- API endpoints for admins to dynamically perform CRUD actions on rooms

## Current version 1.7.0

- User can signup / login
- User can view a room's booked time slots
- User can book a room after payment succeeds
- User can view own bookings details
- Admins can add rooms/ update old ones / delete rooms

## Sidenotes

- All bookings are converted to a room's timezone, hence it is independent on current user's timezone
- When users provide booking timing, it is absolute datetime in that assumably users want to book such room at such time in such room's timezone
- Following graph explains the conditions needed for a booking to pass:
  ![booking_condition](https://i.ibb.co/3spbh1G/booking-condition.png)
