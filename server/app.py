#!/usr/bin/env python3

from flask import request
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import Artist, Portfolio, Tag


# Resources
class ArtistResource(Resource):

    def post(self):
        """Create a new artist."""
        data = request.get_json()

        artist = Artist(name=data['name'], bio=data['bio'])

        try:
            db.session.add(artist)
            db.session.commit()
            return artist.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': '422 Unprocessable Entity'}, 422

    def get(self):
        """List all artists."""
        artists = Artist.query.all()
        return [artist.to_dict() for artist in artists], 200


class PortfolioResource(Resource):

    def post(self, artist_id):
        """Create a portfolio for a specific artist."""
        data = request.get_json()
        artist = Artist.query.get_or_404(artist_id)

        portfolio = Portfolio(
            title=data['title'],
            description=data['description'],
            artist=artist
        )

        try:
            db.session.add(portfolio)
            db.session.commit()
            return portfolio.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': '422 Unprocessable Entity'}, 422

    def get(self):
        """List all portfolios."""
        portfolios = Portfolio.query.all()
        return [portfolio.to_dict() for portfolio in portfolios], 200


class TagResource(Resource):

    def post(self, portfolio_id):
        """Add tags to a portfolio."""
        data = request.get_json()
        portfolio = Portfolio.query.get_or_404(portfolio_id)

        tags = [Tag(name=tag_name) for tag_name in data['tags']]
        portfolio.tags.extend(tags)

        try:
            db.session.commit()
            return portfolio.to_dict(), 200
        except IntegrityError:
            db.session.rollback()
            return {'error': '422 Unprocessable Entity'}, 422


# Register Resources
api.add_resource(ArtistResource, '/artists', endpoint='artists')
api.add_resource(PortfolioResource, '/artists/<int:artist_id>/portfolios', endpoint='artist_portfolios')
api.add_resource(PortfolioResource, '/portfolios', endpoint='portfolios')
api.add_resource(TagResource, '/portfolios/<int:portfolio_id>/tags', endpoint='portfolio_tags')


# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
