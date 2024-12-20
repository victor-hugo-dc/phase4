from config import app, db
from models import Trip, Place, Activity, activity_places  # Ensure activity_places is imported
from faker import Faker
from datetime import timedelta

fake = Faker()

def generate_dates():
    """Generate a start date and an end date where end date is always after the start date."""
    start_date = fake.date_this_decade()
    # Ensure end_date is after start_date by adding a random number of days to start_date
    end_date = start_date + timedelta(days=fake.random_int(min=1, max=10))  # Ensures a valid date range
    return start_date, end_date

def generate_trip_name():
    """Ensure the trip name is at least 3 characters long."""
    name = fake.word()
    while len(name) < 3:
        name = fake.word()  # Generate a new word until it's 3 or more characters long
    return name

with app.app_context():
    print("Deleting all records...")
    Trip.query.delete()
    Place.query.delete()
    Activity.query.delete()
    db.session.commit()

    print("Seeding data...")
    for _ in range(5):
        start_date, end_date = generate_dates()
        trip_name = generate_trip_name()  # Ensure the name is at least 3 characters long
        
        trip = Trip(
            name=trip_name,
            start_date=start_date,
            end_date=end_date,
            description=fake.paragraph()
        )
        db.session.add(trip)

        for _ in range(2):
            place = Place(
                name=fake.city(),
                address=fake.address(),
                description=fake.paragraph(),
                trip=trip
            )
            db.session.add(place)

            for _ in range(3):
                # Create the activity and ensure it is committed to get an ID
                activity = Activity(
                    name=fake.word(),
                    type=fake.word(),
                    rating=fake.random_int(min=1, max=5),
                    cost=fake.random_int(min=10, max=500)  # Ensure valid cost
                )
                db.session.add(activity)
                db.session.commit()  # Commit here to ensure the activity ID is generated

                # Now insert into the activity_places association table
                activity_place = activity_places.insert().values(
                    activity_id=activity.id,  # Now activity.id is available
                    place_id=place.id,
                    cost=activity.cost
                )
                db.session.execute(activity_place)

    db.session.commit()
    print("Seeding complete.")
