This project was created with [Django](https://www.djangoproject.com/).

In order for you to be able to run the application, you must first run:
* `pip install -r requirements.txt`
* `python manage.py makemigrations`
* `python manage.py migrate`
* `python manage.py runserver`


## Available Scripts

In the project directory, you can run:

### `python manage.py makemigrations`

Responsible for creating new migrations based on the changes you have made to your models. 
If you run the project for the first time, first run this script.

### `python manage.py migrate`

Responsible for applying and not applying migrations.
If there is no database (SQlite), one will be created with all migrations.
If you run the project for the first time, run this script after running `python manage.py makemigrations`

For others databases engines look at [databases](https://docs.djangoproject.com/en/3.1/ref/databases/)

### `python manage.py runserver`

Runs the app in the development mode if debug mode is disabled or in production mode if debug mode is enabled.<br />
Open [http://127.0.0.1:8000](http://127.0.0.1:8000) to view it in the browser.

In debug mode the page will reload if you make edits. In case debug mode is disabled, you should stop the server and re run it again in order of the new changes to take effect<br />
You will also see any lint errors in the console.

### `python manage.py test`

Launches the test runner in the interactive watch mode.<br />
See the section about [writing and running tests](https://docs.djangoproject.com/en/3.1/topics/testing/) for more information.


## Learn more about Django

You can learn more in the [Django documentation](https://www.djangoproject.com/).


# Specification

This project corresponds to a series of projects covered by the course [CS50’s Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/)


* New Post: Users who are signed in are able to write a new text-based post.

* All Posts: The “All Posts” link in the navigation bar takes the user to a page where they can see all posts from all users, with the most recent posts first.
Each post include the username of the poster, the post content itself, the date and time at which the post was made, and the number of “likes” the post has.

* Profile Page: By clicking on a username, the user's profile is displayed with all the posts that user wrote.
For any other user who is signed in, this page also display a “Follow” or “Unfollow” button that will let the current user toggle whether or not they are following this user’s posts.

* Following: The “Following” link in the navigation bar takes the user to a page where they see all posts made by users that the current user follows.

* Pagination: On any page that displays posts, posts are only displayed 10 on a page. If there are more than ten posts, a “Next” button appear to take the user to the next page of posts. If not on the first page, a “Previous” button should appear to take the user to the previous page of posts as well.

* Edit Post: Users are able to click an “Edit” button on any of their own posts to edit that post.
When a user clicks “Edit” for one of their own posts, the content of their post is replaced with a textarea where the user can edit the content of their post.

* “Like” and “Unlike”: Users are able to click a button on any post to toggle whether or not they “like” that post.




