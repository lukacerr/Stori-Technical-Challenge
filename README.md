# Stori Technical Challenge

By **[Luka Cerrutti](https://www.linkedin.com/in/lce)**.

## Environment set-up

> The `.env` files are not versioned inside this repository.

Inside both projects, [api](/api/.env.example) and [client](/client/.env.example), there are `.env.example` files: From this base, we copy their content inside a new `.env` file in the same directory of the example.

_We must then have two new non-versioned files at `api/.env` and `client/.env`._

### Build & execute preview

##### Requirements

Only software requirement is a containerization technology compatible with docker-compose files (like [Docker](https://www.docker.com/) or [Podman](https://podman.io/)). As explained [before](#environment-set-up), environment files must be all set-up.

###### Execution command:

```
docker-compose up
```

_From here, we can work with the generated network & containers as any other multi-containerized application. For Docker and Compose users, see the [official compose docs](https://docs.docker.com/compose/)._

## Application tour -> Step by step example

> API documentation can be found navigating `/docs` API [route](http://localhost:5000/docs/).

##### Step 1: Create categories

Categories are used to group news.

Navigate to the `/admin` frontend route (assuming local-hosting on port 3000, would be http://localhost:3000/admin). The panel's password is whatever string set as `ADMIN_PASSWORD` of the backend's [.env file](./api/.env) _(as in the example, **123456**)_.

##### Step 2: Subscribe an email

Navigating to the [root of the application](http://localhost:3000/), we can subscribe an email to one or more categories. The recipient will recive exclusively news that have this category assigned.

##### Step 3: Send/schedule a new

Going back to the admin's panel as we did in [step 1](#step-1-create-categories), and scrolling all the way to the bottom upon the last section, we can intuitively send and/or schedule a new.

##### Step 4: Accessing incoming new in mail inbox

> Since no SMTP server access was provided, the application uses [WPOven's free SMTP server for testing](https://www.wpoven.com/tools/free-smtp-server-for-testing).

Inside the WPOven's page (https://www.wpoven.com/tools/free-smtp-server-for-testing), enter the email that we subscribed on [step 2](#step-2-subscribe-an-email) and click **Access Inbox**.

##### Step 5: Unsubscribing

In mail's footer there is an _unsubscribe_ anchor link that redirects to the frontend `/unsubscribe` [route](http://localhost:3000/unsubscribe), where we can update our subscription; either removing certain or all categories.
