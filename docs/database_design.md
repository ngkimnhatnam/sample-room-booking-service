## Database design

- Databse chosen was MySQL, and it is due to two reasons, being one that the developer has more familiarity with relational database management system, and secondly the developer enjoys the tight correlation between the data structure, so that data is normalized and integrity is ensured.
- Furthermore, this is quite a small application that scaling is not the prime objective here, so relational database will do the job
- Considering the business requirements for the application, a database schema is designed as follows:

![database_design](https://i.ibb.co/VjcLfZD/database-design.png)

- Three main resources are materialized into own data tables, which are Users, Bookings, and Rooms.
- Table Bookings represent the relation between a user and a room, and that relationship is many-to-many. Hence it is worthy to have a bridge table being Bookings to represent such relation.
