from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from config import db

# Association Table for Many-to-Many relationship between Activities and Places
activity_places = db.Table(
    'activity_places',
    db.Column('activity_id', db.Integer, db.ForeignKey('activities.id'), primary_key=True),
    db.Column('place_id', db.Integer, db.ForeignKey('places.id'), primary_key=True),
    db.Column('cost', db.Float, nullable=False)  # User-submittable cost for each activity at each place
)


class Trip(db.Model, SerializerMixin):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)

    # Relationships
    places = db.relationship('Place', back_populates='trip', cascade="all, delete-orphan")

    # Serialization rules
    serialize_rules = ('-places.trip',)

    # Validations
    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name) < 3:
            raise ValueError("Trip name must be at least 3 characters long")
        return name

    @validates('start_date', 'end_date')
    def validate_dates(self, key, date):
        if key == 'end_date' and date <= self.start_date:
            raise ValueError("End date must be after start date")
        return date

    def __repr__(self):
        return f"<Trip {self.name}>"


class Place(db.Model, SerializerMixin):
    __tablename__ = 'places'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)

    # Foreign key
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)

    # Relationships
    trip = db.relationship('Trip', back_populates='places')
    activities = db.relationship('Activity', secondary=activity_places, back_populates='places')

    # Serialization rules
    serialize_rules = ('-trip.places', '-activities.places')

    # Validations
    @validates('name', 'address')
    def validate_fields(self, key, value):
        if key == 'name' and (not value or len(value) < 3):
            raise ValueError("Place name must be at least 3 characters long")
        if key == 'address' and (not value or len(value) < 5):
            raise ValueError("Address must be at least 5 characters long")
        return value

    def __repr__(self):
        return f"<Place {self.name}>"


class Activity(db.Model, SerializerMixin):
    __tablename__ = 'activities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # e.g., "Hiking," "Dining"
    rating = db.Column(db.Integer, nullable=False)  # Rating from 1 to 5
    cost = db.Column(db.Float, nullable=False)  # Cost of the activity

    # Relationships
    places = db.relationship('Place', secondary=activity_places, back_populates='activities')

    # Serialization rules
    serialize_rules = ('-places.activities',)

    # Validations
    @validates('name', 'rating', 'cost')
    def validate_fields(self, key, value):
        if key == 'name' and (not value or len(value) < 3):
            raise ValueError("Activity name must be at least 3 characters long")
        if key == 'rating' and (value < 1 or value > 5):
            raise ValueError("Rating must be between 1 and 5")
        if key == 'cost' and value <= 0:
            raise ValueError("Cost must be a positive number")
        return value

    def __repr__(self):
        return f"<Activity {self.name}>"
