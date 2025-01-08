from config import app, db
from models import Trip, Place, Activity

def seed_trips():
    """Seed the Trip table."""
    trips_data = [
        {
            "name": "Trip to Paris",
            "start_date": "2025-03-01",
            "end_date": "2025-03-10",
            "description": "A romantic getaway to the City of Light."
        },
        {
            "name": "Trip to New York",
            "start_date": "2025-05-15",
            "end_date": "2025-05-20",
            "description": "Exploring the Big Apple and its iconic landmarks."
        },
        {
            "name": "Trip to Tokyo",
            "start_date": "2025-07-01",
            "end_date": "2025-07-10",
            "description": "Discovering the vibrant culture and cuisine of Tokyo."
        }
    ]

    trips = [
        Trip.from_dict(data) for data in trips_data
    ]

    for trip in trips:
        trip.validate_trip_dates()

    db.session.add_all(trips)
    db.session.commit()
    return trips

def seed_places(trips):
    """Seed the Place table with relationships to existing trips."""
    places = [
        Place(name="Eiffel Tower", trip_id=trips[0].id, description="Iconic tower in Paris."),
        Place(name="Louvre Museum", trip_id=trips[0].id, description="Famous museum in Paris."),
        Place(name="Statue of Liberty", trip_id=trips[1].id, description="Historic statue in New York."),
        Place(name="Times Square", trip_id=trips[1].id, description="Popular tourist destination in New York."),
        Place(name="Mount Fuji", trip_id=trips[2].id, description="Famous mountain in Japan."),
        Place(name="Shibuya Crossing", trip_id=trips[2].id, description="Busy intersection in Tokyo."),
    ]
    db.session.add_all(places)
    db.session.commit()
    return places

def seed_activities(trips, places):
    """Seed the Activity table with relationships to existing trips and places."""
    activities = [
        Activity(name="Climb to the top of the Eiffel Tower", description="Experience stunning views of Paris.", trip_id=trips[0].id, place_id=places[0].id),
        Activity(name="Explore the Louvre", description="Discover world-famous art pieces including the Mona Lisa.", trip_id=trips[0].id, place_id=places[1].id),
        Activity(name="Visit the Statue of Liberty", description="Learn about the history of this iconic statue.", trip_id=trips[1].id, place_id=places[2].id),
        Activity(name="Experience Times Square at night", description="Enjoy the vibrant lights and energy.", trip_id=trips[1].id, place_id=places[3].id),
        Activity(name="Hike Mount Fuji", description="Challenge yourself with a trek to Japan's tallest mountain.", trip_id=trips[2].id, place_id=places[4].id),
        Activity(name="Cross Shibuya Crossing", description="Immerse yourself in the bustling Tokyo vibe.", trip_id=trips[2].id, place_id=places[5].id),
    ]
    db.session.add_all(activities)
    db.session.commit()

def reset_database():
    """Reset the database by dropping all tables and recreating them."""
    with app.app_context():
        db.drop_all()
        db.create_all()

def seed_database():
    """Seed the database with initial data."""
    with app.app_context():
        print("Resetting database...")
        reset_database()

        print("Seeding trips...")
        trips = seed_trips()

        print("Seeding places...")
        places = seed_places(trips)

        print("Seeding activities...")
        seed_activities(trips, places)

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()