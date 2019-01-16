# Hello Shopify,

### General information
Thank you for taking a look at my solution.

You can interact with the API here:
```
https://shopify-backend-summer-2019.herokuapp.com
```

and view the documentation here:<br/>
https://shopify-backend-summer-2019.herokuapp.com/documentation

I highly recommend taking a look at the documentation. I have provided lots of
detail and instructions for consuming this API.

To authenticate, please use the credentials provided and send a post request
with the following body to:<br/>
`https://shopify-backend-summer-2019.herokuapp.com/login`:

```
{
    "username": "cusadmin",
    "password": "admin"
}
```

The lifespan of the token is set to 1 day, so there is no need to worry
about refreshing the token. If this was in production, I would use access and refresh tokens.

The only route needed for authentication is:<br/>
`https://shopify-backend-summer-2019.herokuapp.com/checkout`

To authenticate, please add an authorization header with a bearer token.

### Logging
A sample of logging output is shown below for the route `/products/:id`

```
{"message":"Starting session 2","body":{},"id":2,"user":"SYSTEM","level":"info"}
{"sessionId":2,"level":"info","message":"begin GET /products/5","body":{},"origin":"API","user":"Unknown user"}
{"sessionId":2,"level":"info","message":"begin products.findOne","body":{"_id":"5"},"origin":"API","user":"Unknown user"}
{"sessionId":2,"level":"info","message":"end products.findOne","body":{"query":[{"_id":"5","title":"e","price":5.99,"inventory_count":0}]},"origin":"API","user":"Unknown user"}
{"sessionId":2,"level":"info","message":"200 GET /products/5","body":{"product":{"_id":"5","title":"e","price":5.99,"inventory_count":0}},"origin":"API","user":"Unknown user"}
```

Descriptive logging is very important for diagnosing future bugs and
vulnerabilities (However, I would sanitize any sensitive information like credit cards).
Without looking at the code, it is very easy to understand the logic that is going on.
This is because every interaction is coupled with a `sessionId` which keeps track of
where the code is going. I think the logging speaks for itself. Try guessing what the
code looks like and compare afterwards!

Logging becomes more important as we introduce users. Let's look at the example below.

```
{"message":"Starting session 1","body":{},"id":1,"user":"SYSTEM","level":"info"}
{"sessionId":1,"level":"info","message":"begin POST /checkout","body":{},"origin":"API","user":"cusadmin"}
{"sessionId":1,"level":"info","message":"begin validateCart","body":{"req":{"total":1.99,"cart":[{"id":"1","quantity":1}]}},"origin":"API","user":"cusadmin"}
{"sessionId":1,"level":"info","message":"end validateCart","body":{"response":true},"origin":"API","user":"cusadmin"}
{"sessionId":1,"level":"info","message":"begin purchase","body":{"cart":[{"id":"1","quantity":1}]},"origin":"API","user":"cusadmin"}
{"sessionId":1,"level":"info","message":"end purchase","body":{"response":true},"origin":"API","user":"cusadmin"}
{"sessionId":1,"level":"info","message":"200 POST /checkout","body":{},"origin":"API","user":"cusadmin"}
```

If we take a close look at the user parameter field, we can see that cusadmin is
making the POST request. This is super important for vulnerabilities to know which
users have been compromised.

And of course, we also have error messages. These can be triggered to be sent to
logging providers like kibana and cloudwatch for up-to-date security issues.

```
{"sessionId":1,"level":"error","message":"500 POST /checkout","body":{"error":"ReferenceError: cart is not defined","stack":"ReferenceError: cart is not defined\n    at Promise.all.then (/Users/dwu/Documents/Shopify Challenges/Summer 2019/Backend Developer Intern/services/products.js:46:36)\n    at process._tickCallback (internal/process/next_tick.js:68:7)"},"origin":"API","user":"cusadmin"}
```

The stack is provided and the user (if available) is provided for debugging.

### Design

Every response to the API is provided with a the parameter isSuccess as shown below:

```
{
    "isSuccess": true,
    "product": {
        "_id": "2",
        "title": "b",
        "price": 2.99,
        "inventory_count": 93
    }
}
```

The parameter, isSuccess, is used for consumers to know if a task has gone through or not.
The parameter will only be true when all operations have succeeded such that the intended feature
has been fulfilled. In this case, the consumer is looking for the product with an id of 2. If it does
not give back a product of id 2, isSuccess will always be false.

This method is used to make lives easier for the frontend, where consumers are guaranteed on the result.

### Remarks
If there are any other questions, feel free to email me at:<br/>
wuon@protonmail.com

With love and passion,<br/>
Daniel Wu











