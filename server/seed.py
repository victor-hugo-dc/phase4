from config import app, db
from models import Artist, Portfolio, Tag
from faker import Faker

fake = Faker()

with app.app_context():
    print("Deleting all records...")
    Artist.query.delete()
    Portfolio.query.delete()
    Tag.query.delete()
    db.session.commit()

    print("Seeding data...")
    for _ in range(5):
        artist = Artist(name=fake.name(), bio=fake.paragraph())
        db.session.add(artist)

        for _ in range(2):
            portfolio = Portfolio(
                title=fake.sentence(),
                description=fake.paragraph(),
                artist=artist
            )
            db.session.add(portfolio)

    db.session.commit()
    print("Seeding complete.")
