from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from config import db
from datetime import datetime
from sqlalchemy.ext.associationproxy import association_proxy

class Trip(db.Model, SerializerMixin):
    __tablename__ = 'trip'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)

    activities = db.relationship('Activity', back_populates='trip', cascade='all, delete-orphan')
    places = association_proxy('activities', 'place', creator=lambda place_obj: Activity(place=place_obj))

    serialize_rules = ('-activities.trip',)
    # serialize_rules = ('-activities.trip', '-activities.place', '-places.activities')

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
        start_date = datetime.fromisoformat(data['start_date']).date()
        end_date = datetime.fromisoformat(data['end_date']).date()
        return Trip(
            name=data['name'].strip(),
            start_date=start_date,
            end_date=end_date,
            description=data.get('description', '').strip()
        )

class Place(db.Model, SerializerMixin):
    __tablename__ = 'places'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    activities = db.relationship('Activity', back_populates='place', cascade='all, delete-orphan')
    trips = association_proxy('activity', 'trip', creator = lambda trip_obj : Activity(trip = trip_obj))

    serialize_rules = ('-activities.place', '-activities.trip',)

    @validates('name')
    def validate_name(self, key, value):
        if not value or len(value.strip()) < 3:
            raise ValueError("Place name must be at least 3 characters long.")
        return value.strip()


class Activity(db.Model, SerializerMixin):
    __tablename__ = 'activity'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    place_id = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'), nullable=False)

    place = db.relationship('Place', back_populates='activities')
    trip = db.relationship('Trip', back_populates='activities')

    serialize_rules = ('-place.activities', '-trip.activities',)

    @validates('name')
    def validate_name(self, key, value):
        if not value or len(value.strip()) < 3:
            raise ValueError("Activity name must be at least 3 characters long.")
        return value.strip()

    @validates('description')
    def validate_description(self, key, value):
        if value and len(value.strip()) > 500:
            raise ValueError("Description cannot exceed 500 characters.")
        return value.strip()
