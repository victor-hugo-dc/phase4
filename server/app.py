#!/usr/bin/env python3

from flask import request
from flask_restful import Resource

from config import app, db, api
from models import Trip, Place, Activity
from datetime import datetime, date

# Resources
class TripListResource(Resource):
    def get(self):
        trips = Trip.query.all()
        return [trip.to_dict() for trip in trips], 200

    def post(self):
        data = request.get_json()
        try:
            # Convert start_date and end_date from string to date object
            start_date = datetime.fromisoformat(data['start_date']).date()
            end_date = datetime.fromisoformat(data['end_date']).date()

            trip = Trip(
                name=data['name'],
                start_date=start_date,
                end_date=end_date,
                description=data.get('description', '')
            )
            db.session.add(trip)
            db.session.commit()
            return trip.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 400

class TripResource(Resource):
    def get(self, trip_id):
        trip = Trip.query.get_or_404(trip_id)
        return trip.to_dict(), 200

    def post(self):
        data = request.get_json()

        try:
            # Use the from_dict method to handle date conversion
            new_trip = Trip.from_dict(data)

            # Add the new trip to the session and commit to the database
            db.session.add(new_trip)
            db.session.commit()

            # Return the created trip as a dictionary
            return new_trip.to_dict(), 201

        except Exception as e:
            # Return the error message if something goes wrong
            return {'error': str(e)}, 400

    def put(self, trip_id):
        trip = Trip.query.get_or_404(trip_id)
        data = request.get_json()
        try:
            # Ensure start_date and end_date are valid strings in 'YYYY-MM-DD' format
            trip.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            trip.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            trip.name = data['name']
            trip.description = data.get('description', trip.description)
            
            db.session.commit()
            return trip.to_dict(), 200
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, trip_id):
        trip = Trip.query.get_or_404(trip_id)
        db.session.delete(trip)
        db.session.commit()
        return {'message': 'Trip deleted successfully'}, 204
    
# Place Resources
class PlaceListResource(Resource):
    def get(self):
        places = Place.query.all()
        return [place.to_dict() for place in places], 200

    def post(self):
        data = request.get_json()
        try:
            place = Place(
                name=data['name'],
                trip_id=data['trip_id'],
                description=data.get('description', '')
            )
            db.session.add(place)
            db.session.commit()
            return place.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 400

class PlaceResource(Resource):
    def get(self, place_id):
        place = Place.query.get_or_404(place_id)
        return place.to_dict(), 200

    def put(self, place_id):
        place = Place.query.get_or_404(place_id)
        data = request.get_json()
        try:
            place.name = data['name']
            place.description = data.get('description', place.description)
            db.session.commit()
            return place.to_dict(), 200
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, place_id):
        place = Place.query.get_or_404(place_id)
        db.session.delete(place)
        db.session.commit()
        return {'message': 'Place deleted successfully'}, 204

# Activity Resources
class ActivityListResource(Resource):
    def get(self):
        activities = Activity.query.all()
        return [activity.to_dict() for activity in activities], 200

    def post(self):
        data = request.get_json()
        try:
            activity = Activity(
                name=data['name'],
                place_id=data['place_id'],
                description=data.get('description', '')
            )
            db.session.add(activity)
            db.session.commit()
            return activity.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 400

class ActivityResource(Resource):
    def get(self, activity_id):
        activity = Activity.query.get_or_404(activity_id)
        return activity.to_dict(), 200

    def put(self, activity_id):
        activity = Activity.query.get_or_404(activity_id)
        data = request.get_json()
        try:
            activity.name = data['name']
            activity.description = data.get('description', activity.description)
            db.session.commit()
            return activity.to_dict(), 200
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, activity_id):
        activity = Activity.query.get_or_404(activity_id)
        db.session.delete(activity)
        db.session.commit()
        return {'message': 'Activity deleted successfully'}, 204


# Register Resources
api.add_resource(TripListResource, '/trips')  # List all trips / Create a new trip
api.add_resource(TripResource, '/trips/<int:trip_id>')  # Get, Update, or Delete a specific trip

api.add_resource(PlaceListResource, '/places')  # List all places / Create a new place
api.add_resource(PlaceResource, '/places/<int:place_id>')  # Get, Update, or Delete a specific place

api.add_resource(ActivityListResource, '/activities')  # List all activities / Create a new activity
api.add_resource(ActivityResource, '/activities/<int:activity_id>')  # Get, Update, or Delete a specific activity


# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
