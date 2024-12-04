#!/usr/bin/env python3

from random import randint, choice as rc, sample
from faker import Faker

from app import app
from models import db, Artist, Portfolio, Tag

fake = Faker()

with app.app_context():

    print("Deleting all records...")
    Artist.query.delete()
    Portfolio.query.delete()
    Tag.query.delete()

    print("Creating artists...")

    artists = []
    for _ in range(10):  # Create 10 artists
        artist = Artist(
            name=fake.name(),
            bio=fake.paragraph(nb_sentences=3)
        )
        artists.append(artist)

    db.session.add_all(artists)
    db.session.commit()

    print("Creating tags...")

    tags = []
    tag_names = ["Abstract", "Modern", "Classic", "Impressionist", "Portrait", "Landscape", "Minimalist", "Realism"]

    for name in tag_names:
        tag = Tag(name=name)
        tags.append(tag)

    db.session.add_all(tags)
    db.session.commit()

    print("Creating portfolios...")

    portfolios = []
    for _ in range(20):  # Create 20 portfolios
        portfolio = Portfolio(
            title=fake.sentence(nb_words=3),
            description=fake.paragraph(nb_sentences=5),
            artist=rc(artists),  # Randomly assign an artist
        )

        # Assign 1-3 random tags to the portfolio
        portfolio.tags.extend(sample(tags, randint(1, 3)))

        portfolios.append(portfolio)

    db.session.add_all(portfolios)
    db.session.commit()

    print("Seeding complete.")
