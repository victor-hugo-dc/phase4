from config import app, db
from models import Trip, Place, Activity
from faker import Faker
from datetime import timedelta

fake = Faker()

# Initialize Faker
faker = Faker()

# Clear the database and recreate it
def reset_database():
    db.drop_all()
    db.create_all()

# Seed Trips
def seed_trips(num_trips=10):
    trips = []
    for _ in range(num_trips):
        start_date = faker.date_this_year(before_today=True, after_today=False)
        end_date = faker.date_between(start_date=start_date, end_date="+30d")
        trip = Trip(
            name=faker.city(),
            start_date=start_date,
            end_date=end_date,
            description=faker.text(max_nb_chars=200)
        )
        trips.append(trip)
        db.session.add(trip)
    db.session.commit()
    return trips

# Seed Places
def seed_places(trips, max_places_per_trip=5):
    places = []
    for trip in trips:
        for _ in range(faker.random_int(min=1, max=max_places_per_trip)):
            place = Place(
                name=faker.address(),
                trip_id=trip.id,
                description=faker.text(max_nb_chars=150)
            )
            places.append(place)
            db.session.add(place)
    db.session.commit()
    return places

# Seed Activities
def seed_activities(places, max_activities_per_place=5):
    activities = []
    for place in places:
        for _ in range(faker.random_int(min=1, max=max_activities_per_place)):
            activity = Activity(
                name=faker.sentence(nb_words=4),
                place_id=place.id,
                description=faker.text(max_nb_chars=300)
            )
            activities.append(activity)
            db.session.add(activity)
    db.session.commit()
    return activities

# Main seeding function
def seed_database():
    print("Resetting database...")
    reset_database()

    print("Seeding trips...")
    trips = seed_trips()

    print("Seeding places...")
    places = seed_places(trips)

    print("Seeding activities...")
    seed_activities(places)

    print("Database seeding completed!")

if __name__ == "__main__":
    # Ensure the app context is available
    with app.app_context():
        seed_database()
