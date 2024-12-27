from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from config import db
from datetime import datetime

# Association table for many-to-many relationship
activities_trips = db.Table('activities_trips',
    db.Column('activity_id', db.Integer, db.ForeignKey('activity.id'), primary_key=True),
    db.Column('trip_id', db.Integer, db.ForeignKey('trip.id'), primary_key=True),
    db.Column('rating', db.Float)  # User-submittable attribute
)


class Trip(db.Model, SerializerMixin):
    __tablename__ = 'trip'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)
    
    places = db.relationship('Place', backref='trip', cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-places.trip',)

    @validates('name')
    def validate_name(self, key, value):
        if not value or len(value.strip()) < 3:
            raise ValueError("Trip name must be at least 3 characters long.")
        return value.strip()

    @validates('start_date', 'end_date')
    def validate_dates(self, key, value):
        if not value:
            raise ValueError(f"{key} is required.")
        return value

    def validate_trip_dates(self):
        if self.start_date >= self.end_date:
            raise ValueError("Start date must be before end date.")
    
    @staticmethod
    def from_dict(data):
        """Create an instance of Trip from a dictionary."""
        # Convert date strings into Python date objects
        start_date = datetime.fromisoformat(data['start_date']).date()
        end_date = datetime.fromisoformat(data['end_date']).date()

        return Trip(
            name=data['name'],
            start_date=start_date,
            end_date=end_date,
            description=data.get('description')
        )

class Place(db.Model, SerializerMixin):
    __tablename__ = 'place'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'), nullable=False)
    description = db.Column(db.Text)
    activities = db.relationship('Activity', backref='place', cascade='all, delete-orphan')

    serialize_rules = ('-trip', '-activities.place')

    @validates('name')
    def validate_name(self, key, value):
        if not value or len(value.strip()) < 3:
            raise ValueError("Place name must be at least 3 characters long.")
        return value.strip()


class Activity(db.Model, SerializerMixin):
    __tablename__ = 'activity'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    description = db.Column(db.Text)
    trips = db.relationship('Trip', secondary=activities_trips, backref='activities')

    @validates('name')
    def validate_name(self, key, value):
        if not value or len(value.strip()) < 3:
            raise ValueError("Activity name must be at least 3 characters long.")
        return value.strip()

    @validates('description')
    def validate_description(self, key, value):
        if len(value.strip()) > 500:
            raise ValueError("Description cannot exceed 500 characters.")
        return value.strip()
