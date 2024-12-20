#!/usr/bin/env python3

from flask import request
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import Trip, Place, Activity


# Resources
class TripResource(Resource):

    def post(self):
        """Create a new trip."""
        data = request.get_json()

        trip = Trip(
            name=data['name'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            description=data['description']
        )

        try:
            db.session.add(trip)
            db.session.commit()
            return trip.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': '422 Unprocessable Entity'}, 422

    def get(self, trip_id=None):
        """Get a list of all trips or a single trip by trip_id."""
        if trip_id:
            # Fetch a specific trip by ID
            trip = Trip.query.get_or_404(trip_id)  # Will return 404 if trip not found
            return trip.to_dict(), 200
        else:
            # Fetch all trips if no trip_id is provided
            trips = Trip.query.all()
            return [trip.to_dict() for trip in trips], 200


class PlaceResource(Resource):

    def post(self, trip_id):
        """Create a place for a specific trip."""
        data = request.get_json()
        trip = Trip.query.get_or_404(trip_id)

        place = Place(
            name=data['name'],
            address=data['address'],
            description=data['description'],
            trip=trip
        )

        try:
            db.session.add(place)
            db.session.commit()
            return place.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': '422 Unprocessable Entity'}, 422

    def get(self, trip_id=None):
        """List all places for a specific trip, or all places if no trip_id is provided."""
        if trip_id:
            trip = Trip.query.get_or_404(trip_id)
            places = Place.query.filter_by(trip_id=trip.id).all()
        else:
            places = Place.query.all()

        return [place.to_dict() for place in places], 200


class ActivityResource(Resource):

    def post(self, place_id):
        """Add an activity to a place."""
        data = request.get_json()
        place = Place.query.get_or_404(place_id)

        activity = Activity(
            name=data['name'],
            type=data['type'],
            rating=data['rating'],
            cost=data['cost']
        )

        try:
            db.session.add(activity)
            db.session.commit()
            place.activities.append(activity)
            db.session.commit()
            return activity.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': '422 Unprocessable Entity'}, 422

    def get(self, place_id=None):
        """List all activities for a specific place, or all activities if no place_id is provided."""
        if place_id:
            place = Place.query.get_or_404(place_id)
            activities = Activity.query.filter_by(place_id=place.id).all()
        else:
            activities = Activity.query.all()

        return [activity.to_dict() for activity in activities], 200


# Register Resources
api.add_resource(TripResource, '/trips', endpoint='trips')
api.add_resource(TripResource, '/trips/<int:trip_id>', endpoint='trip')
api.add_resource(PlaceResource, '/trips/<int:trip_id>/places', endpoint='trip_places')
api.add_resource(PlaceResource, '/places', endpoint='places')
api.add_resource(ActivityResource, '/places/<int:place_id>/activities', endpoint='place_activities')
api.add_resource(ActivityResource, '/activities', endpoint='activities')


# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
