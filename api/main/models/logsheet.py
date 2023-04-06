from main import db
from datetime import datetime, timezone


def get_utc_today():
    return datetime.utcnow().date()


class Logsheet(db.Model):
    today = get_utc_today()

    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer)
    date_created = db.Column(db.DateTime, default=today)
    date_number = db.Column(db.String)

    def __init__(self) -> None:
        today = get_utc_today()

        cur_date_logs = Logsheet.query.filter_by(date_created=today).all()

        date_id = len(cur_date_logs) + 1

        self.date_number = today.strftime("%Y%m%d") + "." + str(date_id).zfill(3)

    def __repr__(self):
        return {self.date_number}

    def __iter__(self):
        return iter([self.id, self.date_number])
