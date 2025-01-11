from datetime import datetime
from app import app
from models import db, Trip, Place, Activity

with app.app_context():
    # Clear existing data
    Activity.query.delete()
    Place.query.delete()
    Trip.query.delete()
    db.session.commit()

    # Add places
    place1 = Place(name="Grand Canyon", description="A stunning natural wonder in Arizona.")
    place2 = Place(name="Yellowstone National Park", description="A park known for its geothermal features and wildlife.")
    place3 = Place(name="Yosemite National Park", description="Famous for its granite cliffs, waterfalls, and giant sequoias.")
    place4 = Place(name="Zion National Park", description="Known for its steep red cliffs and scenic canyon views.")
    place5 = Place(name="Bryce Canyon National Park", description="Famous for its unique red rock formations called hoodoos.")
    place6 = Place(name="Arches National Park", description="Renowned for its over 2,000 natural stone arches.")
    place7 = Place(name="Glacier National Park", description="Featuring pristine wilderness, alpine scenery, and glacial lakes.")
    place8 = Place(name="Rocky Mountain National Park", description="Home to majestic peaks and diverse wildlife.")
    place9 = Place(name="Great Smoky Mountains National Park", description="Known for its mist-covered mountains and rich biodiversity.")
    place10 = Place(name="Everglades National Park", description="A unique ecosystem of wetlands, home to diverse wildlife.")

    db.session.add_all([place1, place2, place3, place4, place5, place6, place7, place8, place9, place10])
    db.session.commit()

    # Add trips
    trip1 = Trip(
        name="Southwest Adventure",
        start_date=datetime(2025, 4, 10).date(),
        end_date=datetime(2025, 4, 20).date(),
        description="An exciting adventure through the American Southwest."
    )

    trip2 = Trip(
        name="National Park Expedition",
        start_date=datetime(2025, 5, 1).date(),
        end_date=datetime(2025, 5, 15).date(),
        description="Exploring some of the most iconic national parks."
    )

    db.session.add_all([trip1, trip2])
    db.session.commit()

    # Add activities and associate them with trips and places
    activity1 = Activity(
        name="Hiking the Bright Angel Trail",
        description="A challenging yet rewarding hike into the Grand Canyon.",
        place=place1,
        trip=trip1
    )

    activity2 = Activity(
        name="Watching Old Faithful Geyser",
        description="Witness the eruption of this famous geyser.",
        place=place2,
        trip=trip2
    )

    activity3 = Activity(
        name="Rock Climbing in Yosemite",
        description="Experience rock climbing on Yosemite's famous cliffs.",
        place=place3,
        trip=trip2
    )

    db.session.add_all([activity1, activity2, activity3])
    db.session.commit()

    print("Database seeded successfully!")
