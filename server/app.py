#!/usr/bin/env python3

from flask import request, jsonify
from flask_restful import Resource
from config import app, db, api
from models import Trip, Place, Activity
from datetime import datetime

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        raise ValueError("Invalid date format. Expected 'YYYY-MM-DD'.")

# Resources
class TripListResource(Resource):
    def get(self):
        trips = Trip.query.all()

        result = []
        for trip in trips:
            trip_dict = trip.to_dict(only=('places', 'id', 'name', 'description', 'start_date', 'end_date'))
            for place in trip_dict['places']:
                place['activities'] = [
                    activity for activity in place['activities'] if activity['trip_id'] == trip.id
                ]
            result.append(trip_dict)

        return result, 200

    def post(self):
        data = request.get_json()
        try:
            if not data.get('name') or not data.get('start_date') or not data.get('end_date'):
                return {'error': 'Name, start_date, and end_date are required fields.'}, 400

            trip = Trip(
                name=data['name'],
                start_date=parse_date(data['start_date']),
                end_date=parse_date(data['end_date']),
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

    def put(self, trip_id):
        trip = Trip.query.get_or_404(trip_id)
        data = request.get_json()
        try:
            if not data.get('name') or not data.get('start_date') or not data.get('end_date'):
                return {'error': 'Name, start_date, and end_date are required fields.'}, 400

            trip.name = data['name']
            trip.start_date = parse_date(data['start_date'])
            trip.end_date = parse_date(data['end_date'])
            trip.description = data.get('description', trip.description)
            db.session.commit()
            return trip.to_dict(), 200
        except Exception as e:
            return {'error': str(e)}, 400

    def patch(self, trip_id):
        trip = Trip.query.get_or_404(trip_id)
        data = request.get_json()
        try:
            if 'name' in data:
                trip.name = data['name']
            if 'start_date' in data:
                trip.start_date = parse_date(data['start_date'])
            if 'end_date' in data:
                trip.end_date = parse_date(data['end_date'])
            if 'description' in data:
                trip.description = data['description']
            db.session.commit()
            return trip.to_dict(), 200
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, trip_id):
        trip = Trip.query.get_or_404(trip_id)
        db.session.delete(trip)
        db.session.commit()
        return {'message': 'Trip deleted successfully'}, 204


class PlaceListResource(Resource):
    def get(self):
        places = Place.query.all()
        return [place.to_dict() for place in places], 200

    def post(self):
        data = request.get_json()
        try:
            place = Place(name=data['name'], description=data.get('description', ''))
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
            if not data.get('name'):
                return {'error': 'Name is required.'}, 400

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


class ActivityListResource(Resource):
    def get(self):
        activities = Activity.query.all()
        return [activity.to_dict() for activity in activities], 200

    def post(self):
        data = request.get_json()
        try:
            if not data.get('name') or not data.get('trip_id') or not data.get('place_id'):
                return {'error': 'Name, Trip ID, and Place ID are required fields.'}, 400

            activity = Activity(
                name=data['name'],
                description=data.get('description', ''),
                trip_id=data['trip_id'],
                place_id=data['place_id']
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
            activity.trip_id = data.get('trip_id', activity.trip_id)
            activity.place_id = data.get('place_id', activity.place_id)
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
api.add_resource(TripListResource, '/trips')
api.add_resource(TripResource, '/trips/<int:trip_id>')
api.add_resource(PlaceListResource, '/places')
api.add_resource(PlaceResource, '/places/<int:place_id>')
api.add_resource(ActivityListResource, '/activities')
api.add_resource(ActivityResource, '/activities/<int:activity_id>')

# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
