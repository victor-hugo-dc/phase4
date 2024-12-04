from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)

# Association Table for Many-to-Many relationship between Portfolio and Tag
portfolio_tags = db.Table(
    'portfolio_tags',
    db.Column('portfolio_id', db.Integer, db.ForeignKey('portfolios.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)


class Artist(db.Model, SerializerMixin):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    bio = db.Column(db.Text)

    # Relationships
    portfolios = db.relationship('Portfolio', back_populates='artist', cascade="all, delete-orphan")

    # Serialization rules
    serialize_rules = ('-portfolios.artist',)

    # Validations
    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name) < 3:
            raise ValueError("Artist name must be at least 3 characters long")
        return name

    def __repr__(self):
        return f"<Artist {self.name}>"


class Portfolio(db.Model, SerializerMixin):
    __tablename__ = 'portfolios'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)

    # Foreign key
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), nullable=False)

    # Relationships
    artist = db.relationship('Artist', back_populates='portfolios')
    tags = db.relationship('Tag', secondary=portfolio_tags, back_populates='portfolios')

    # Serialization rules
    serialize_rules = ('-tags.portfolios', '-artist.portfolios')

    # Validations
    @validates('title')
    def validate_title(self, key, title):
        if not title or len(title) < 5:
            raise ValueError("Portfolio title must be at least 5 characters long")
        return title

    def __repr__(self):
        return f"<Portfolio {self.title}>"


class Tag(db.Model, SerializerMixin):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    # Relationships
    portfolios = db.relationship('Portfolio', secondary=portfolio_tags, back_populates='tags')

    # Serialization rules
    serialize_rules = ('-portfolios.tags',)

    # Validations
    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name) < 2:
            raise ValueError("Tag name must be at least 2 characters long")
        return name

    def __repr__(self):
        return f"<Tag {self.name}>"
