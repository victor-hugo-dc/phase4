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

    def get(self):
        """List all trips."""
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

    def get(self):
        """List all places."""
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

    def get(self):
        """List all activities."""
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
