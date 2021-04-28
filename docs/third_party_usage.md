## List of third party use

- Express framework
- JsonWebToken
- Luxon datetime library
- MySQL database library
- Stripe payment
- Swagger docs

## As to why for those?

- We use ExpressJs framework for fast scaffolding the server, which is also a reliable and popular framework to use
- JSONWebToken is used to handle user authentication without user having to login every time for an API call, so that it mirrors sessions. Using it as a middleware we can also protect our private routes.
- Most essential library in my opinion for this project is Luxon, which handles datetime conversions and much more. A descendant from MomentJs, Luxon is feature-rich with lots of robust functions, and its documentation is also meticulous. We use Luxon primarily in the project for datetime conversion with timezone, and some maths between those Datetime objects. Without Luxon we can still use Javascript native Intl object, but the documentation for this API in my opinion is a bit harder to grasp.
- MySQL library we use to communicate with our database server
- For payment we employ Stripe, which is one of the most widely used for its easiness to implement and very detailed documentation
- Swagger docs is used to do API documentation, and for inline code docs I use Jsdocs.
